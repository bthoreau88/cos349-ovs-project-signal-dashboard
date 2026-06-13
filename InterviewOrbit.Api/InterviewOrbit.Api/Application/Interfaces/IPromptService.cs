using InterviewOrbit.Api.Application.DTOs;

namespace InterviewOrbit.Api.Application.Interfaces;

public interface IPromptService
{
    Task<IReadOnlyList<PromptDto>> GetPromptsAsync(string? category, string? role);
}