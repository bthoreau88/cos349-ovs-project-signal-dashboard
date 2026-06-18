import { useEffect, useState } from "react";
import { PageHeader } from "../components/PageHeader";
import { SectionCard } from "../components/SectionCard";
import { SessionHistoryList } from "../features/sessions/components/SessionHistoryList";
import { SessionTrendCards } from "../features/sessions/components/SessionTrendCards";
import { getRecentSessions, getSessionTrends } from "../features/sessions/services/sessionsApi";
import type { InterviewSession, SessionTrend } from "../features/sessions/types/session";

export function HistoryPage() {
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [trend, setTrend] = useState<SessionTrend | null>(null);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [loadingTrends, setLoadingTrends] = useState(true);
  const [sessionsError, setSessionsError] = useState("");
  const [trendsError, setTrendsError] = useState("");

  useEffect(() => {
    getRecentSessions()
      .then(setSessions)
      .catch(() => setSessionsError("Unable to load session history."))
      .finally(() => setLoadingSessions(false));

    getSessionTrends()
      .then(setTrend)
      .catch(() => setTrendsError("Unable to load trend summary."))
      .finally(() => setLoadingTrends(false));
  }, []);

  return (
    <>
      <PageHeader
        title="History"
        subtitle="Review saved mock interview answers and lightweight trends."
      />
      <div className="stack">
        <SectionCard title="Trend summary">
          <SessionTrendCards trend={trend} isLoading={loadingTrends} error={trendsError} />
        </SectionCard>
        <SectionCard title="Recent sessions">
          <SessionHistoryList sessions={sessions} isLoading={loadingSessions} error={sessionsError} />
        </SectionCard>
      </div>
    </>
  );
}
