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
            Category = "Frontend",
            Role = "Frontend Developer",
            Title = "Performance tradeoffs",
            QuestionText = "Describe a time you improved frontend performance and explain your tradeoffs.",
            TargetKeywords = "performance,measurement,tradeoffs,results",
            SuggestedTargetSeconds = 120
        }
        );
        db.SaveChanges();
    }
}