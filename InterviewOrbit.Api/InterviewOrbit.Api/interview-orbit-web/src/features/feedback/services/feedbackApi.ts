import apiClient from "../../../services/apiClient";
import type { FeedbackRequest, FeedbackResponse } from "../types/feedback";

export async function analyzeFeedback(
    request: FeedbackRequest
): Promise<FeedbackResponse> {
    const response = await apiClient.post("/api/feedback/analyze", request);
    return response.data;
}