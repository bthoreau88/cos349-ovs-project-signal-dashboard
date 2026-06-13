using InterviewOrbit.Api.Application.DTOs;

namespace InterviewOrbit.Api.Application.Interfaces;

public interface IFeedbackService
{
    FeedbackResponseDto Analyze(FeedbackRequestDto request);
}