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

function scoreLabel(score: number): string {
  if (score >= 80) return "Strong";
  if (score >= 50) return "Developing";
  return "Needs work";
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
          <div
            className="confidence-bar-track"
            role="progressbar"
            aria-valuenow={score}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Confidence score: ${score} out of 100`}
          >
            <div className={`confidence-bar-fill ${scoreClass(score)}`} style={{ width: `${score}%` }} />
          </div>
        </div>
        <p className={`score-label ${scoreClass(score)}`}>{scoreLabel(score)}</p>
        <details className="score-details">
          <summary className="metric-hint">How is this calculated?</summary>
          <ul className="score-formula">
            <li>Pace (up to 50 pts): 120–160 WPM = 50, near range = 40, far = 25, very slow/fast = 10</li>
            <li>Filler words (up to 50 pts): 0–2 = 50, 3–5 = 30, 6+ = 10</li>
          </ul>
        </details>
      </div>
      <div className="grid two">
        <div className="section-card">
          <h3>Filler words</h3>
          <p className={`metric-value ${fillerClass(feedback.fillerWordCount)}`}>
            {feedback.fillerWordCount}
          </p>
          <p className="metric-hint">um, uh, like, you know, so, actually</p>
        </div>
        <div className="section-card">
          <h3>Pacing</h3>
          <p className={`metric-value ${pacingClass(feedback.pacingLabel)}`}>
            {feedback.pacingLabel}
          </p>
          <p className="metric-sub">{feedback.wordsPerMinuteEstimate} WPM</p>
          <p className="metric-hint">Balanced = 120–160 WPM</p>
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
