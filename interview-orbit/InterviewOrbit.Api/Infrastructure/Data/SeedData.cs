using InterviewOrbit.Api.Domain.Entities;

namespace InterviewOrbit.Api.Infrastructure.Data;

public static class SeedData
{
    public static void Initialize(InterviewOrbitDbContext db)
    {
        var existing = db.Prompts.Select(p => p.Title).ToHashSet();
        var toAdd = AllPrompts().Where(p => !existing.Contains(p.Title)).ToList();
        if (toAdd.Count == 0) return;
        db.Prompts.AddRange(toAdd);
        db.SaveChanges();
    }

    private static IEnumerable<Prompt> AllPrompts() =>
    [
        // ── Behavioral ───────────────────────────────────────────────
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
            Category = "Behavioral",
            Role = "General",
            Title = "Leadership example",
            QuestionText = "Tell me about a time you took initiative or led a project when no one asked you to.",
            TargetKeywords = "initiative,leadership,ownership,outcome",
            SuggestedTargetSeconds = 120
        },
        new Prompt
        {
            Category = "Behavioral",
            Role = "General",
            Title = "Missed deadline",
            QuestionText = "Describe a time you missed a deadline or delivered work late. What happened and what did you do?",
            TargetKeywords = "accountability,communication,recovery,learning",
            SuggestedTargetSeconds = 90
        },
        new Prompt
        {
            Category = "Behavioral",
            Role = "General",
            Title = "Receiving critical feedback",
            QuestionText = "Tell me about a time you received difficult feedback. How did you respond?",
            TargetKeywords = "feedback,growth,communication,action",
            SuggestedTargetSeconds = 90
        },

        // ── Technical ────────────────────────────────────────────────
        new Prompt
        {
            Category = "Technical",
            Role = "Software Developer",
            Title = "Debugging a hard bug",
            QuestionText = "Walk me through the hardest bug you've debugged. How did you isolate and fix it?",
            TargetKeywords = "debugging,root cause,isolation,fix",
            SuggestedTargetSeconds = 120
        },
        new Prompt
        {
            Category = "Technical",
            Role = "Software Developer",
            Title = "Code review approach",
            QuestionText = "How do you approach giving and receiving code reviews on your team?",
            TargetKeywords = "code review,quality,communication,standards",
            SuggestedTargetSeconds = 90
        },
        new Prompt
        {
            Category = "Technical",
            Role = "Software Developer",
            Title = "API design decision",
            QuestionText = "Describe a significant API design decision you made. What tradeoffs did you consider?",
            TargetKeywords = "API,design,tradeoffs,consistency",
            SuggestedTargetSeconds = 120
        },
        new Prompt
        {
            Category = "Technical",
            Role = "Software Developer",
            Title = "Testing strategy",
            QuestionText = "How do you decide what to test and at what level — unit, integration, end-to-end?",
            TargetKeywords = "testing,unit,integration,coverage",
            SuggestedTargetSeconds = 90
        },

        // ── Frontend ─────────────────────────────────────────────────
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
            Category = "Frontend",
            Role = "Frontend Developer",
            Title = "Accessibility implementation",
            QuestionText = "Tell me about a time you improved the accessibility of an interface. What did you change and why?",
            TargetKeywords = "accessibility,ARIA,keyboard,users",
            SuggestedTargetSeconds = 90
        },

        // ── General ──────────────────────────────────────────────────
        new Prompt
        {
            Category = "General",
            Role = "General",
            Title = "Tell me about yourself",
            QuestionText = "Give me a two-minute overview of your background and what you are looking for next.",
            TargetKeywords = "background,skills,goals,experience",
            SuggestedTargetSeconds = 120
        },
        new Prompt
        {
            Category = "General",
            Role = "General",
            Title = "Why this company",
            QuestionText = "Why do you want to work here specifically, and what makes you a good fit for this role?",
            TargetKeywords = "motivation,fit,value,mission",
            SuggestedTargetSeconds = 90
        },
        new Prompt
        {
            Category = "General",
            Role = "General",
            Title = "Strengths and weaknesses",
            QuestionText = "What's your greatest professional strength, and what's one area you're actively working to improve?",
            TargetKeywords = "strength,weakness,self-awareness,growth",
            SuggestedTargetSeconds = 90
        },
        new Prompt
        {
            Category = "General",
            Role = "General",
            Title = "Where do you see yourself in 5 years",
            QuestionText = "Where do you see yourself professionally in five years, and how does this role get you there?",
            TargetKeywords = "goals,growth,career,direction",
            SuggestedTargetSeconds = 90
        },
    ];
}
