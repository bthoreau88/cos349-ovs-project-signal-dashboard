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

    const response = await fetch("http://localhost:5158/api/transcription", {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        throw new Error(`Transcription failed with status ${response.status}`);
    }

    return response.json();
}