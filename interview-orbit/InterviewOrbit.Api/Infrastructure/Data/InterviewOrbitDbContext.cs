using InterviewOrbit.Api.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace InterviewOrbit.Api.Infrastructure.Data;

public class InterviewOrbitDbContext : DbContext
{
    public InterviewOrbitDbContext(DbContextOptions<InterviewOrbitDbContext> options)
        : base(options)
    {
    }

    public DbSet<Prompt> Prompts => Set<Prompt>();
    public DbSet<InterviewSession> InterviewSessions => Set<InterviewSession>();
    public DbSet<FeedbackResult> FeedbackResults => Set<FeedbackResult>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Prompt>().ToTable("Prompts");
        modelBuilder.Entity<InterviewSession>().ToTable("InterviewSessions");
        modelBuilder.Entity<FeedbackResult>().ToTable("FeedbackResults");

        modelBuilder.Entity<InterviewSession>()
            .HasOne(s => s.FeedbackResult)
            .WithOne(f => f.InterviewSession)
            .HasForeignKey<FeedbackResult>(f => f.InterviewSessionId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
