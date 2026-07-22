import { useQuery } from "@tanstack/react-query";
import { fetchRunnableLanguages } from "@/api/execute";

/**
 * The languages a Run button may appear for.
 *
 * Asked of the server rather than hardcoded, so the button cannot drift from
 * what the runner actually supports: authors can tag a snippet with any of
 * twenty languages, but only a few can execute. One shared query key means a
 * lesson with a dozen snippets still makes one request, and the answer is
 * cached for the session because it changes only on a backend release.
 *
 * On failure the set is empty, so no Run buttons appear at all — the right way
 * to fail, since a button that cannot work is worse than none.
 */
export function useRunnableLanguages(): Set<string> {
  const { data } = useQuery({
    queryKey: ["runnableLanguages"],
    queryFn: fetchRunnableLanguages,
    staleTime: Infinity,
    retry: 1,
  });
  return new Set(data ?? []);
}

export default useRunnableLanguages;
