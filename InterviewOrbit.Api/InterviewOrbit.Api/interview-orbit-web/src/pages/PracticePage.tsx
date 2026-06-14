import { useEffect, useState } from "react";
import { getPrompts, type PromptDto } from "../features/prompts/services/promptsApi";
import { useRecorder } from "../features/recording/hooks/useRecorder";
import { useSpeechRecognition } from "../features/recording/hooks/useSpeechRecognition";
import { resolveTranscript } from "../features/transcript/services/transcriptionApi";
import type { TranscriptResponse } from "../features/transcript/types/transcript";
import { analyzeFeedback } from "../features/feedback/services/feedbackApi";
import type { FeedbackResponse } from "../features/feedback/types/feedback";
import { FeedbackSummaryCard } from "../features/feedback/components/FeedbackSummaryCard";
import { createSession } from "../features/sessions/services/sessionsApi";

export default function PracticePage() {
    const [prompts, setPrompts] = useState<PromptDto[]>([]);
    const [selectedPromptId, setSelectedPromptId] = useState<number | "">("");
    const [error, setError] = useState("");

    const [transcriptResult, setTranscriptResult] = useState<TranscriptResponse | null>(null);
    const [transcriptError, setTranscriptError] = useState("");
    const [isTranscribing, setIsTranscribing] = useState(false);

    const [feedback, setFeedback] = useState<FeedbackResponse | null>(null);
    const [feedbackError, setFeedbackError] = useState("");
    const [isAnalyzingFeedback, setIsAnalyzingFeedback] = useState(false);

    const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
    const [saveError, setSaveError] = useState("");

    const {
        isRecording,
        durationSeconds,
        audioUrl,
        error: recorderError,
        startRecording,
        stopRecording,
        resetRecording,
    } = useRecorder();

    // Real in-browser speech-to-text. Falls back to the backend transcript
    // path when the browser does not support the Web Speech API.
    const speech = useSpeechRecognition();

    useEffect(() => {
        async function loadPrompts() {
            try {
                const data = await getPrompts();
                setPrompts(data);

                if (data.length > 0) {
                    setSelectedPromptId(data[0].id);
                    setError("");
                } else {
                    setError("No prompts were returned by the API.");
                }
            } catch (err) {
                console.error(err);
                setError("Failed to load prompts.");
            }
        }

        loadPrompts();
    }, []);

    const selectedPromptObject =
        prompts.find((p) => p.id === selectedPromptId) ?? null;

    const selectedPrompt =
        selectedPromptObject?.question ?? "No prompt selected.";

    async function handleStart() {
        setTranscriptResult(null);
        setTranscriptError("");
        setFeedback(null);
        setFeedbackError("");
        setSaveState("idle");
        setSaveError("");

        if (speech.supported) {
            speech.start();
        }
        await startRecording();
    }

    async function handleStop() {
        setTranscriptError("");
        setFeedback(null);
        setFeedbackError("");
        setSaveState("idle");
        setSaveError("");
        setIsTranscribing(true);

        try {
            const recordingResult = await stopRecording();
            const liveTranscript = speech.supported ? await speech.stop() : "";

            if (!recordingResult) {
                setTranscriptError("No audio was captured.");
                return;
            }

            const transcript = await resolveTranscript({
                liveTranscript,
                audioBlob: recordingResult.blob,
                durationSeconds: recordingResult.durationSeconds,
                mimeType: recordingResult.mimeType,
            });

            setTranscriptResult(transcript);
            setIsTranscribing(false);

            setIsAnalyzingFeedback(true);

            try {
                const feedbackResult = await analyzeFeedback({
                    transcriptText: transcript.transcriptText,
                    durationSeconds: recordingResult.durationSeconds,
                    targetAnswerLengthSeconds:
                        selectedPromptObject?.suggestedTargetSeconds ?? 120,
                    targetKeywords: selectedPromptObject?.targetKeywords ?? [],
                });

                setFeedback(feedbackResult);
            } catch (feedbackErr) {
                console.error("feedback error:", feedbackErr);
                setFeedbackError("Feedback analysis failed.");
            }
        } catch (transcriptionErr) {
            console.error("transcription error:", transcriptionErr);
            setTranscriptError("Transcription failed.");
        } finally {
            setIsTranscribing(false);
            setIsAnalyzingFeedback(false);
        }
    }

    function handleReset() {
        resetRecording();
        speech.reset();
        setTranscriptResult(null);
        setTranscriptError("");
        setFeedback(null);
        setFeedbackError("");
        setIsTranscribing(false);
        setIsAnalyzingFeedback(false);
        setSaveState("idle");
        setSaveError("");
    }

    async function handleSaveSession() {
        if (!selectedPromptObject || !transcriptResult || !feedback) return;

        try {
            setSaveState("saving");
            setSaveError("");

            await createSession({
                promptId: selectedPromptObject.id,
                promptTitleSnapshot: selectedPromptObject.title ?? "Untitled Prompt",
                categorySnapshot: selectedPromptObject.category ?? "Unknown",
                roleSnapshot: selectedPromptObject.role ?? "Unknown",
                transcriptText: transcriptResult.transcriptText,
                durationSeconds,
                feedback,
            });

            setSaveState("saved");
        } catch (err) {
            console.error(err);
            setSaveState("error");
            setSaveError("Could not save the session.");
        }
    }

    return (
        <main>
            <h1>Practice</h1>

            <p>Select a prompt and begin practicing.</p>

            {error && <p>{error}</p>}
            {recorderError && <p>{recorderError}</p>}
            {transcriptError && <p>{transcriptError}</p>}

            <label htmlFor="prompt-select">Prompt</label>
            <br />
            <select
                id="prompt-select"
                value={selectedPromptId}
                onChange={(e) => setSelectedPromptId(Number(e.target.value))}
            >
                {prompts.length === 0 ? (
                    <option value="">No prompts available</option>
                ) : (
                    prompts.map((prompt) => (
                        <option key={prompt.id} value={prompt.id}>
                            {prompt.question}
                        </option>
                    ))
                )}
            </select>

            <h2>Selected Prompt</h2>
            <p>{selectedPrompt}</p>

            <p>Status: {isRecording ? "Recording..." : "Idle"}</p>
            <p>Duration: {durationSeconds}s</p>

            <div style={{ marginTop: "1rem" }}>
                {!isRecording ? (
                    <button type="button" onClick={handleStart}>
                        Start Recording
                    </button>
                ) : (
                    <button type="button" onClick={handleStop}>
                        Stop Recording
                    </button>
                )}

                <button
                    type="button"
                    style={{ marginLeft: "0.5rem" }}
                    onClick={handleReset}
                >
                    Reset
                </button>
            </div>

            {audioUrl && (
                <>
                    <h2 style={{ marginTop: "1rem" }}>Playback</h2>
                    <audio controls src={audioUrl} />
                </>
            )}

            <h2 style={{ marginTop: "1rem" }}>Transcript</h2>

            {isTranscribing && <p>Processing audio and generating transcript...</p>}

            {!isTranscribing && !transcriptResult && !transcriptError && (
                <p>Transcript will appear here.</p>
            )}

            {transcriptResult && (
                <div>
                    <p>{transcriptResult.transcriptText}</p>
                    <p>Source: {transcriptResult.source}</p>
                    {transcriptResult.usedFallback && <p>Fallback transcript</p>}
                </div>
            )}

            <div style={{ marginTop: "1rem" }}>
                <FeedbackSummaryCard
                    feedback={feedback}
                    isLoading={isAnalyzingFeedback}
                    error={feedbackError}
                />
            </div>

            {feedback && (
                <div style={{ marginTop: "1rem" }}>
                    <button
                        type="button"
                        onClick={handleSaveSession}
                        disabled={saveState === "saving"}
                    >
                        {saveState === "saving"
                            ? "Saving..."
                            : saveState === "saved"
                                ? "Saved to history"
                                : "Save Session"}
                    </button>

                    {saveError && <p>{saveError}</p>}
                </div>
            )}
        </main>
    );
}