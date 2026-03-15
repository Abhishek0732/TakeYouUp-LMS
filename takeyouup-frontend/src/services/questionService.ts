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