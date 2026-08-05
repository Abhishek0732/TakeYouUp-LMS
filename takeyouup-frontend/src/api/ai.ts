import api from "./axios";

/**
 * AI study help for a practice problem, answered by Gemini on the backend.
 *
 * A problem has no stored statement — the server works from its title, topic
 * and difficulty — so these take only the problem id. `hint` returns concepts
 * and progressive hints (no full solution); `solution` returns the complete
 * worked answer with code. Both return Markdown, rendered with <RichContent />.
 *
 * Signed-in only (see SecurityConfig): the shared axios instance attaches the
 * bearer token, and a 401 triggers its silent refresh-and-retry.
 */
async function ask(kind: "hint" | "solution", questionId: number): Promise<string> {
  const { data } = await api.post<{ content: string }>(`/ai/${kind}/${questionId}`);
  return data.content ?? "";
}

export const fetchHint = (questionId: number) => ask("hint", questionId);
export const fetchSolution = (questionId: number) => ask("solution", questionId);
