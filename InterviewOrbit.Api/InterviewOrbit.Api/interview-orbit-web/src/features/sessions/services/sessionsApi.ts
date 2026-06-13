import apiClient from "../../../services/apiClient";
import type { CreateSessionRequest, InterviewSession, SessionTrend } from "../types/session";

export async function createSession(
    request: CreateSessionRequest
): Promise<InterviewSession> {
    const response = await apiClient.post("/api/sessions", request);
    return response.data;
}

export async function getRecentSessions(): Promise<InterviewSession[]> {
    const response = await apiClient.get("/api/sessions");
    return response.data;
}

export async function getSessionTrends(): Promise<SessionTrend> {
    const response = await apiClient.get("/api/sessions/trends");
    return response.data;
}