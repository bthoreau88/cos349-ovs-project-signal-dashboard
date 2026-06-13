import { useEffect, useState } from "react";
import { getRecentSessions, getSessionTrends } from "../features/sessions/services/sessionsApi";
import type { InterviewSession, SessionTrend } from "../features/sessions/types/session";

export default function DashboardPage() {
    const [sessions, setSessions] = useState<InterviewSession[]>([]);
    const [trends, setTrends] = useState<SessionTrend | null>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadDashboard() {
            try {
                const [sessionsData, trendsData] = await Promise.all([
                    getRecentSessions(),
                    getSessionTrends(),
                ]);

                setSessions(sessionsData);
                setTrends(trendsData);
            } catch (err) {
                console.error(err);
                setError("Failed to load dashboard data.");
            }
        }

        loadDashboard();
    }, []);

    return (
        <main>
            <h1>Dashboard</h1>

            {error && <p>{error}</p>}

            {!error && trends && (
                <>
                    <h2>Trends</h2>
                    <p>Total Sessions: {trends.totalSessions}</p>
                    <p>Average Duration: {trends.averageDurationSeconds}s</p>
                    <p>Average Filler Words: {trends.averageFillerWords}</p>
                    <p>Latest Pacing: {trends.mostRecentPacingLabel}</p>
                </>
            )}

            <h2>Recent Sessions</h2>
            {sessions.length > 0 ? (
                <ul>
                    {sessions.map((session) => (
                        <li key={session.id}>
                            <strong>{session.promptTitleSnapshot}</strong> - {session.durationSeconds}s
                        </li>
                    ))}
                </ul>
            ) : (
                !error && <p>No sessions found yet.</p>
            )}
        </main>
    );
}