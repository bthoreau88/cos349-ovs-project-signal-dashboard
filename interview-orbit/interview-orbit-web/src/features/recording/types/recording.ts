export type RecordingState =
  | "idle"
  | "requesting-permission"
  | "ready"
  | "recording"
  | "processing"
  | "done"
  | "error";

export type RecorderResult = {
  blob: Blob;
  mimeType: string;
  durationSeconds: number;
  speechTranscript: string;
};
