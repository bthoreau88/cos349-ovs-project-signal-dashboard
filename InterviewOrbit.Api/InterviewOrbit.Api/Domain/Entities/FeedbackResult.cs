namespace InterviewOrbit.Api.Domain.Entities;
public class FeedbackResult
{
    public int Id { get; set; }
    public int InterviewSessionId { get; set; }
    public int FillerWordCount { get; set; }
    public double WordsPerMinuteEstimate { get; set; }
    public string PacingLabel { get; set; } = "";
    public string ClarityNotes { get; set; } = "";
    public string TopicCoverageNotes { get; set; } = "";
    public string ImprovementSuggestion { get; set; } = "";
    public InterviewSession? InterviewSession { get; set; }
}
