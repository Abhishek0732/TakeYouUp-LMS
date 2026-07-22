import api from "./axios";

/**
 * The public shape of a course — syllabus without lesson bodies.
 *
 * Mirrors CourseOverviewDTO on the backend. Lesson `content` and key points are
 * not part of this type because the endpoint cannot return them; reading a
 * lesson still goes through the authenticated `/courses/slug/{slug}` route.
 */
export type LessonOutline = {
  title: string;
  slug: string | null;
  duration: string | null;
};

export type ModuleOutline = {
  title: string;
  lessons: LessonOutline[];
};

export type CourseOverview = {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  category: string | null;
  level: string | null;
  duration: string | null;
  image: string | null;
  instructor: string | null;
  price: string | null;
  moduleCount: number;
  lessonCount: number;
  modules: ModuleOutline[];
};

/** Thrown when the slug matches no course, so callers can render a real 404. */
export class CourseNotFound extends Error {}

export async function fetchCourseOverview(slug: string): Promise<CourseOverview> {
  try {
    const { data } = await api.get<CourseOverview>(`/courses/overview/${slug}`);
    return data;
  } catch (e: any) {
    if (e?.response?.status === 404) throw new CourseNotFound(slug);
    throw e;
  }
}
