using System.Text.RegularExpressions;
using InterviewOrbit.Api.Application.DTOs;
using InterviewOrbit.Api.Application.Interfaces;

namespace InterviewOrbit.Api.Application.Services;

public class FeedbackService : IFeedbackService
{
    private static readonly string[] FillerWords =
    [
        "um", "uh", "like", "basically", "literally", "you know"
    ];

    public FeedbackResponseDto Analyze(FeedbackRequestDto request)
    {
        var transcript = request.TranscriptText?.Trim() ?? string.Empty;
        var durationSeconds = Math.Max(request.DurationSeconds, 1);

        var wordCount = CountWords(transcript);
        var fillerWordCount = CountFillerWords(transcript);
        var wordsPerMinute = Math.Round(wordCount / (durationSeconds / 60.0), 1);
        var pacingLabel = GetPacingLabel(wordsPerMinute);
        var clarityNotes = GetClarityNotes(wordCount, fillerWordCount);
        var topicCoverageNotes = GetTopicCoverageNotes(transcript, request.TargetKeywords);
        var improvementSuggestion = GetImprovementSuggestion(
            fillerWordCount, wordsPerMinute, wordCount, transcript, request.TargetKeywords);

        return new FeedbackResponseDto(
            FillerWordCount: fillerWordCount,
            WordsPerMinuteEstimate: wordsPerMinute,
            PacingLabel: pacingLabel,
            ClarityNotes: clarityNotes,
            TopicCoverageNotes: topicCoverageNotes,
            ImprovementSuggestion: improvementSuggestion
        );
    }

    private static int CountWords(string text)
    {
        if (string.IsNullOrWhiteSpace(text)) return 0;
        return Regex.Matches(text, @"[\w']+").Count;
    }

    private static int CountFillerWords(string text)
    {
        if (string.IsNullOrWhiteSpace(text)) return 0;
        var total = 0;
        foreach (var filler in FillerWords)
            total += Regex.Matches(text, $@"\b{Regex.Escape(filler)}\b", RegexOptions.IgnoreCase).Count;
        return total;
    }

    private static string GetPacingLabel(double wordsPerMinute)
    {
        if (wordsPerMinute < 90) return "A little slow";
        if (wordsPerMinute <= 170) return "Balanced";
        return "A little fast";
    }

    private static string GetClarityNotes(int wordCount, int fillerWordCount)
    {
        if (wordCount < 25) return "Your answer is very short. Add one concrete example and one clear result.";
        if (fillerWordCount >= 6) return "Your ideas are present, but filler words may reduce clarity.";
        if (wordCount > 180) return "Your answer has substance, but it may benefit from a tighter structure.";
        return "Your answer length is reasonable for a practice response.";
    }

    private static string GetTopicCoverageNotes(string transcript, string[]? targetKeywords)
    {
        if (targetKeywords is null || targetKeywords.Length == 0)
            return "No target keywords were supplied for this prompt.";

        var matched = targetKeywords.Count(k =>
            transcript.Contains(k, StringComparison.OrdinalIgnoreCase));
        return $"Matched {matched} of {targetKeywords.Length} target keywords.";
    }

    private static string GetImprovementSuggestion(
        int fillerWordCount, double wordsPerMinute, int wordCount,
        string transcript, string[]? targetKeywords)
    {
        if (fillerWordCount >= 6) return "Pause briefly between points so you rely less on filler words.";
        if (wordsPerMinute > 170) return "Slow your pace slightly so your examples sound more deliberate.";
        if (wordCount < 25) return "Add one specific example using situation, action, and result.";
        if (targetKeywords is { Length: > 0 })
        {
            var matched = targetKeywords.Count(k =>
                transcript.Contains(k, StringComparison.OrdinalIgnoreCase));
            if (matched < targetKeywords.Length)
                return "Try covering more of the prompt's expected points in your next answer.";
        }
        return "Keep the same structure, but end with a clearer takeaway sentence.";
    }
}
