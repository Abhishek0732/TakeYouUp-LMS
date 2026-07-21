import api from "@/api/axios";

// Maps the backend resource DTOs onto the shape the public pages render
// (matching the old static data/resources.ts contract), so admin-managed
// categories appear live on the site.

const mapQuestion = (q: any) => ({
  question: q.questionText,
  // options come back unsorted — order by optionIndex so correctAnswer aligns
  options: [...(q.options || [])].sort((a, b) => a.optionIndex - b.optionIndex).map((o) => o.optionText),
  correctAnswer: q.correctAnswerIndex,
  explanation: q.explanation,
});

const mapTopic = (t: any) => ({
  slug: t.slug,
  title: t.title,
  summary: t.summary,
  difficulty: t.difficulty,
  duration: t.duration,
  questionCount: t.questionCount ?? (t.questions?.length || 0),
  concepts: t.concepts || [],
  questions: (t.questions || []).map(mapQuestion),
});

const mapCategory = (c: any) => ({
  slug: c.slug,
  title: c.title,
  shortTitle: c.shortTitle,
  description: c.description,
  heroText: c.heroText,
  accent: c.accent,
  topics: (c.topics || []).map(mapTopic),
});

export const getCategories = () =>
  api.get("/resources/categories").then((r) => (r.data || []).map(mapCategory));

export const getCategory = (slug: string) =>
  api.get(`/resources/categories/${slug}`).then((r) => mapCategory(r.data));

/**
 * Topic with its questions.
 *
 * The category endpoint is public and deliberately carries no question bodies
 * or answers, so the practice view fetches the topic directly — that endpoint
 * requires a signed-in user.
 */
export const getTopic = async (categorySlug: string, topicSlug: string) => {
  const [category, topic] = await Promise.all([
    getCategory(categorySlug),
    api
      .get(`/resources/categories/${categorySlug}/topics/${topicSlug}`)
      .then((r) => mapTopic(r.data)),
  ]);
  return { category, topic };
};
