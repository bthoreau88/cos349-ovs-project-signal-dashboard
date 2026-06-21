import { Link } from "react-router-dom";
import { confidenceScore } from "../../feedback/components/FeedbackSummaryCard";
import type { InterviewSession } from "../types/session";

type Props = {
  sessions: InterviewSession[];
  isLoading?: boolean;
  error?: string;
};

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s === 0 ? `${m}m` : `${m}m ${s}s`;
}

function formatDate(utcString: string): string {
  return new Date(utcString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function SessionHistoryList({ sessions, isLoading = false, error = "" }: Props) {
  if (isLoading) return <div className="processing-box">Loading session history...</div>;
  if (error) return <p className="error-text">{error}</p>;
  if (sessions.length === 0) return (
    <div className="empty-state">
      <p>No sessions recorded yet.</p>
      <Link to="/practice" className="button-link">Record your first answer</Link>
    </div>
  );

  return (
    <div className="stack-sm">
      {sessions.map((session) => (
        <article key={session.id} className="history-item">
          <div className="row wrap history-topline">
            <strong>{session.promptTitleSnapshot}</strong>
            <span className="badge">{session.categorySnapshot}</span>
            <span className="badge muted">{session.roleSnapshot}</span>
            <span className="badge muted history-date">{formatDate(session.createdAtUtc)}</span>
          </div>
          <p className="history-meta">
            Duration: {formatDuration(session.durationSeconds)} &bull; Filler words: {session.feedback.fillerWordCount} &bull; Pacing: {session.feedback.pacingLabel} &bull; {session.feedback.wordsPerMinuteEstimate} WPM &bull; Score: <strong>{confidenceScore(session.feedback.wordsPerMinuteEstimate, session.feedback.fillerWordCount)}/100</strong>
          </p>
          <p className="history-transcript">
            {session.transcriptText.length > 180
              ? `${session.transcriptText.slice(0, 180)}...`
              : session.transcriptText}
          </p>
          <p className="history-suggestion">
            <strong>Improvement:</strong> {session.feedback.improvementSuggestion}
          </p>
        </article>
      ))}
    </div>
  );
}
