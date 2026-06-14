import { useEffect, useState } from "react";
import { getPrompts, type PromptDto } from "../services/promptsApi";

type Props = {
    value: PromptDto | null;
    onChange: (prompt: PromptDto) => void;
};

export function PromptPicker({ value, onChange }: Props) {
    const [prompts, setPrompts] = useState<PromptDto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getPrompts()
            .then(setPrompts)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p>Loading prompts...</p>;

    return (
        <div className="stack-sm">
            {prompts.map((prompt) => (
                <button
                    key={prompt.id}
                    className={value?.id === prompt.id ? "prompt-item selected" : "prompt-item"}
                    onClick={() => onChange(prompt)}
                    type="button"
                >
                    <strong>{prompt.title}</strong>
                    <span>{prompt.question}</span>
                </button>
            ))}
        </div>
    );
}
