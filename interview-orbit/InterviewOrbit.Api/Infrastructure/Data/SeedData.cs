using InterviewOrbit.Api.Domain.Entities;

namespace InterviewOrbit.Api.Infrastructure.Data;

public static class SeedData
{
    public static void Initialize(InterviewOrbitDbContext db)
    {
        if (db.Prompts.Any()) return;

        db.Prompts.AddRange(
            new Prompt
            {
                Category = "Behavioral",
                Role = "General",
                Title = "Handling conflict",
                QuestionText = "Tell me about a time you disagreed with a teammate and how you handled it.",
                TargetKeywords = "conflict,communication,resolution,teamwork",
                SuggestedTargetSeconds = 120
            },
            new Prompt
            {
                Category = "Behavioral",
                Role = "General",
                Title = "Greatest challenge",
                QuestionText = "Describe your greatest professional challenge and what you learned from it.",
                TargetKeywords = "challenge,growth,learning,outcome",
                SuggestedTargetSeconds = 120
            },
            new Prompt
            {
                Category = "Frontend",
                Role = "Frontend Developer",
                Title = "Performance tradeoffs",
                QuestionText = "Describe a time you improved frontend performance and explain your tradeoffs.",
                TargetKeywords = "performance,measurement,tradeoffs,results",
                SuggestedTargetSeconds = 120
            },
            new Prompt
            {
                Category = "Frontend",
                Role = "Frontend Developer",
                Title = "State management decision",
                QuestionText = "Walk me through how you decided on a state management approach for a recent project.",
                TargetKeywords = "state,decision,tradeoffs,context",
                SuggestedTargetSeconds = 90
            },
            new Prompt
            {
                Category = "General",
                Role = "General",
                Title = "Tell me about yourself",
                QuestionText = "Give me a two-minute overview of your background and what you are looking for next.",
                TargetKeywords = "background,skills,goals,experience",
                SuggestedTargetSeconds = 120
            }
        );

        db.SaveChanges();
    }
}
