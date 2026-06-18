using InterviewOrbit.Api.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace InterviewOrbit.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PromptsController : ControllerBase
{
    private readonly IPromptService _service;

    public PromptsController(IPromptService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] string? category, [FromQuery] string? role)
    {
        var prompts = await _service.GetPromptsAsync(category, role);
        return Ok(prompts);
    }
}
