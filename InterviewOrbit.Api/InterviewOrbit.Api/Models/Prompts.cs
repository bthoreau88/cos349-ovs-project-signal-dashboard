namespace InterviewOrbit.Api.Models
{
    public class Prompt
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string QuestionText { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
    }
}