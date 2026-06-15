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
            Title = "Overcoming a setback",
            QuestionText = "Describe a project that did not go as planned and what you learned from it.",
            TargetKeywords = "challenge,ownership,lesson,outcome",
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
            Title = "Accessible interfaces",
            QuestionText = "How do you make sure the interfaces you build are accessible to all users?",
            TargetKeywords = "accessibility,semantics,keyboard,contrast,testing",
            SuggestedTargetSeconds = 120
        },
        new Prompt
        {
            Category = "Backend",
            Role = "Backend Developer",
            Title = "Designing an API",
            QuestionText = "Walk me through how you would design a REST API for a new feature.",
            TargetKeywords = "endpoints,contracts,validation,errors,testing",
            SuggestedTargetSeconds = 150
        },
        new Prompt
        {
            Category = "Backend",
            Role = "Backend Developer",
            Title = "Debugging in production",
            QuestionText = "Tell me about a difficult bug you tracked down and how you resolved it.",
            TargetKeywords = "reproduce,logs,root cause,fix,prevention",
            SuggestedTargetSeconds = 150
        },
        new Prompt
        {
            Category = "Leadership",
            Role = "General",
            Title = "Giving feedback",
            QuestionText = "Describe a time you gave difficult feedback to a peer and how it went.",
            TargetKeywords = "feedback,empathy,clarity,outcome",
            SuggestedTargetSeconds = 120
        },
        new Prompt
        {
            Category = "General",
            Role = "General",
            Title = "Why this role",
            QuestionText = "Why are you interested in this role, and what makes you a strong fit?",
            TargetKeywords = "motivation,skills,fit,goals",
            SuggestedTargetSeconds = 90
        }
        );
        db.SaveChanges();
    }
}