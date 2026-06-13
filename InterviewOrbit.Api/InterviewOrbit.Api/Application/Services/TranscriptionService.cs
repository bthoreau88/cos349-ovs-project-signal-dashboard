using InterviewOrbit.Api.Application.DTOs;
using InterviewOrbit.Api.Application.Interfaces;

namespace InterviewOrbit.Api.Application.Services;
public class TranscriptionService : ITranscriptionService
{
    public async Task<TranscriptionResponseDto> TranscribeAsync(IFormFile? audioFile, int durationSeconds)
    {
        if (audioFile is null || audioFile.Length == 0)
        {
            return new TranscriptionResponseDto(
            TranscriptText: "",
            Source: "no-audio",
            UsedFallback: true
            );
        }
        await using var stream = audioFile.OpenReadStream();
        using var memoryStream = new MemoryStream();
        await stream.CopyToAsync(memoryStream);
        return new TranscriptionResponseDto(
        TranscriptText: $"Demo transcript generated from uploaded audio ({durationSeconds} seconds). Replace this service with a real transcription provider later.",
        Source: "fallback-demo",
        UsedFallback: true
        );
    }
}