export type FeedbackRequest = {
    transcriptText: string;
    durationSeconds: number;
    targetAnswerLengthSeconds?: number;
    targetKeywords?: string[];
};

export type FeedbackResponse = {
    fillerWordCount: number;
    wordsPerMinuteEstimate: number;
    pacingLabel: string;
    clarityNotes: string;
    topicCoverageNotes: string;
    improvementSuggestion: string;
};