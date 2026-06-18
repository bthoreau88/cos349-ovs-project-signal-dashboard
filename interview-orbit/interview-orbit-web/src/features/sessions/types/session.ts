import type { FeedbackResponse } from "../../feedback/types/feedback";

export type InterviewSession = {
  id: number;
  promptTitleSnapshot: string;
  categorySnapshot: string;
  roleSnapshot: string;
  transcriptText: string;
  durationSeconds: number;
  createdAtUtc: string;
  feedback: FeedbackResponse;
};

export type SessionTrend = {
  totalSessions: number;
  averageDurationSeconds: number;
  averageFillerWords: number;
  mostRecentPacingLabel: string;
};

export type CreateSessionRequest = {
  promptId?: number;
  promptTitleSnapshot: string;
  categorySnapshot: string;
  roleSnapshot: string;
  transcriptText: string;
  durationSeconds: number;
  feedback: FeedbackResponse;
};
