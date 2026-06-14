import type { SessionTrend } from "../types/session";
type Props = {
    trend: SessionTrend | null;
    isLoading?: boolean;
    error?: string;
};
export function SessionTrendCards({
    trend,
    isLoading = false,
    error = ""
}: Props) {
    if (isLoading) {
        return <div className="processing-box">Loading trends...</div>;
    }
    if (error) {
        return <p className="error-text">{error}</p>;
    }
    if (!trend) {
        return <p>No trend data available yet.</p>;
    }
    return (
        <div className="grid three">
            <div className="section-card">
                <h3>Total sessions</h3>
                <p>{trend.totalSessions}</p>
            </div>
            <div className="section-card">
                <h3>Avg duration</h3>
                <p>{trend.averageDurationSeconds}s</p>
            </div>
            <div className="section-card">
                <h3>Avg filler words</h3>
                <p>{trend.averageFillerWords}</p>
            </div>
            <div className="section-card">
                <h3>Latest pacing</h3>
                <p>{trend.mostRecentPacingLabel}</p>
            </div>
        </div>
    );
}