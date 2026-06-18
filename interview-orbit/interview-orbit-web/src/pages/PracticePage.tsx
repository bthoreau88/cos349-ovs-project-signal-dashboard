import { useState } from "react";
import { PageHeader } from "../components/PageHeader";
import { SectionCard } from "../components/SectionCard";
import { PromptPicker } from "../features/prompts/components/PromptPicker";
import { RecordingPanel } from "../features/recording/components/RecordingPanel";
import type { Prompt } from "../features/prompts/types/prompt";

export function PracticePage() {
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);

  return (
    <>
      <PageHeader
        title="Practice"
        subtitle="Choose one prompt and record one answer."
      />
      <div className="stack">
        <SectionCard title="1. Pick a prompt">
          <PromptPicker value={selectedPrompt} onChange={setSelectedPrompt} />
        </SectionCard>
        <SectionCard title="2. Record your answer">
          <RecordingPanel selectedPrompt={selectedPrompt} />
        </SectionCard>
      </div>
    </>
  );
}
