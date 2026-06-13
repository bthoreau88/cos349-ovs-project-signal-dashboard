namespace InterviewOrbit.Api.Application.DTOs;
public record FeedbackRequestDto(
 string TranscriptText,
 int DurationSeconds,
 int? TargetAnswerLengthSeconds,
 string[]? TargetKeywords
);