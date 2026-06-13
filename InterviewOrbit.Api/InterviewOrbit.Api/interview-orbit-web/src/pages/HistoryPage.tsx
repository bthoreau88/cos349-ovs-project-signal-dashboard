import { useEffect, useState } from "react";
import { getRecentSessions, getSessionTrends } from "../features/sessions/services/sessionsApi";
import type { InterviewSession, SessionTrend } from "../features/sessions/types/session";

export default function HistoryPage() {
    const [sessions, setSessions] = useState<InterviewSession[]>([]);
    const [trend, setTrend] = useState<SessionTrend | null>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadHistory() {
            try {
                const [sessionsData, trendData] = await Promise.all([
                    getRecentSessions(),
                    getSessionTrends(),
                ]);

                setSessions(sessionsData);
                setTrend(trendData);
            } catch (err) {
                console.error(err);
                setError("Failed to load history.");
            }
        }

        loadHistory();
    }, []);

    return (
        <main>
            <h1>History</h1>

            {error && <p>{error}</p>}

            {trend && (
                <div>
                    <h2>Progress Summary</h2>
                    <p>Total Practice Sessions: {trend.totalSessions}</p>
                    <p>Average Response Duration: {trend.averageDurationSeconds}s</p>
                    <p>Average Filler Words: {trend.averageFillerWords}</p>
                    <p>Latest Pacing Result: {trend.mostRecentPacingLabel}</p>
                </div>
            )}

            <h2>Saved Practice Sessions</h2>

            {sessions.length > 0 ? (
                <ul>
                    {sessions.map((session) => (
                        <li key={session.id}>
                            <strong>{session.promptTitleSnapshot}</strong>
                            <br />
                            {session.transcriptText}
                            <br />
                            Response Duration: {session.durationSeconds}s
                            <br />
                            Pacing Result: {session.feedback.pacingLabel}
                        </li>
                    ))}
                </ul>
            ) : (
                !error && <p>No saved practice sessions yet.</p>
            )}
        </main>
    );
}