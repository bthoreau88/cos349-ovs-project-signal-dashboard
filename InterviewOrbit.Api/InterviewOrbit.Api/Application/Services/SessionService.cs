using InterviewOrbit.Api.Application.DTOs;
using InterviewOrbit.Api.Application.Interfaces;
using InterviewOrbit.Api.Domain.Entities;
using InterviewOrbit.Api.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace InterviewOrbit.Api.Application.Services;

public class SessionService : ISessionService
{
    private readonly InterviewOrbitDbContext _db;
    public SessionService(InterviewOrbitDbContext db)
    {
        _db = db;
    }
    public async Task<InterviewSessionDto> CreateAsync(CreateSessionRequestDto request)
    {
        var session = new InterviewSession
        {
            PromptId = request.PromptId,
            PromptTitleSnapshot = request.PromptTitleSnapshot,
            CategorySnapshot = request.CategorySnapshot,
            RoleSnapshot = request.RoleSnapshot,
            TranscriptText = request.TranscriptText,
            DurationSeconds = request.DurationSeconds,
            CreatedAtUtc = DateTime.UtcNow,
            FeedbackResult = new FeedbackResult
            {
                FillerWordCount = request.Feedback.FillerWordCount,
                WordsPerMinuteEstimate = request.Feedback.WordsPerMinuteEstimate,
                PacingLabel = request.Feedback.PacingLabel,
                ClarityNotes = request.Feedback.ClarityNotes,
                TopicCoverageNotes = request.Feedback.TopicCoverageNotes,
                ImprovementSuggestion = request.Feedback.ImprovementSuggestion
            }
        };
        _db.InterviewSessions.Add(session);
        await _db.SaveChangesAsync();
        return MapToDto(session);
    }
    public async Task<IReadOnlyList<InterviewSessionDto>> GetRecentAsync()
    {
        var sessions = await _db.InterviewSessions
        .Include(s => s.FeedbackResult)
        .OrderByDescending(s => s.CreatedAtUtc)
        .Take(20)
        .ToListAsync();
        return sessions.Select(MapToDto).ToList();
    }
    public async Task<SessionTrendDto> GetTrendsAsync()
    {
        var sessions = await _db.InterviewSessions
        .Include(s => s.FeedbackResult)
        .OrderByDescending(s => s.CreatedAtUtc)
        .Take(20)
        .ToListAsync();
        if (sessions.Count == 0)
        {
            return new SessionTrendDto(0, 0, 0, "No sessions yet");
        }
        var averageDuration = Math.Round(sessions.Average(s => s.DurationSeconds), 1);
        var averageFillerWords = Math.Round(sessions.Average(s => s.FeedbackResult?.FillerWordCount ?? 0), 1);
        var mostRecentPacing = sessions.First().FeedbackResult?.PacingLabel ?? "Unknown";
        return new SessionTrendDto(
        TotalSessions: sessions.Count,
        AverageDurationSeconds: averageDuration,
        AverageFillerWords: averageFillerWords,
        MostRecentPacingLabel: mostRecentPacing
        );
    }
    private static InterviewSessionDto MapToDto(InterviewSession session)
    {
        var feedback = session.FeedbackResult ?? new FeedbackResult();
        return new InterviewSessionDto(
        Id: session.Id,
        PromptTitleSnapshot: session.PromptTitleSnapshot,
        CategorySnapshot: session.CategorySnapshot,
        RoleSnapshot: session.RoleSnapshot,
        TranscriptText: session.TranscriptText,
        DurationSeconds: session.DurationSeconds,
        CreatedAtUtc: session.CreatedAtUtc,
        Feedback: new FeedbackResponseDto(
        feedback.FillerWordCount,
        feedback.WordsPerMinuteEstimate,
        feedback.PacingLabel,
        feedback.ClarityNotes,
        feedback.TopicCoverageNotes,
        feedback.ImprovementSuggestion
        )
        );
    }
}
