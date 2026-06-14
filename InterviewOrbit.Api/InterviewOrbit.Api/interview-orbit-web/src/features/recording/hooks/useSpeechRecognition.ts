import { useRef, useState } from "react";

// Minimal Web Speech API typings. These interfaces are intentionally small and
// are NOT part of the standard TypeScript DOM lib, so we declare just what we
// use. The real recognizer is provided by the browser (Chrome/Edge).
interface SpeechAlternative {
    transcript: string;
}
interface SpeechResult {
    readonly isFinal: boolean;
    readonly length: number;
    [index: number]: SpeechAlternative;
}
interface SpeechResultList {
    readonly length: number;
    [index: number]: SpeechResult;
}
interface SpeechResultEvent {
    readonly resultIndex: number;
    readonly results: SpeechResultList;
}
interface SpeechErrorEvent {
    readonly error: string;
}
interface SpeechRecognizer {
    lang: string;
    continuous: boolean;
    interimResults: boolean;
    start: () => void;
    stop: () => void;
    onresult: ((event: SpeechResultEvent) => void) | null;
    onerror: ((event: SpeechErrorEvent) => void) | null;
    onend: (() => void) | null;
}
type SpeechRecognizerConstructor = new () => SpeechRecognizer;

function getRecognizerConstructor(): SpeechRecognizerConstructor | null {
    if (typeof window === "undefined") return null;
    const w = window as unknown as {
        SpeechRecognition?: SpeechRecognizerConstructor;
        webkitSpeechRecognition?: SpeechRecognizerConstructor;
    };
    return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

// Live, in-browser speech-to-text. Captures the spoken answer while the user
// records and returns the final transcript text on stop. If the browser does
// not support the Web Speech API, `supported` is false and the caller should
// fall back to the backend transcription endpoint.
export function useSpeechRecognition() {
    const recognizerRef = useRef<SpeechRecognizer | null>(null);
    const finalTranscriptRef = useRef("");
    const [supported] = useState(() => getRecognizerConstructor() !== null);
    const [error, setError] = useState("");

    function start() {
        const Recognizer = getRecognizerConstructor();
        if (!Recognizer) return;

        finalTranscriptRef.current = "";
        setError("");

        const recognizer = new Recognizer();
        recognizer.lang = "en-US";
        recognizer.continuous = true;
        recognizer.interimResults = true;

        recognizer.onresult = (event) => {
            let finalText = "";
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i];
                if (result.isFinal) {
                    finalText += result[0].transcript;
                }
            }
            if (finalText) {
                finalTranscriptRef.current += finalText;
            }
        };

        recognizer.onerror = (event) => {
            setError(event.error || "speech-recognition-error");
        };

        recognizerRef.current = recognizer;

        try {
            recognizer.start();
        } catch {
            // start() throws if called while already running; safe to ignore.
        }
    }

    // Stops recognition and resolves with the accumulated final transcript.
    // Waits for the recognizer's `onend` so late-arriving final results are
    // included, with a short safety timeout.
    function stop(): Promise<string> {
        return new Promise((resolve) => {
            const recognizer = recognizerRef.current;
            if (!recognizer) {
                resolve(finalTranscriptRef.current.trim());
                return;
            }
            recognizer.onend = () => resolve(finalTranscriptRef.current.trim());
            try {
                recognizer.stop();
            } catch {
                resolve(finalTranscriptRef.current.trim());
            }
            window.setTimeout(() => resolve(finalTranscriptRef.current.trim()), 1500);
        });
    }

    function reset() {
        finalTranscriptRef.current = "";
        setError("");
    }

    return { supported, error, start, stop, reset };
}
