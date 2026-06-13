type Props = {
    transcript: string;
    source?: string;
    usedFallback?: boolean;
};
export function TranscriptPanel({ transcript, source, usedFallback }: Props) {
    return (
        <div className="stack-sm">
            <div className="row wrap">
                {source && <span className="badge">Source: {source}</span>}
                {usedFallback && <span className="badge muted">Fallback transcript</span>}
            </div>
            <div className="transcript-panel">
                {transcript || "Transcript will appear here after processing."}
            </div>
        </div>
    );
}