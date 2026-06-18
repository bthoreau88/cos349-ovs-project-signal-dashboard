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

        // Fallback: real transcription provided by Web Speech API on the frontend.
        // This endpoint is kept as a backup path for browsers that lack SpeechRecognition.
        return new TranscriptionResponseDto(
            TranscriptText: $"[Fallback] Audio received ({durationSeconds}s). Use Chrome or Edge for real speech-to-text.",
            Source: "backend-fallback",
            UsedFallback: true
        );
    }
}
