import api from "./axios";

/**
 * Running a snippet.
 *
 * Goes through our own backend rather than calling Judge0 from the browser.
 * That keeps the credential server-side, lets the volume be throttled, and —
 * the reason it matters most here — lets identical runs be cached. A lesson
 * snippet is the same code for every learner, so the thousandth person to press
 * Run on the Hello World block costs nothing upstream.
 */
export type ExecuteResult = {
  /** Program output, or the compiler / runtime error if it got that far. */
  output: string;
  /** Short label, e.g. "Accepted", "Compilation Error". */
  status: string;
  /** True only when the program ran to completion. */
  ok: boolean;
  timeMs: number | null;
  cached: boolean;
};

export async function runCode(
  language: string,
  code: string,
  stdin = "",
): Promise<ExecuteResult> {
  const { data } = await api.post<ExecuteResult>("/execute", { language, code, stdin });
  return data;
}

/**
 * Which languages carry a Run button.
 *
 * Fetched rather than hardcoded so the button cannot drift from what the runner
 * actually supports: a snippet tagged with an unsupported language gets no
 * button, instead of one that always fails.
 */
export async function fetchRunnableLanguages(): Promise<string[]> {
  const { data } = await api.get<string[]>("/execute/languages");
  return data;
}
