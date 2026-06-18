namespace InterviewOrbit.Api.Domain.Entities;

public class InterviewSession
{
    public int Id { get; set; }
    public int? PromptId { get; set; }
    public string PromptTitleSnapshot { get; set; } = "";
    public string CategorySnapshot { get; set; } = "";
    public string RoleSnapshot { get; set; } = "";
    public string TranscriptText { get; set; } = "";
    public int DurationSeconds { get; set; }
    public DateTime CreatedAtUtc { get; set; }
    public FeedbackResult? FeedbackResult { get; set; }
}
