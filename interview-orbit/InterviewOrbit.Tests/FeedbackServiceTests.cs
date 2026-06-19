using InterviewOrbit.Api.Application.DTOs;
using InterviewOrbit.Api.Application.Services;
using Xunit;

namespace InterviewOrbit.Tests;

public class FeedbackServiceTests
{
    private readonly FeedbackService _sut = new();

    private static string Words(int count) =>
        string.Join(" ", Enumerable.Repeat("word", count));

    private FeedbackResponseDto Analyze(
        string transcript,
        int durationSeconds = 60,
        string[]? keywords = null) =>
        _sut.Analyze(new FeedbackRequestDto(transcript, durationSeconds, null, keywords));

    // ── WPM and pacing ────────────────────────────────────────────────────

    [Fact]
    public void Pacing_IsSlow_WhenWpmBelow90()
    {
        var result = Analyze(Words(30), durationSeconds: 60);
        Assert.Equal("A little slow", result.PacingLabel);
    }

    [Fact]
    public void Pacing_IsBalanced_WhenWpmBetween90And170()
    {
        var result = Analyze(Words(120), durationSeconds: 60);
        Assert.Equal("Balanced", result.PacingLabel);
    }

    [Fact]
    public void Pacing_IsFast_WhenWpmAbove170()
    {
        var result = Analyze(Words(200), durationSeconds: 60);
        Assert.Equal("A little fast", result.PacingLabel);
    }

    [Fact]
    public void Pacing_At90Wpm_IsBalanced()
    {
        var result = Analyze(Words(90), durationSeconds: 60);
        Assert.Equal("Balanced", result.PacingLabel);
    }

    [Fact]
    public void Pacing_At170Wpm_IsBalanced()
    {
        var result = Analyze(Words(170), durationSeconds: 60);
        Assert.Equal("Balanced", result.PacingLabel);
    }

    [Fact]
    public void Pacing_At171Wpm_IsFast()
    {
        var result = Analyze(Words(171), durationSeconds: 60);
        Assert.Equal("A little fast", result.PacingLabel);
    }

    [Fact]
    public void Wpm_IsZero_WhenTranscriptIsEmpty()
    {
        var result = Analyze("", durationSeconds: 60);
        Assert.Equal(0.0, result.WordsPerMinuteEstimate);
    }

    [Fact]
    public void DurationZeroGuard_DoesNotDivideByZero()
    {
        // Math.Max(durationSeconds, 1) prevents divide-by-zero — 1 word / (1s/60) = 60 WPM
        var result = Analyze("word", durationSeconds: 0);
        Assert.Equal(60.0, result.WordsPerMinuteEstimate);
    }

    // ── Filler word counting ──────────────────────────────────────────────

    [Fact]
    public void FillerWords_CountsEachDistinctFiller()
    {
        var result = Analyze("um uh like basically literally");
        Assert.Equal(5, result.FillerWordCount);
    }

    [Fact]
    public void FillerWords_CountsRepeatedSameFiller()
    {
        var result = Analyze("um um um");
        Assert.Equal(3, result.FillerWordCount);
    }

    [Fact]
    public void FillerWords_IsCaseInsensitive()
    {
        var result = Analyze("UM UH LIKE");
        Assert.Equal(3, result.FillerWordCount);
    }

    [Fact]
    public void FillerWords_WordBoundary_LikelyDoesNotMatchLike()
    {
        // "\blike\b" must not fire on "likely"
        var result = Analyze("the likely outcome is good");
        Assert.Equal(0, result.FillerWordCount);
    }

    [Fact]
    public void FillerWords_WordBoundary_UmmDoesNotMatchUm()
    {
        // "\bum\b" must not fire on "umm"
        var result = Analyze("umm yeah that is good");
        Assert.Equal(0, result.FillerWordCount);
    }

    [Fact]
    public void FillerWords_YouKnow_CountsEachOccurrence()
    {
        var result = Analyze("you know what I mean you know");
        Assert.Equal(2, result.FillerWordCount);
    }

    [Fact]
    public void FillerWords_EmptyTranscript_ReturnsZero()
    {
        var result = Analyze("");
        Assert.Equal(0, result.FillerWordCount);
    }

    // ── Clarity notes ─────────────────────────────────────────────────────

    [Fact]
    public void ClarityNotes_ShortAnswer_ReturnsShortMessage()
    {
        var result = Analyze(Words(10));
        Assert.Contains("very short", result.ClarityNotes);
    }

    [Fact]
    public void ClarityNotes_HighFillers_ReturnsFillerMessage()
    {
        // 6 fillers, 30 words total — short-answer check (< 25) does NOT fire
        var transcript = "um uh like basically literally um " + Words(24);
        var result = Analyze(transcript);
        Assert.Contains("filler words", result.ClarityNotes);
    }

    [Fact]
    public void ClarityNotes_LongAnswer_ReturnsTighterStructureMessage()
    {
        var result = Analyze(Words(200));
        Assert.Contains("tighter structure", result.ClarityNotes);
    }

