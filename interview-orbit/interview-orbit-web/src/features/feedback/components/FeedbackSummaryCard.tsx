import type { FeedbackResponse } from "../types/feedback";

type Props = {
  feedback: FeedbackResponse | null;
  isLoading?: boolean;
  error?: string;
};

function pacingClass(label: string): string {
  return label === "Balanced" ? "metric-good" : "metric-warn";
}

function fillerClass(count: number): string {
  if (count <= 2) return "metric-good";
  if (count <= 5) return "metric-warn";
  return "metric-bad";
}

export function confidenceScore(wpm: number, fillers: number): number {
  let wpmScore = 0;
  if (wpm >= 120 && wpm <= 160) wpmScore = 50;
  else if ((wpm >= 100 && wpm < 120) || (wpm > 160 && wpm <= 190)) wpmScore = 40;
  else if ((wpm >= 80 && wpm < 100) || wpm > 190) wpmScore = 25;
  else wpmScore = 10;

  let fillerScore = 0;
  if (fillers <= 2) fillerScore = 50;
  else if (fillers <= 5) fillerScore = 30;
  else fillerScore = 10;

  return wpmScore + fillerScore;
}

function scoreClass(score: number): string {
  if (score >= 80) return "metric-good";
  if (score >= 50) return "metric-warn";
  return "metric-bad";
}

export function FeedbackSummaryCard({ feedback, isLoading = false, error = "" }: Props) {
  if (isLoading) return <div className="processing-box">Analyzing transcript...</div>;
  if (error) return <p className="error-text">{error}</p>;
  if (!feedback) return <p>No feedback yet. Record an answer and generate a transcript first.</p>;

  const score = confidenceScore(feedback.wordsPerMinuteEstimate, feedback.fillerWordCount);

  return (
    <div className="stack-sm">
      <div className="section-card confidence-card">
        <h3>Confidence score</h3>
        <div className="confidence-row">
          <span className={`confidence-score ${scoreClass(score)}`}>{score}<span className="confidence-denom">/100</span></span>
          <div className="confidence-bar-track">
            <div className={`confidence-bar-fill ${scoreClass(score)}`} style={{ width: `${score}%` }} />
          </div>
        </div>
      </div>
      <div className="grid two">
        <div className="section-card">
          <h3>Filler words</h3>
          <p className={`metric-value ${fillerClass(feedback.fillerWordCount)}`}>
            {feedback.fillerWordCount}
          </p>
        </div>
        <div className="section-card">
          <h3>Pacing</h3>
          <p className={`metric-value ${pacingClass(feedback.pacingLabel)}`}>
            {feedback.pacingLabel}
          </p>
          <p className="metric-sub">{feedback.wordsPerMinuteEstimate} WPM</p>
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
