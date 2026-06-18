using InterviewOrbit.Api.Application.DTOs;

namespace InterviewOrbit.Api.Application.Interfaces;

public interface ISessionService
{
    Task<InterviewSessionDto> CreateAsync(CreateSessionRequestDto request);
    Task<IReadOnlyList<InterviewSessionDto>> GetRecentAsync();
    Task<SessionTrendDto> GetTrendsAsync();
}
