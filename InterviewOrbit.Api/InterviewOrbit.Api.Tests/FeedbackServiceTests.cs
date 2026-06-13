using System.Linq;
using InterviewOrbit.Api.Application.DTOs;
using InterviewOrbit.Api.Application.Services;
using Xunit;

namespace InterviewOrbit.Api.Tests;

// Unit tests for the deterministic feedback engine (FeedbackService).
// Each test follows Arrange-Act-Assert and checks ONE behavior.
// Coverage includes positive, negative, and boundary cases for:
// filler-word count, words-per-minute, pacing label, clarity notes,
// topic coverage, and the single improvement suggestion.
public class FeedbackServiceTests
{
    private readonly FeedbackService _service = new();

    // ---- helpers --------------------------------------------------------

    // Builds a transcript of `count` copies of `word` separated by spaces,
    // giving an exact, controllable word count.
    private static string Repeat(string word, int count) =>
        string.Join(" ", Enumerable.Repeat(word, count));

    private static FeedbackRequestDto Request(
        string transcript,
        int durationSeconds = 60,
        string[]? keywords = null) =>
        new(transcript, durationSeconds, null, keywords);

    // ---- filler-word count ---------------------------------------------

    [Fact]
    public void Analyze_WithThreeDistinctFillers_CountsThree()
    {
        // Arrange
        var request = Request("Um, I uh think basically yes.");

        // Act
        var result = _service.Analyze(request);

        // Assert
        Assert.Equal(3, result.FillerWordCount);
    }

    [Fact]
    public void Analyze_WithNoFillers_CountsZero()
    {
        // Arrange
        var request = Request("I led the team to deliver the project on time.");

        // Act
        var result = _service.Analyze(request);

        // Assert
        Assert.Equal(0, result.FillerWordCount);
    }

    [Fact]
    public void Analyze_FillerMatching_IsCaseInsensitive()
    {
        // Arrange
        var request = Request("UM um Um");

        // Act
        var result = _service.Analyze(request);

        // Assert
        Assert.Equal(3, result.FillerWordCount);
    }

    [Fact]
    public void Analyze_DoesNotCountFillerSubstringsInsideOtherWords()
    {
        // Arrange - "likely"/"unlike" contain "like", "thumb" contains "um",
        // but none are filler words on their own.
        var request = Request("Their likely outcome was unlike my thumb.");

        // Act
        var result = _service.Analyze(request);

        // Assert
        Assert.Equal(0, result.FillerWordCount);
    }

    [Fact]
    public void Analyze_CountsMultiWordFiller_YouKnow()
    {
        // Arrange
        var request = Request("You know, I planned ahead.");

        // Act
        var result = _service.Analyze(request);

        // Assert
        Assert.Equal(1, result.FillerWordCount);
    }

    [Fact]
    public void Analyze_WithEmptyTranscript_CountsZeroFillers()
    {
        // Arrange
        var request = Request("");

        // Act
        var result = _service.Analyze(request);

        // Assert
        Assert.Equal(0, result.FillerWordCount);
    }

    // ---- words per minute ----------------------------------------------

    [Fact]
    public void Analyze_With150WordsIn60Seconds_Returns150Wpm()
    {
        // Arrange
        var request = Request(Repeat("alpha", 150), durationSeconds: 60);

        // Act
        var result = _service.Analyze(request);

        // Assert
        Assert.Equal(150.0, result.WordsPerMinuteEstimate);
    }

    [Fact]
    public void Analyze_With75WordsIn30Seconds_Returns150Wpm()
    {
        // Arrange
        var request = Request(Repeat("alpha", 75), durationSeconds: 30);

        // Act
        var result = _service.Analyze(request);

        // Assert
        Assert.Equal(150.0, result.WordsPerMinuteEstimate);
    }

    [Fact]
    public void Analyze_WithZeroDuration_DoesNotDivideByZero()
    {
        // Arrange - duration is clamped to a minimum of 1 second.
        var request = Request(Repeat("alpha", 10), durationSeconds: 0);

        // Act
        var result = _service.Analyze(request);

        // Assert - 10 words / (1/60 min) = 600 wpm, and no exception thrown.
        Assert.Equal(600.0, result.WordsPerMinuteEstimate);
    }

