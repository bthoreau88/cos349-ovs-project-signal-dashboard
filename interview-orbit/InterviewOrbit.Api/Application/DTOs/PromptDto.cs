namespace InterviewOrbit.Api.Application.DTOs;

public record PromptDto(
    int Id,
    string Category,
    string Role,
    string Title,
    string QuestionText,
    string[] TargetKeywords,
    int? SuggestedTargetSeconds
);
