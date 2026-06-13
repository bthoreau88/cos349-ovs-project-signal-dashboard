import { useEffect, useRef, useState } from "react";

export type RecorderResult = {
    blob: Blob;
    mimeType: string;
    durationSeconds: number;
};

export function useRecorder() {
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<number | null>(null);

    const [isRecording, setIsRecording] = useState(false);
    const [durationSeconds, setDurationSeconds] = useState(0);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [error, setError] = useState("");

    const startRecording = async () => {
        try {
            setError("");
            setAudioBlob(null);

            if (audioUrl) {
                URL.revokeObjectURL(audioUrl);
                setAudioUrl(null);
            }

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);

            chunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
            };

            mediaRecorderRef.current = mediaRecorder;
            mediaRecorder.start();
            setIsRecording(true);
            setDurationSeconds(0);

            timerRef.current = window.setInterval(() => {
                setDurationSeconds((prev) => prev + 1);
            }, 1000);
        } catch (err) {
            console.error(err);
            setError("Microphone access failed.");
        }
    };

    const stopRecording = (): Promise<RecorderResult | null> => {
        return new Promise((resolve) => {
            const mediaRecorder = mediaRecorderRef.current;

            if (!mediaRecorder) {
                resolve(null);
                return;
            }

            const stream = mediaRecorder.stream;
            const finalDuration = durationSeconds;

            mediaRecorder.onstop = () => {
                const mimeType = mediaRecorder.mimeType || "audio/webm";
                const blob = new Blob(chunksRef.current, { type: mimeType });

                setAudioBlob(blob);

                const url = URL.createObjectURL(blob);
                setAudioUrl(url);

                stream.getTracks().forEach((track) => track.stop());

                resolve({
                    blob,
                    mimeType,
                    durationSeconds: finalDuration,
                });
            };

            mediaRecorder.stop();
            setIsRecording(false);

            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        });
    };

    const resetRecording = () => {
        setIsRecording(false);
        setDurationSeconds(0);
        setAudioBlob(null);

        if (audioUrl) {
            URL.revokeObjectURL(audioUrl);
        }

        setAudioUrl(null);
        setError("");
    };

    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            if (audioUrl) URL.revokeObjectURL(audioUrl);
        };
    }, [audioUrl]);

    return {
        isRecording,
        durationSeconds,
        audioBlob,
        audioUrl,
        error,
        startRecording,
        stopRecording,
        resetRecording,
    };
}