    [Fact]
    public void Analyze_WithEmptyTranscript_ReturnsZeroWpm()
    {
        // Arrange
        var request = Request("", durationSeconds: 60);

        // Act
        var result = _service.Analyze(request);

        // Assert
        Assert.Equal(0.0, result.WordsPerMinuteEstimate);
    }

    // ---- pacing label (boundaries: < 90 slow, <= 170 balanced, else fast)

    [Fact]
    public void Analyze_BelowSlowThreshold_LabelsPacingSlow()
    {
        // Arrange - 89 words in 60s => 89 wpm (< 90).
        var request = Request(Repeat("alpha", 89), durationSeconds: 60);

        // Act
        var result = _service.Analyze(request);

        // Assert
        Assert.Equal("A little slow", result.PacingLabel);
    }

    [Fact]
    public void Analyze_AtLowBalancedBoundary_LabelsPacingBalanced()
    {
        // Arrange - 90 words in 60s => 90 wpm (boundary, not slow).
        var request = Request(Repeat("alpha", 90), durationSeconds: 60);

        // Act
        var result = _service.Analyze(request);

        // Assert
        Assert.Equal("Balanced", result.PacingLabel);
    }

    [Fact]
    public void Analyze_AtHighBalancedBoundary_LabelsPacingBalanced()
    {
        // Arrange - 170 words in 60s => 170 wpm (boundary, still balanced).
        var request = Request(Repeat("alpha", 170), durationSeconds: 60);

        // Act
        var result = _service.Analyze(request);

        // Assert
        Assert.Equal("Balanced", result.PacingLabel);
    }

    [Fact]
    public void Analyze_AboveBalancedThreshold_LabelsPacingFast()
    {
        // Arrange - 171 words in 60s => 171 wpm (> 170).
        var request = Request(Repeat("alpha", 171), durationSeconds: 60);

        // Act
        var result = _service.Analyze(request);

        // Assert
        Assert.Equal("A little fast", result.PacingLabel);
    }

    // ---- clarity notes -------------------------------------------------

    [Fact]
    public void Analyze_WithShortAnswer_GivesShortAnswerClarityNote()
    {
        // Arrange - fewer than 25 words.
        var request = Request(Repeat("alpha", 10), durationSeconds: 60);

        // Act
        var result = _service.Analyze(request);

        // Assert
        Assert.Equal(
            "Your answer is very short. Add one concrete example and one clear result.",
            result.ClarityNotes);
    }

    [Fact]
    public void Analyze_WithManyFillers_GivesFillerClarityNote()
    {
        // Arrange - 26 words (>= 25) with 6 fillers (>= 6).
        var transcript = Repeat("um", 6) + " " + Repeat("alpha", 20);
        var request = Request(transcript, durationSeconds: 60);

        // Act
        var result = _service.Analyze(request);

        // Assert
        Assert.Equal(
            "Your ideas are present, but filler words may reduce clarity.",
            result.ClarityNotes);
    }

    [Fact]
    public void Analyze_WithVeryLongAnswer_GivesTighterStructureClarityNote()
    {
        // Arrange - more than 180 words, no fillers.
        var request = Request(Repeat("alpha", 181), durationSeconds: 60);

        // Act
        var result = _service.Analyze(request);

        // Assert
        Assert.Equal(
            "Your answer has substance, but it may benefit from a tighter structure.",
            result.ClarityNotes);
    }

    [Fact]
    public void Analyze_WithReasonableAnswer_GivesReasonableClarityNote()
    {
        // Arrange - between 25 and 180 words, no fillers.
        var request = Request(Repeat("alpha", 100), durationSeconds: 60);

        // Act
        var result = _service.Analyze(request);

        // Assert
        Assert.Equal(
            "Your answer length is reasonable for a practice response.",
            result.ClarityNotes);
    }

    // ---- topic coverage ------------------------------------------------

    [Fact]
    public void Analyze_WithNullKeywords_ReportsNoKeywordsSupplied()
    {
        // Arrange
        var request = Request("Any answer text.", keywords: null);

        // Act
        var result = _service.Analyze(request);

        // Assert
        Assert.Equal(
            "No target keywords were supplied for this prompt.",
            result.TopicCoverageNotes);
    }

