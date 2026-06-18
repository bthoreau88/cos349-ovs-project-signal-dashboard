import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { RecorderResult, RecordingState } from "../types/recording";

// Extend window type for browser SpeechRecognition APIs
declare global {
  interface Window {
    SpeechRecognition?: typeof SpeechRecognition;
    webkitSpeechRecognition?: typeof SpeechRecognition;
  }
}

function pickSupportedMimeType(): string {
  const candidates = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4",
    "audio/ogg;codecs=opus"
  ];
  for (const type of candidates) {
    if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(type)) {
      return type;
    }
  }
  return "";
}

function getSpeechRecognition(): SpeechRecognition | null {
  const SR = window.SpeechRecognition ?? window.webkitSpeechRecognition;
  if (!SR) return null;
  const recognition = new SR();
  recognition.continuous = true;
  recognition.interimResults = false;
  recognition.lang = "en-US";
  return recognition;
}

export function useRecorder() {
  const [recordingState, setRecordingState] = useState<RecordingState>("idle");
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [audioUrl, setAudioUrl] = useState<string>("");

  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const startedAtRef = useRef<number>(0);
  const speechRef = useRef<SpeechRecognition | null>(null);
  const speechTranscriptRef = useRef<string>("");

  const mimeType = useMemo(() => pickSupportedMimeType(), []);

  const reset = useCallback(() => {
    setRecordingState("idle");
    setDurationSeconds(0);
    setErrorMessage("");
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl("");
    }
    chunksRef.current = [];
    speechTranscriptRef.current = "";
  }, [audioUrl]);

  const cleanupStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    recorderRef.current = null;
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    speechRef.current?.stop();
    speechRef.current = null;
  }, []);

  useEffect(() => {
    return () => {
      cleanupStream();
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl, cleanupStream]);

  const startRecording = useCallback(async () => {
    try {
      setErrorMessage("");
      setRecordingState("requesting-permission");
      speechTranscriptRef.current = "";

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Start Web Speech API in parallel with MediaRecorder
      const recognition = getSpeechRecognition();
      if (recognition) {
        recognition.onresult = (event: SpeechRecognitionEvent) => {
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              speechTranscriptRef.current += event.results[i][0].transcript + " ";
            }
          }
        };
        recognition.onerror = () => {
          // Non-fatal: fall back to backend transcription
        };
        recognition.start();
        speechRef.current = recognition;
      }

      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);
      recorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };

      recorder.onerror = () => {
        setErrorMessage("Recording failed. Please try again.");
        setRecordingState("error");
      };

      recorder.onstart = () => {
        startedAtRef.current = Date.now();
        setDurationSeconds(0);
        setRecordingState("recording");
        timerRef.current = window.setInterval(() => {
          const elapsed = Math.floor((Date.now() - startedAtRef.current) / 1000);
          setDurationSeconds(elapsed);
        }, 250);
      };

      recorder.start(1000);
    } catch (err) {
      const name = err instanceof DOMException ? err.name : "";
      if (name === "NotAllowedError" || name === "PermissionDeniedError") {
        setErrorMessage(
          "Microphone blocked. Click the camera/lock icon in the browser address bar, set Microphone to Allow, then refresh."
        );
      } else if (name === "NotFoundError" || name === "DevicesNotFoundError") {
        setErrorMessage("No microphone found. Plug one in and try again.");
      } else if (name === "NotReadableError" || name === "TrackStartError") {
        setErrorMessage(
          "Microphone is in use by another app. Close Teams, Zoom, or any recording software, then try again."
        );
      } else {
        setErrorMessage("Microphone unavailable. Make sure you are using Chrome or Edge on localhost.");
      }
      setRecordingState("error");
    }
  }, [mimeType]);

  const stopRecording = useCallback(async (): Promise<RecorderResult | null> => {
    const recorder = recorderRef.current;
    if (!recorder || recorder.state !== "recording") return null;

    setRecordingState("processing");

    // Stop speech recognition first to flush final results
    speechRef.current?.stop();

    return new Promise((resolve) => {
      recorder.onstop = () => {
        const finalMimeType = recorder.mimeType || mimeType || "audio/webm";
        const blob = new Blob(chunksRef.current, { type: finalMimeType });
        const finalDuration = Math.max(
          durationSeconds,
          Math.floor((Date.now() - startedAtRef.current) / 1000)
        );

        if (audioUrl) URL.revokeObjectURL(audioUrl);
        const nextAudioUrl = URL.createObjectURL(blob);
        setAudioUrl(nextAudioUrl);
        setRecordingState("done");
        cleanupStream();

        resolve({
          blob,
          mimeType: finalMimeType,
          durationSeconds: finalDuration,
          speechTranscript: speechTranscriptRef.current.trim()
        });
      };

      recorder.stop();
    });
  }, [audioUrl, cleanupStream, durationSeconds, mimeType]);

  return {
    recordingState,
    durationSeconds,
    errorMessage,
    audioUrl,
    startRecording,
    stopRecording,
    reset
  };
}
