namespace InterviewOrbit.Api.Application.DTOs;

public record InterviewSessionDto(
    int Id,
    string PromptTitleSnapshot,
    string CategorySnapshot,
    string RoleSnapshot,
    string TranscriptText,
    int DurationSeconds,
    DateTime CreatedAtUtc,
    FeedbackResponseDto Feedback
);
