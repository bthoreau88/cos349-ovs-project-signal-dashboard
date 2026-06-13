using InterviewOrbit.Api.Application.DTOs;

namespace InterviewOrbit.Api.Application.Interfaces;

public interface ITranscriptionService
{
    Task<TranscriptionResponseDto> TranscribeAsync(IFormFile? audioFile, int durationSeconds);
}