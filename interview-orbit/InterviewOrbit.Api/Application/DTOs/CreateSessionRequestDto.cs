namespace InterviewOrbit.Api.Application.DTOs;

public record CreateSessionRequestDto(
    int? PromptId,
    string PromptTitleSnapshot,
    string CategorySnapshot,
    string RoleSnapshot,
    string TranscriptText,
    int DurationSeconds,
    FeedbackResponseDto Feedback
);
