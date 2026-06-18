import { Link } from "react-router-dom";
import { PageHeader } from "../components/PageHeader";
import { SectionCard } from "../components/SectionCard";

export function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Interview practice that stays focused"
        subtitle="Choose a prompt, record one answer, review the transcript, and get lightweight feedback."
      />
      <div className="grid two">
        <SectionCard title="Quick start">
          <p>Pick a prompt and complete one end-to-end answer flow.</p>
          <Link to="/practice" className="button-link">Start practice</Link>
        </SectionCard>
        <SectionCard title="What this app proves">
          <ul>
            <li>Prompt selection</li>
            <li>Microphone capture</li>
            <li>Real-time speech transcript (Chrome/Edge)</li>
            <li>Deterministic feedback</li>
            <li>Session save and history</li>
          </ul>
        </SectionCard>
      </div>
    </>
  );
}
