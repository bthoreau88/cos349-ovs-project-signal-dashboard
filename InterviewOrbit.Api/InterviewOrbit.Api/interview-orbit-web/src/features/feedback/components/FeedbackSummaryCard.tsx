import type { FeedbackResponse } from "../types/feedback";

type Props = {
    feedback: FeedbackResponse | null;
    isLoading?: boolean;
    error?: string;
};

export function FeedbackSummaryCard({
    feedback,
    isLoading = false,
    error = "",
}: Props) {
    if (isLoading) {
        return (
            <div>
                <h2>Feedback</h2>
                <p>Analyzing transcript...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <h2>Feedback</h2>
                <p>{error}</p>
            </div>
        );
    }

    if (!feedback) {
        return (
            <div>
                <h2>Feedback</h2>
                <p>No feedback yet.</p>
            </div>
        );
    }

    return (
        <div>
            <h2>Feedback</h2>
            <p>Filler Words: {feedback.fillerWordCount}</p>
            <p>
                Pacing: {feedback.pacingLabel} - {feedback.wordsPerMinuteEstimate} WPM
            </p>
            <p>Clarity: {feedback.clarityNotes}</p>
            <p>Topic Coverage: {feedback.topicCoverageNotes}</p>
            <p>Improvement: {feedback.improvementSuggestion}</p>
        </div>
    );
}