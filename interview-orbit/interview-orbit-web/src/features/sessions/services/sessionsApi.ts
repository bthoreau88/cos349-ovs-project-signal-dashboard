import { apiClient } from "../../../services/apiClient";
import type { CreateSessionRequest, InterviewSession, SessionTrend } from "../types/session";

export async function createSession(request: CreateSessionRequest): Promise<InterviewSession> {
  return apiClient<InterviewSession>("/api/sessions", {
    method: "POST",
    body: JSON.stringify(request)
  });
}

export async function getRecentSessions(): Promise<InterviewSession[]> {
  return apiClient<InterviewSession[]>("/api/sessions");
}

export async function getSessionTrends(): Promise<SessionTrend> {
  return apiClient<SessionTrend>("/api/sessions/trends");
}
