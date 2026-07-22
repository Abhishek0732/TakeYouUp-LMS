import api from "./axios";

/**
 * Real, published-content counts for the marketing pages.
 *
 * These replace the hardcoded "5,000+ students" style figures that used to sit
 * on Home and About. Those were invented, contradicted each other across pages,
 * and were the fastest way to lose a visitor's trust. Everything here is a live
 * count of content that actually exists, so it can never drift from reality and
 * it grows on its own as content is added.
 */
export type PlatformStats = {
  courses: number;
  lessons: number;
  practiceProblems: number;
  quizQuestions: number;
  resourceCategories: number;
  resourceTopics: number;
};

export async function fetchStats(): Promise<PlatformStats> {
  const { data } = await api.get<PlatformStats>("/stats");
  return data;
}
