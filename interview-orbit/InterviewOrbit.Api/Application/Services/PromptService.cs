using InterviewOrbit.Api.Application.DTOs;
using InterviewOrbit.Api.Application.Interfaces;
using InterviewOrbit.Api.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace InterviewOrbit.Api.Application.Services;

public class PromptService : IPromptService
{
    private readonly InterviewOrbitDbContext _db;

    public PromptService(InterviewOrbitDbContext db)
    {
        _db = db;
    }

    public async Task<IReadOnlyList<PromptDto>> GetPromptsAsync(string? category, string? role)
    {
        var query = _db.Prompts.AsQueryable();

        if (!string.IsNullOrWhiteSpace(category))
            query = query.Where(p => p.Category == category);

        if (!string.IsNullOrWhiteSpace(role))
            query = query.Where(p => p.Role == role);

        return await query
            .OrderBy(p => p.Category)
            .ThenBy(p => p.Title)
            .Select(p => new PromptDto(
                p.Id,
                p.Category,
                p.Role,
                p.Title,
                p.QuestionText,
                string.IsNullOrWhiteSpace(p.TargetKeywords)
                    ? Array.Empty<string>()
                    : p.TargetKeywords.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries),
                p.SuggestedTargetSeconds
            ))
            .ToListAsync();
    }
}
