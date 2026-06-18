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
    public async Task<IActionResult> Post([FromForm] IFormFile? audio, [FromForm] int durationSeconds)
    {
        var result = await _transcriptionService.TranscribeAsync(audio, durationSeconds);
        return Ok(result);
    }
}
