namespace InterviewOrbit.Api.Application.DTOs;

public record FeedbackResponseDto(
    int FillerWordCount,
    double WordsPerMinuteEstimate,
    string PacingLabel,
    string ClarityNotes,
    string TopicCoverageNotes,
    string ImprovementSuggestion
);
