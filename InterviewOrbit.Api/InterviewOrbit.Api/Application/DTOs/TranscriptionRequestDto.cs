using Microsoft.AspNetCore.Http;

namespace InterviewOrbit.Api.Application.DTOs;

public class TranscriptionRequestDto
{
    public IFormFile? Audio { get; set; }
    public int DurationSeconds { get; set; }
}