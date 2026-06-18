namespace InterviewOrbit.Api.Domain.Entities;

public class Prompt
{
    public int Id { get; set; }
    public string Category { get; set; } = "";
    public string Role { get; set; } = "";
    public string Title { get; set; } = "";
    public string QuestionText { get; set; } = "";
    public string? TargetKeywords { get; set; }
    public int? SuggestedTargetSeconds { get; set; }
}
