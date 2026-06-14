import { useState } from "react";
import type { PromptDto } from "../../prompts/services/promptsApi";
import { useRecorder } from "../hooks/useRecorder";
import { transcribeAudio } from "../../transcript/services/transcriptionApi";
import { TranscriptPanel } from "../../transcript/components/TranscriptPanel";
import type { TranscriptResponse } from "../../transcript/types/transcript";
import { analyzeFeedback } from "../../feedback/services/feedbackApi";
import type { FeedbackResponse } from "../../feedback/types/feedback";
import { FeedbackSummaryCard } from "../../feedback/components/FeedbackSummaryCard";
import { createSession } from "../../sessions/services/sessionsApi";

type Props = {
    selectedPrompt: PromptDto | null;
};

export function RecordingPanel({ selectedPrompt }: Props) {
    const {
        isRecording,
        durationSeconds,
        audioUrl,
        error: recorderError,
        startRecording,
        stopRecording,
        resetRecording,
    } = useRecorder();

    const [transcriptResult, setTranscriptResult] = useState<TranscriptResponse | null>(null);
    const [transcriptError, setTranscriptError] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [feedback, setFeedback] = useState<FeedbackResponse | null>(null);
    const [feedbackLoading, setFeedbackLoading] = useState(false);
    const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
    const [saveError, setSaveError] = useState("");

    // The recorder hook exposes simple booleans; derive a display status from them.
    const status = isRecording
        ? "Recording"
        : isProcessing
            ? "Processing"
            : transcriptResult
                ? "Done"
                : "Idle";

    const canStart = !!selectedPrompt && !isRecording && !isProcessing;
    const canStop = isRecording;

    function clearResults() {
        setTranscriptResult(null);
        setTranscriptError("");
        setFeedback(null);
        setFeedbackLoading(false);
        setSaveState("idle");
        setSaveError("");
    }

    async function handleStart() {
        clearResults();
        await startRecording();
    }

    async function handleStop() {
        setTranscriptError("");
        setFeedback(null);
        setSaveError("");
        setIsProcessing(true);

        try {
            const result = await stopRecording();
            if (!result) {
                setTranscriptError("No recording was captured.");
                return;
            }

            const transcript = await transcribeAudio(
                result.blob,
                result.durationSeconds,
                result.mimeType
            );
            setTranscriptResult(transcript);

            setFeedbackLoading(true);
            const feedbackResponse = await analyzeFeedback({
                transcriptText: transcript.transcriptText,
                durationSeconds: result.durationSeconds,
                targetAnswerLengthSeconds: selectedPrompt?.suggestedTargetSeconds,
                targetKeywords: selectedPrompt?.targetKeywords ?? [],
            });
            setFeedback(feedbackResponse);
        } catch {
            setTranscriptError(
                "Processing failed. Keep the manual transcript fallback in scope for the final MVP."
            );
        } finally {
            setIsProcessing(false);
            setFeedbackLoading(false);
        }
    }

    function handleReset() {
        resetRecording();
        clearResults();
    }

    async function handleSaveSession() {
        if (!selectedPrompt || !transcriptResult || !feedback) return;

        try {
            setSaveState("saving");
            setSaveError("");
            await createSession({
                promptId: selectedPrompt.id,
                promptTitleSnapshot: selectedPrompt.title,
                categorySnapshot: selectedPrompt.category,
                roleSnapshot: selectedPrompt.role,
                transcriptText: transcriptResult.transcriptText,
                durationSeconds,
                feedback,
            });
            setSaveState("saved");
        } catch {
            setSaveState("error");
            setSaveError("Could not save the session.");
        }
    }

    return (
        <div className="stack-sm">
            <div className="recording-status-card">
                <p><strong>Prompt:</strong> {selectedPrompt ? selectedPrompt.title : "Select a prompt first"}</p>
                <p><strong>Status:</strong> {status}</p>
                <p><strong>Duration:</strong> {durationSeconds}s</p>
            </div>

            <div className="row wrap">
                <button type="button" onClick={handleStart} disabled={!canStart}>
                    {isRecording ? "Recording..." : "Start recording"}
                </button>
                <button type="button" onClick={handleStop} disabled={!canStop}>
                    Stop recording
                </button>
                <button type="button" onClick={handleReset}>
                    Reset
                </button>
            </div>

            {recorderError && <p className="error-text">{recorderError}</p>}
            {transcriptError && <p className="error-text">{transcriptError}</p>}

            {audioUrl && (
                <div className="stack-sm">
                    <strong>Audio preview</strong>
                    <audio controls src={audioUrl} />
                </div>
            )}

            {isProcessing && (
                <div className="processing-box">Processing audio and generating transcript...</div>
            )}

            {transcriptResult && (
                <TranscriptPanel
                    transcript={transcriptResult.transcriptText}
                    source={transcriptResult.source}
                    usedFallback={transcriptResult.usedFallback}
                />
            )}

            <FeedbackSummaryCard feedback={feedback} isLoading={feedbackLoading} />

            {feedback && (
                <div className="stack-sm">
                    <button type="button" onClick={handleSaveSession} disabled={saveState === "saving"}>
                        {saveState === "saving"
                            ? "Saving..."
                            : saveState === "saved"
                                ? "Saved to history"
                                : "Save session"}
                    </button>
                    {saveError && <p className="error-text">{saveError}</p>}
                </div>
            )}
        </div>
    );
}
