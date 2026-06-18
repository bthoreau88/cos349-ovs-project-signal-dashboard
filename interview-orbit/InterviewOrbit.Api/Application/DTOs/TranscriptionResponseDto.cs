namespace InterviewOrbit.Api.Application.DTOs;

public record TranscriptionResponseDto(
    string TranscriptText,
    string Source,
    bool UsedFallback
);
