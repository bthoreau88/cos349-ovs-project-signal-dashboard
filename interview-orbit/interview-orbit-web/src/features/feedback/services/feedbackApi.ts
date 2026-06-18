import { apiClient } from "../../../services/apiClient";
import type { FeedbackRequest, FeedbackResponse } from "../types/feedback";

export async function analyzeFeedback(request: FeedbackRequest): Promise<FeedbackResponse> {
  return apiClient<FeedbackResponse>("/api/feedback/analyze", {
    method: "POST",
    body: JSON.stringify(request)
  });
}
