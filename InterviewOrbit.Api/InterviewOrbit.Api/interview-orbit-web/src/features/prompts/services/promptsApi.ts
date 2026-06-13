import apiClient from "../../../services/apiClient";

export interface PromptDto {
    id: number;
    category: string;
    role: string;
    title: string;
    question: string;
    targetKeywords?: string[];
    suggestedTargetSeconds?: number;
}

function normalizePrompt(item: any): PromptDto | null {
    const id = item?.id;
    const category = item?.category ?? "Unknown";
    const role = item?.role ?? "Unknown";
    const title = item?.title ?? "Untitled Prompt";
    const question =
        item?.question ??
        item?.questionText ??
        item?.text ??
        item?.promptText ??
        item?.content ??
        title;

    const targetKeywords = Array.isArray(item?.targetKeywords)
        ? item.targetKeywords
        : [];

    const suggestedTargetSeconds =
        typeof item?.suggestedTargetSeconds === "number"
            ? item.suggestedTargetSeconds
            : undefined;

    if (id == null || !question) {
        return null;
    }

    return {
        id: Number(id),
        category: String(category),
        role: String(role),
        title: String(title),
        question: String(question),
        targetKeywords,
        suggestedTargetSeconds,
    };
}

export async function getPrompts(): Promise<PromptDto[]> {
    const response = await apiClient.get("/api/prompts");

    let rawItems: any[] = [];

    if (Array.isArray(response.data)) {
        rawItems = response.data;
    } else if (Array.isArray(response.data?.prompts)) {
        rawItems = response.data.prompts;
    } else if (Array.isArray(response.data?.data)) {
        rawItems = response.data.data;
    } else {
        return [];
    }

    return rawItems
        .map(normalizePrompt)
        .filter((item): item is PromptDto => item !== null);
}