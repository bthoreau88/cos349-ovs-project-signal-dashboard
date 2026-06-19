import type { SessionTrend } from "../types/session";

type Props = {
  trend: SessionTrend | null;
  isLoading?: boolean;
  error?: string;
};

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return s === 0 ? `${m}m` : `${m}m ${s}s`;
}

export function SessionTrendCards({ trend, isLoading = false, error = "" }: Props) {
  if (isLoading) return <div className="processing-box">Loading trends...</div>;
  if (error) return <p className="error-text">{error}</p>;
  if (!trend || trend.totalSessions === 0) return <p>No trend data yet.</p>;

  return (
    <div className="grid three">
      <div className="section-card">
        <h3>Sessions</h3>
        <p className="metric-value">{trend.totalSessions}</p>
      </div>
      <div className="section-card">
        <h3>Avg duration</h3>
        <p className="metric-value">{formatDuration(trend.averageDurationSeconds)}</p>
      </div>
      <div className="section-card">
        <h3>Avg fillers</h3>
        <p className="metric-value">{trend.averageFillerWords}</p>
      </div>
      <div className="section-card">
        <h3>Latest pacing</h3>
        <p className="metric-value">{trend.mostRecentPacingLabel}</p>
      </div>
    </div>
  );
}
