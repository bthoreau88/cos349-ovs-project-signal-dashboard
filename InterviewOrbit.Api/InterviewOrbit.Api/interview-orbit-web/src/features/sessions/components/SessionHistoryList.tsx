import type { InterviewSession } from "../types/session";
type Props = {
    sessions: InterviewSession[];
    isLoading?: boolean;
    error?: string;
};
export function SessionHistoryList({
    sessions,
    isLoading = false,
    error = ""
}: Props) {
    if (isLoading) {
        return <div className="processing-box">Loading session history…</div>;
    }
    if (error) {
        return <p className="error-text">{error}</p>;
    }
    if (sessions.length === 0) {
        return <p>No saved sessions yet.</p>;
    }
    return (
        <div className="stack-sm">
            {sessions.map((session) => (
                <article key={session.id} className="history-item">
                    <div className="row wrap history-topline">
                        <strong>{session.promptTitleSnapshot}</strong>
                        <span className="badge">{session.categorySnapshot}</span>
                        <span className="badge muted">{session.roleSnapshot}</span>
                    </div>
                    <p className="history-meta">
                        Duration: {session.durationSeconds}s • Filler words: {session.feedback.fillerWordCount} • Pacing: {session.feedback.pacingLabel}
                    </p>
                    <p className="history-transcript">
                        {session.transcriptText.length > 180
                            ? `${session.transcriptText.slice(0, 180)}…`
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