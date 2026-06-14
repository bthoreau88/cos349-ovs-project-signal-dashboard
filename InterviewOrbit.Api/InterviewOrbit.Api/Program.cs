using InterviewOrbit.Api.Application.Interfaces;
using InterviewOrbit.Api.Application.Services;
using InterviewOrbit.Api.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;


var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<InterviewOrbitDbContext>(options =>
 options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddScoped<IPromptService, PromptService>();
builder.Services.AddScoped<ITranscriptionService, TranscriptionService>();
builder.Services.AddScoped<IFeedbackService, FeedbackService>();
builder.Services.AddScoped<ISessionService, SessionService>();
builder.Services.AddCors(options =>
{
    options.AddPolicy("dev", policy =>
    {
        // Frontend runs on a single pinned Vite port (see vite.config.ts),
        // so the allowed origin is fixed instead of guessing a range.
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});
var app = builder.Build();
app.UseSwagger();
app.UseSwaggerUI();
app.UseCors("dev");
// app.UseHttpsRedirection();
app.MapControllers();
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<InterviewOrbitDbContext>();
    db.Database.EnsureCreated();
    SeedData.Initialize(db);
}
app.Run();