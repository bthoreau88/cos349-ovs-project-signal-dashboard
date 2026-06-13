using InterviewOrbit.Api.Application.DTOs;
using InterviewOrbit.Api.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace InterviewOrbit.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TranscriptionController : ControllerBase
{
    private readonly ITranscriptionService _transcriptionService;

    public TranscriptionController(ITranscriptionService transcriptionService)
    {
        _transcriptionService = transcriptionService;
    }

    [HttpPost]
    [RequestSizeLimit(20_000_000)]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> Post([FromForm] TranscriptionRequestDto request)
    {
        var result = await _transcriptionService.TranscribeAsync(
            request.Audio,
            request.DurationSeconds
        );

        return Ok(result);
    }
}