import { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/api/axios";

const CourseContext = createContext();

// The catalogue for the cards — title, slug, level, etc., no lesson bodies.
const fetchCoursesBasic = async () => {
  const { data } = await api.get("/courses/basic");
  return Array.isArray(data) ? data : [];
};

/**
 * Provides the course catalogue to the Home and Courses pages.
 *
 * The fetch goes through React Query, whose client lives at the app root, so
 * the result is cached in ONE place that outlives this provider. That matters
 * because the provider is mounted inside the `/` and `/courses` route elements
 * — it unmounts every time you navigate away. Holding the data in component
 * state (as this once did) meant every return trip re-fetched from scratch;
 * with the shared query cache, coming back shows the courses instantly and only
 * revalidates quietly in the background once the data goes stale.
 */
export const CourseProvider = ({ children }) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["courses", "basic"],
    queryFn: fetchCoursesBasic,
    staleTime: 5 * 60 * 1000,   // treat the list as fresh for 5 minutes
  });

  return (
    <CourseContext.Provider
      value={{
        courses: data ?? [],
        loading: isLoading,
        error: error ? (error.message || "Failed to load courses") : null,
        refetch,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};

export const useCourses = () => useContext(CourseContext);
