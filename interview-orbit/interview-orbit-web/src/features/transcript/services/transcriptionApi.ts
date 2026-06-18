import { apiBaseUrl } from "../../../services/apiClient";
import type { TranscriptResponse } from "../types/transcript";

export async function transcribeAudioFallback(
  audioBlob: Blob,
  durationSeconds: number,
  mimeType: string
): Promise<TranscriptResponse> {
  const formData = new FormData();
  formData.append("audio", audioBlob, `answer.${mimeType.includes("ogg") ? "ogg" : "webm"}`);
  formData.append("durationSeconds", String(durationSeconds));

  const response = await fetch(`${apiBaseUrl}/api/transcription`, {
    method: "POST",
    body: formData
  });

  if (!response.ok) {
    throw new Error(`Transcription failed with status ${response.status}`);
  }

  return response.json();
}
