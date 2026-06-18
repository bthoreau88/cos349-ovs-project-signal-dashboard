using InterviewOrbit.Api.Application.DTOs;
using InterviewOrbit.Api.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace InterviewOrbit.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SessionsController : ControllerBase
{
    private readonly ISessionService _sessionService;

    public SessionsController(ISessionService sessionService)
    {
        _sessionService = sessionService;
    }

    [HttpGet]
    public async Task<IActionResult> GetRecent()
    {
        var sessions = await _sessionService.GetRecentAsync();
        return Ok(sessions);
    }

    [HttpGet("trends")]
    public async Task<IActionResult> GetTrends()
    {
        var trends = await _sessionService.GetTrendsAsync();
        return Ok(trends);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateSessionRequestDto request)
    {
        var created = await _sessionService.CreateAsync(request);
        return Ok(created);
    }
}