    [Fact]
    public void Analyze_WithEmptyKeywords_ReportsNoKeywordsSupplied()
    {
        // Arrange
        var request = Request("Any answer text.", keywords: System.Array.Empty<string>());

        // Act
        var result = _service.Analyze(request);

        // Assert
        Assert.Equal(
            "No target keywords were supplied for this prompt.",
            result.TopicCoverageNotes);
    }

    [Fact]
    public void Analyze_WhenAllKeywordsPresent_ReportsFullCoverage()
    {
        // Arrange
        var request = Request(
            "communication and teamwork win",
            keywords: new[] { "communication", "teamwork" });

        // Act
        var result = _service.Analyze(request);

        // Assert
        Assert.Equal("Matched 2 of 2 target keywords.", result.TopicCoverageNotes);
    }

    [Fact]
    public void Analyze_WhenSomeKeywordsPresent_ReportsPartialCoverage()
    {
        // Arrange
        var request = Request(
            "communication is key",
            keywords: new[] { "communication", "teamwork" });

        // Act
        var result = _service.Analyze(request);

        // Assert
        Assert.Equal("Matched 1 of 2 target keywords.", result.TopicCoverageNotes);
    }

    [Fact]
    public void Analyze_WhenNoKeywordsPresent_ReportsZeroCoverage()
    {
        // Arrange
        var request = Request(
            "alpha beta gamma",
            keywords: new[] { "communication", "teamwork" });

        // Act
        var result = _service.Analyze(request);

        // Assert
        Assert.Equal("Matched 0 of 2 target keywords.", result.TopicCoverageNotes);
    }

    [Fact]
    public void Analyze_KeywordMatching_IsCaseInsensitive()
    {
        // Arrange
        var request = Request(
            "Strong COMMUNICATION skills",
            keywords: new[] { "communication" });

        // Act
        var result = _service.Analyze(request);

        // Assert
        Assert.Equal("Matched 1 of 1 target keywords.", result.TopicCoverageNotes);
    }

    // ---- improvement suggestion (single, priority-ordered) -------------

    [Fact]
    public void Analyze_WhenFillersAreHigh_SuggestsPausing()
    {
        // Arrange - 6 fillers takes top priority over other issues.
        var transcript = Repeat("um", 6) + " " + Repeat("alpha", 20);
        var request = Request(transcript, durationSeconds: 60);

        // Act
        var result = _service.Analyze(request);

        // Assert
        Assert.Equal(
            "Pause briefly between points so you rely less on filler words.",
            result.ImprovementSuggestion);
    }

    [Fact]
    public void Analyze_WhenPacingIsFast_SuggestsSlowingDown()
    {
        // Arrange - 171 wpm, no fillers.
        var request = Request(Repeat("alpha", 171), durationSeconds: 60);

        // Act
        var result = _service.Analyze(request);

        // Assert
        Assert.Equal(
            "Slow your pace slightly so your examples sound more deliberate.",
            result.ImprovementSuggestion);
    }

    [Fact]
    public void Analyze_WhenAnswerIsShort_SuggestsAddingAnExample()
    {
        // Arrange - fewer than 25 words, no fillers, not fast.
        var request = Request(Repeat("alpha", 10), durationSeconds: 60);

        // Act
        var result = _service.Analyze(request);

        // Assert
        Assert.Equal(
            "Add one specific example using situation, action, and result.",
            result.ImprovementSuggestion);
    }

    [Fact]
    public void Analyze_WhenKeywordCoverageIncomplete_SuggestsCoveringMorePoints()
    {
        // Arrange - long enough, well paced, no fillers, but misses a keyword.
        var request = Request(
            Repeat("alpha", 30),
            durationSeconds: 60,
            keywords: new[] { "communication" });

        // Act
        var result = _service.Analyze(request);

        // Assert
        Assert.Equal(
            "Try covering more of the prompt's expected points in your next answer.",
            result.ImprovementSuggestion);
    }

    [Fact]
    public void Analyze_WhenNoWeaknessFound_GivesDefaultTakeawaySuggestion()
    {
        // Arrange - no fillers, balanced pace, long enough, no keywords to miss.
        var request = Request(Repeat("alpha", 30), durationSeconds: 60, keywords: null);

        // Act
        var result = _service.Analyze(request);

        // Assert
        Assert.Equal(
            "Keep the same structure, but end with a clearer takeaway sentence.",
            result.ImprovementSuggestion);
    }
}
