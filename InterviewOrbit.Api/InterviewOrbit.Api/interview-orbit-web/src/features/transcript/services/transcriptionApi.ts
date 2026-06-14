import { API_BASE_URL } from "../../../services/apiClient";
import type { TranscriptResponse } from "../types/transcript";

export async function transcribeAudio(
    audioBlob: Blob,
    durationSeconds: number,
    mimeType: string
): Promise<TranscriptResponse> {
    const formData = new FormData();
    const extension = mimeType.includes("ogg") ? "ogg" : "webm";

    formData.append("audio", audioBlob, `answer.${extension}`);
    formData.append("durationSeconds", String(durationSeconds));

    // Use raw fetch (not the axios client) so the browser sets the correct
    // multipart/form-data boundary, but share the same configured base URL.
    const response = await fetch(`${API_BASE_URL}/api/transcription`, {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        throw new Error(`Transcription failed with status ${response.status}`);
    }

    return response.json();
}