import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "../components/PageHeader";
import { SectionCard } from "../components/SectionCard";
import { SkeletonCard } from "../components/SkeletonCard";
import { SessionTrendCards } from "../features/sessions/components/SessionTrendCards";
import { getSessionTrends } from "../features/sessions/services/sessionsApi";
import type { SessionTrend } from "../features/sessions/types/session";

export function DashboardPage() {
  const [trend, setTrend] = useState<SessionTrend | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getSessionTrends()
      .then(setTrend)
      .catch(() => setError("Unable to load progress data."))
      .finally(() => setLoading(false));
  }, []);

  const isEmpty = !loading && !error && (!trend || trend.totalSessions === 0);

  return (
    <>
      <PageHeader
        title="Interview Orbit"
        subtitle="Record an answer. Get real feedback. Track improvement."
      />
      <div className="stack">
        <SectionCard title="Your progress">
          {loading ? (
            <SkeletonCard lines={4} />
          ) : isEmpty ? (
            <div className="empty-state">
              <p>No sessions yet — record your first answer to start tracking progress.</p>
              <Link to="/practice" className="button-link">Start practicing</Link>
            </div>
          ) : (
            <SessionTrendCards trend={trend} isLoading={false} error={error} />
          )}
        </SectionCard>
        {!isEmpty && !loading && (
          <SectionCard title="Keep going">
            <p>Practice makes the feedback more useful — each session adds to your trend data.</p>
            <Link to="/practice" className="button-link">New session</Link>
          </SectionCard>
        )}
        <SectionCard title="Practice library">
          <p>16 prompts across 4 categories: Behavioral, Technical, Frontend, and General.</p>
          <Link to="/practice" className="button-link">Browse prompts</Link>
        </SectionCard>
      </div>
    </>
  );
}
