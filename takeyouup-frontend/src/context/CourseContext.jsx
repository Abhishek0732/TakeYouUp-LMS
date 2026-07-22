import { createContext, useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";

const CourseContext = createContext();

// `|| ""` matters: when VITE_API_URL is unset this was building the string
// "undefined/api/courses/basic" and every catalogue fetch 404'd. Empty means
// relative paths, which nginx proxies to the backend on whatever host we're
// served from — the same convention as src/api/axios.ts.
const API = import.meta.env.VITE_API_URL || "";

export const CourseProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Exposed so the catalogue pages can offer a retry button instead of making
  // a failed load a dead end that only a page reload escapes.
  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API}/api/courses/basic`);
      setCourses(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError(err.message || "Failed to load courses");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return (
    <CourseContext.Provider value={{ courses, loading, error, refetch: fetchCourses }}>
      {children}
    </CourseContext.Provider>
  );
};

export const useCourses = () => useContext(CourseContext);
