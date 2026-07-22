import { useParams } from "react-router-dom";
import { lazy, Suspense } from "react";
import { useAuth } from "@/context/AuthContext";
import { DetailSkeleton } from "@/components/Skeletons";

const CourseOverview = lazy(() => import("@/pages/CourseOverview"));
const CourseDetail = lazy(() => import("@/pages/CourseDetail"));

/**
 * What `/:courseSlug` renders.
 *
 * Signed in  -> the full course view, exactly as before.
 * Signed out -> the public syllabus, instead of a redirect to /login.
 *
 * The route used to be wrapped in ProtectedRoute, which meant every course URL
 * answered a signed-out visitor — and every search engine — with the sign-in
 * page. That made the site's actual content unfindable and, because the same
 * rule caught unknown slugs too, turned every mistyped URL into another copy of
 * the login screen rather than a 404.
 *
 * Lessons (`/:courseSlug/:lessonSlug`) stay behind ProtectedRoute: the syllabus
 * is public, the material is not.
 */
const CourseEntry = () => {
  const { courseSlug } = useParams();
  const { user, ready } = useAuth();

  const fallback = (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <DetailSkeleton />
    </div>
  );

  // Wait for the session to be restored before choosing — `user` is briefly
  // null while a stale access token is refreshed, and deciding early would
  // flash the signed-out page at someone who is actually logged in.
  if (!ready) return fallback;

  return (
    <Suspense fallback={fallback}>
      {user ? <CourseDetail /> : <CourseOverview slug={courseSlug ?? ""} />}
    </Suspense>
  );
};

export default CourseEntry;