    [Fact]
    public void ClarityNotes_NormalAnswer_ReturnsReasonableMessage()
    {
        var result = Analyze(Words(60));
        Assert.Contains("reasonable", result.ClarityNotes);
    }

    [Fact]
    public void ClarityNotes_ShortAnswerTakesPriorityOverHighFillers()
    {
        // wordCount < 25 is checked before fillerWordCount >= 6 in GetClarityNotes
        var transcript = "um uh like basically literally um";
        var result = Analyze(transcript);
        Assert.Contains("very short", result.ClarityNotes);
    }

    // ── Topic coverage ────────────────────────────────────────────────────

    [Fact]
    public void TopicCoverage_NullKeywords_ReturnsNoKeywordsMessage()
    {
        var result = Analyze(Words(30), keywords: null);
        Assert.Contains("No target keywords", result.TopicCoverageNotes);
    }

    [Fact]
    public void TopicCoverage_EmptyKeywords_ReturnsNoKeywordsMessage()
    {
        var result = Analyze(Words(30), keywords: []);
        Assert.Contains("No target keywords", result.TopicCoverageNotes);
    }

    [Fact]
    public void TopicCoverage_AllKeywordsMatched_ReportsFullCount()
    {
        var result = Analyze("I used TypeScript and React", keywords: ["TypeScript", "React"]);
        Assert.Equal("Matched 2 of 2 target keywords.", result.TopicCoverageNotes);
    }

    [Fact]
    public void TopicCoverage_PartialMatch_ReportsPartialCount()
    {
        var result = Analyze("I used TypeScript only", keywords: ["TypeScript", "React"]);
        Assert.Equal("Matched 1 of 2 target keywords.", result.TopicCoverageNotes);
    }

    [Fact]
    public void TopicCoverage_IsCaseInsensitive()
    {
        var result = Analyze("I used typescript", keywords: ["TypeScript"]);
        Assert.Equal("Matched 1 of 1 target keywords.", result.TopicCoverageNotes);
    }

    [Fact]
    public void TopicCoverage_NoMatch_ReportsZero()
    {
        var result = Analyze("I talked about nothing relevant", keywords: ["TypeScript", "React"]);
        Assert.Equal("Matched 0 of 2 target keywords.", result.TopicCoverageNotes);
    }

    // ── Improvement suggestion cascade ────────────────────────────────────

    [Fact]
    public void ImprovementSuggestion_HighFillers_PrioritizesFillerFeedback()
    {
        // 6 fillers + 30 words to avoid the short-answer path
        var transcript = "um uh like basically literally um " + Words(24);
        var result = Analyze(transcript);
        Assert.Contains("filler words", result.ImprovementSuggestion);
    }

    [Fact]
    public void ImprovementSuggestion_FastPace_SuggestsSlowingDown()
    {
        // 200 words / 60s = 200 WPM, 0 fillers
        var result = Analyze(Words(200), durationSeconds: 60);
        Assert.Contains("pace", result.ImprovementSuggestion);
    }

    [Fact]
    public void ImprovementSuggestion_ShortAnswer_SuggestsAddingExample()
    {
        // 10 words, 60s = 10 WPM, 0 fillers — short-answer path fires
        var result = Analyze(Words(10), durationSeconds: 60);
        Assert.Contains("example", result.ImprovementSuggestion);
    }

    [Fact]
    public void ImprovementSuggestion_MissingKeywords_SuggestsBetterCoverage()
    {
        // 31 words, 31 WPM, 0 fillers, 1 of 2 keywords matched
        var result = Analyze(Words(30) + " TypeScript", durationSeconds: 60,
            keywords: ["TypeScript", "React"]);
        Assert.Contains("expected points", result.ImprovementSuggestion);
    }

    [Fact]
    public void ImprovementSuggestion_AllGood_ReturnsGenericSuggestion()
    {
        // 92 words, 92 WPM, 0 fillers, all keywords matched
        var transcript = Words(90) + " TypeScript React";
        var result = Analyze(transcript, durationSeconds: 60, keywords: ["TypeScript", "React"]);
        Assert.Contains("structure", result.ImprovementSuggestion);
    }

    [Fact]
    public void ImprovementSuggestion_FillersTakePriorityOverFastPace()
    {
        // Both conditions fire: 6 fillers AND 206 WPM — fillers win
        var transcript = "um uh like basically literally um " + Words(200);
        var result = Analyze(transcript, durationSeconds: 60);
        Assert.Contains("filler words", result.ImprovementSuggestion);
    }

    [Fact]
    public void ImprovementSuggestion_AllKeywordsMatched_DoesNotSuggestCoverage()
    {
        // 90 words, balanced WPM, 0 fillers, all keywords matched — must NOT return keyword message
        var transcript = Words(88) + " TypeScript React";
        var result = Analyze(transcript, durationSeconds: 60, keywords: ["TypeScript", "React"]);
        Assert.DoesNotContain("expected points", result.ImprovementSuggestion);
    }
}
