import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { fetchMe, type CourseProgress } from "@/api/profile";

/**
 * Where a signed-in learner should be sent to carry on.
 *
 * Shared by the hero call-to-action and the floating resume card so both agree
 * on the destination and only one request is made — react-query dedupes the
 * "me" key that the profile page already uses.
 */
export function useResume() {
  const { user, ready } = useAuth();

  const { data: me, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: fetchMe,
    enabled: ready && !!user,
    staleTime: 60_000,
  });

  const course: CourseProgress | undefined =
    me?.courses?.find((c) => c.percent < 100) ?? me?.courses?.[0];

  const target = course
    ? course.nextLessonSlug
      ? `/${course.slug}/${course.nextLessonSlug}`
      : `/${course.slug}`
    : "/courses";

  return {
    signedIn: ready && !!user,
    loading: isLoading,
    me,
    course,
    target,
    /** True when there is genuinely something to resume. */
    hasProgress: !!course,
  };
}
