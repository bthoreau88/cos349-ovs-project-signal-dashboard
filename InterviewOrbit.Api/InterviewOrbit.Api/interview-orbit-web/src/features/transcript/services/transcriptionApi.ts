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

// Resolves the transcript for a recorded answer, preferring real in-browser
// speech-to-text and falling back to the backend transcription endpoint.
// This keeps both paths behind the single TranscriptResponse contract so the
// rest of the app does not care which source produced the text.
export async function resolveTranscript(opts: {
    liveTranscript: string;
    audioBlob: Blob;
    durationSeconds: number;
    mimeType: string;
}): Promise<TranscriptResponse> {
    const live = opts.liveTranscript.trim();
    if (live.length > 0) {
        return {
            transcriptText: live,
            source: "web-speech",
            usedFallback: false,
        };
    }

    // No live transcript (browser unsupported, denied, silent, or errored) ->
    // use the backend path. It returns its own source / usedFallback flags.
    return transcribeAudio(opts.audioBlob, opts.durationSeconds, opts.mimeType);
}