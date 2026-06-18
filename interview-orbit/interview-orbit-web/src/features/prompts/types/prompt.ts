export type Prompt = {
  id: number;
  category: string;
  role: string;
  title: string;
  questionText: string;
  suggestedTargetSeconds?: number;
  targetKeywords?: string[];
};
