import { useState } from "react";
import { Link } from "react-router-dom";
import type { Prompt } from "../../prompts/types/prompt";
import { useRecorder } from "../hooks/useRecorder";
import { transcribeAudioFallback } from "../../transcript/services/transcriptionApi";
import { TranscriptPanel } from "../../transcript/components/TranscriptPanel";
import type { TranscriptResponse } from "../../transcript/types/transcript";
import { analyzeFeedback } from "../../feedback/services/feedbackApi";
import type { FeedbackResponse } from "../../feedback/types/feedback";
import { FeedbackSummaryCard } from "../../feedback/components/FeedbackSummaryCard";
import { createSession } from "../../sessions/services/sessionsApi";

type Props = {
  selectedPrompt: Prompt | null;
};

export function RecordingPanel({ selectedPrompt }: Props) {
  const {
    recordingState,
    durationSeconds,
    errorMessage,
    audioUrl,
    startRecording,
    stopRecording,
    reset
  } = useRecorder();

  const [transcriptResult, setTranscriptResult] = useState<TranscriptResponse | null>(null);
  const [transcriptError, setTranscriptError] = useState("");
  const [feedback, setFeedback] = useState<FeedbackResponse | null>(null);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [saveError, setSaveError] = useState("");

  const canStart =
    !!selectedPrompt &&
    (recordingState === "idle" || recordingState === "done" || recordingState === "error");
  const canStop = recordingState === "recording";

  async function handleStart() {
    setTranscriptResult(null);
    setTranscriptError("");
    setFeedback(null);
    setSaveState("idle");
    setSaveError("");
    reset();
    await startRecording();
  }

  async function handleStop() {
    setTranscriptError("");
    setFeedback(null);
    setSaveError("");

    try {
      const result = await stopRecording();
      if (!result) {
        setTranscriptError("No recording was captured.");
        return;
      }

      let transcript: TranscriptResponse;

      if (result.speechTranscript) {
        // Real transcript from Web Speech API (Chrome/Edge)
        transcript = {
          transcriptText: result.speechTranscript,
          source: "web-speech-api",
          usedFallback: false
        };
      } else {
        // Browser doesn't support SpeechRecognition — send audio to backend
        transcript = await transcribeAudioFallback(
          result.blob,
          result.durationSeconds,
          result.mimeType
        );
      }

      setTranscriptResult(transcript);
      setFeedbackLoading(true);

      const feedbackResponse = await analyzeFeedback({
        transcriptText: transcript.transcriptText,
        durationSeconds: result.durationSeconds,
        targetAnswerLengthSeconds: selectedPrompt?.suggestedTargetSeconds,
        targetKeywords: selectedPrompt?.targetKeywords ?? []
      });

      setFeedback(feedbackResponse);
    } catch {
      setTranscriptError("Processing failed. Check that the backend is running at http://localhost:5158.");
    } finally {
      setFeedbackLoading(false);
    }
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
        feedback
      });
      setSaveState("saved");
    } catch {
      setSaveState("error");
      setSaveError("Could not save the session. Check that the backend is running.");
    }
  }

  function handleReset() {
    reset();
    setTranscriptResult(null);
    setTranscriptError("");
    setFeedback(null);
    setSaveError("");
    setSaveState("idle");
  }

  const statusLabel: Record<string, string> = {
    idle: "Ready to record",
    recording: "Recording in progress",
    processing: "Processing transcript...",
    done: "Recording complete",
    error: "Recording error",
  };

  const formattedDuration = durationSeconds < 60
    ? `${durationSeconds}s`
    : `${Math.floor(durationSeconds / 60)}m ${durationSeconds % 60}s`;

  return (
    <div className="stack-sm">
      <div className="recording-status-card">
        <p><strong>Prompt:</strong> {selectedPrompt ? selectedPrompt.title : "Select a prompt above first"}</p>
        <p><strong>Status:</strong> {statusLabel[recordingState] ?? recordingState}</p>
        {durationSeconds > 0 && <p><strong>Duration:</strong> {formattedDuration}</p>}
      </div>

      <div className="row wrap">
        <button type="button" onClick={handleStart} disabled={!canStart}>
          {recordingState === "recording" ? "Recording..." : "Start recording"}
        </button>
        <button type="button" onClick={handleStop} disabled={!canStop}>
          Stop &amp; analyze
        </button>
        <button type="button" onClick={handleReset}>
          Reset
        </button>
      </div>

      {errorMessage && (
        <p className="error-text">
          {errorMessage.toLowerCase().includes("permission") || errorMessage.toLowerCase().includes("denied")
            ? "Microphone access was denied. In Chrome: click the lock icon in the address bar → allow microphone → refresh."
            : errorMessage}
        </p>
      )}
      {transcriptError && <p className="error-text">{transcriptError}</p>}

      {audioUrl && (
        <div className="stack-sm">
          <strong>Audio preview</strong>
          <audio controls src={audioUrl} />
        </div>
      )}

      {recordingState === "processing" && (
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
          <button
            type="button"
            onClick={handleSaveSession}
            disabled={saveState === "saving" || saveState === "saved"}
          >
            {saveState === "saving"
              ? "Saving..."
              : saveState === "saved"
              ? "Saved to history"
              : "Save session"}
          </button>
          {saveState === "saved" && (
            <Link to="/history" className="button-link">View in History</Link>
          )}
          {saveError && <p className="error-text">{saveError}</p>}
        </div>
      )}
    </div>
  );
}
