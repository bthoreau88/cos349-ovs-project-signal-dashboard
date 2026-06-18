import type { FeedbackResponse } from "../types/feedback";

type Props = {
  feedback: FeedbackResponse | null;
  isLoading?: boolean;
  error?: string;
};

export function FeedbackSummaryCard({ feedback, isLoading = false, error = "" }: Props) {
  if (isLoading) return <div className="processing-box">Analyzing transcript...</div>;
  if (error) return <p className="error-text">{error}</p>;
  if (!feedback) return <p>No feedback yet. Record an answer and generate a transcript first.</p>;

  return (
    <div className="stack-sm">
      <div className="grid two">
        <div className="section-card">
          <h3>Filler words</h3>
          <p>{feedback.fillerWordCount}</p>
        </div>
        <div className="section-card">
          <h3>Pacing</h3>
          <p>{feedback.pacingLabel} &bull; {feedback.wordsPerMinuteEstimate} WPM</p>
        </div>
      </div>
      <div className="section-card">
        <h3>Clarity</h3>
        <p>{feedback.clarityNotes}</p>
      </div>
      <div className="section-card">
        <h3>Topic coverage</h3>
        <p>{feedback.topicCoverageNotes}</p>
      </div>
      <div className="section-card">
        <h3>One improvement</h3>
        <p>{feedback.improvementSuggestion}</p>
      </div>
    </div>
  );
}
