import { useEffect, useState } from "react";
import type { Prompt } from "../types/prompt";
import { getPrompts } from "../services/promptsApi";

type Props = {
  value: Prompt | null;
  onChange: (prompt: Prompt) => void;
};

const ALL = "All";

export function PromptPicker({ value, onChange }: Props) {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>(ALL);

  useEffect(() => {
    getPrompts()
      .then(setPrompts)
      .catch(() => setError("Could not load prompts. Is the backend running?"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="processing-box">Loading prompts...</div>;
  if (error) return <p className="error-text">{error}</p>;

  const categories = [ALL, ...Array.from(new Set(prompts.map((p) => p.category)))];
  const visible = activeCategory === ALL
    ? prompts
    : prompts.filter((p) => p.category === activeCategory);

  return (
    <div className="stack-sm">
      <div className="tab-bar">
        {categories.map((cat) => (
          <button
            key={cat}
            className={activeCategory === cat ? "tab-btn active" : "tab-btn"}
            onClick={() => setActiveCategory(cat)}
            type="button"
          >
            {cat}
          </button>
        ))}
      </div>
      {visible.map((prompt) => (
        <button
          key={prompt.id}
          className={value?.id === prompt.id ? "prompt-item selected" : "prompt-item"}
          onClick={() => onChange(prompt)}
          type="button"
        >
          <strong>{prompt.title}</strong>
          <span>{prompt.questionText}</span>
        </button>
      ))}
    </div>
  );
}
