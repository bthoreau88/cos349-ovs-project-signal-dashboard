namespace InterviewOrbit.Api.Application.DTOs;

public record SessionTrendDto(
    int TotalSessions,
    double AverageDurationSeconds,
    double AverageFillerWords,
    string MostRecentPacingLabel
);
