using InterviewOrbit.Api.Application.DTOs;
using InterviewOrbit.Api.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace InterviewOrbit.Api.Controllers;
[ApiController]
[Route("api/[controller]")]
public class FeedbackController : ControllerBase
{
    private readonly IFeedbackService _feedbackService;
    public FeedbackController(IFeedbackService feedbackService)
    {
        _feedbackService = feedbackService;
    }
    [HttpPost("analyze")]
    public IActionResult Analyze([FromBody] FeedbackRequestDto request)
    {
        var result = _feedbackService.Analyze(request);
        return Ok(result);
    }
}