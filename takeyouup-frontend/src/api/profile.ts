import api from "@/api/axios";

export interface CourseProgress {
  id: number;
  slug: string;
  title: string;
  image: string | null;
  level: string | null;
  totalLessons: number;
  completedLessons: number;
  percent: number;
  nextLessonSlug: string | null;
  nextLessonTitle: string | null;
}

export interface ProfileStats {
  lessonsCompleted: number;
  coursesInProgress: number;
  coursesCompleted: number;
  problemsSolved: number;
  problemsTotal: number;
  quizzesTaken: number;
  averageQuizScore: number;
  certificates: number;
}

export interface Me {
  id: number;
  name: string;
  email: string;
  role: string;
  emailVerified: boolean;
  joinedAt: string | null;
  stats: ProfileStats;
  courses: CourseProgress[];
}

export interface Certificate {
  serialNo: string;
  userName: string;
  courseId: number;
  courseTitle: string;
  issuedAt: string;
}

export interface QuizAttempt {
  id: number;
  quizId: number;
  quizTitle: string;
  score: number;
  total: number;
  percent: number;
  createdAt: string;
}

/** Identity, headline stats and per-course progress in one request. */
export const fetchMe = async (): Promise<Me> => {
  const { data } = await api.get("/users/me");
  return data;
};

export const fetchMyCertificates = async (): Promise<Certificate[]> => {
  const { data } = await api.get("/certificates/mine");
  return data || [];
};

export const fetchMyQuizAttempts = async (): Promise<QuizAttempt[]> => {
  const { data } = await api.get("/quizzes/attempts/mine");
  return data || [];
};

export const updateMyName = async (name: string) => {
  const { data } = await api.put("/users/update-name", { name });
  return data;
};

export const changeMyPassword = async (currentPassword: string, newPassword: string) => {
  const { data } = await api.put("/users/me/password", { currentPassword, newPassword });
  return data;
};
