import { apiClient } from "../../../services/apiClient";
import type { Prompt } from "../types/prompt";

export async function getPrompts(): Promise<Prompt[]> {
  return apiClient<Prompt[]>("/api/prompts");
}
