import axios from "axios";
import api from "@/api/axios";

export const fetchQuestions = async ({
  page,
  size,
  topic,
  difficulty,
  search,
}: {
  page: number;
  size: number;
  topic?: string;
  difficulty?: string;
  search?: string;
}) => {
  const params: any = {
    page,
    size,
  };

  if (topic && topic !== "All") params.topic = topic;
  if (difficulty && difficulty !== "All") params.difficulty = difficulty;
  if (search) params.search = search;

  // const response = await axios.get(API_BASE, { params });
  const response = await api.get(`/questions`, { params });

  return response.data;
};

/** Topic names as managed in the admin panel, e.g. ["Arrays", "Matrix", …]. */
export const fetchTopics = async (): Promise<string[]> => {
  const { data } = await api.get("/topics");
  return (data || []).map((t: any) => t.name).filter(Boolean);
};

/** Difficulty levels from the catalogue, ordered Easy → Medium → Hard. */
export const fetchDifficulties = async (): Promise<string[]> => {
  const { data } = await api.get("/difficulties");
  const order = ["easy", "medium", "hard"];
  return (data || [])
    .map((d: any) => d.level)
    .filter(Boolean)
    .sort((a: string, b: string) => {
      const ia = order.indexOf(a.toLowerCase());
      const ib = order.indexOf(b.toLowerCase());
      // Unknown levels keep their natural order after the known ones.
      return (ia === -1 ? order.length : ia) - (ib === -1 ? order.length : ib);
    });
};

/**
 * Difficulty counts across the WHOLE filtered set (not just the visible page).
 * The difficulty filter is intentionally not passed so every card stays visible
 * while one difficulty is selected.
 */
export const fetchQuestionStats = async ({ topic, search }: { topic?: string; search?: string }) => {
  const params: any = {};
  if (topic && topic !== "All") params.topic = topic;
  if (search) params.search = search;
  const { data } = await api.get("/questions/stats", { params });
  return (data || {}) as Record<string, number>;
};

export interface QuestionProgress {
  total: number;
  solved: number;
  percent: number;
  byDifficulty: Record<string, { total: number; solved: number }>;
}

/** How many problems the signed-in user has marked solved, overall and per level. */
export const fetchQuestionProgress = async (): Promise<QuestionProgress> => {
  const { data } = await api.get("/questions/progress");
  return data;
};