import { useQuery } from "@tanstack/react-query";
import { fetchGameSearch } from "@/services/gamesApi";

/**
 * Searches games by text query using the search endpoint.
 * Accepts query as parameter (already debounced by caller).
 * Only fires when query has 2+ characters.
 *
 * @param query - Search query string (debounced)
 * @returns Query result with search results and status flags
 */
export function useGameSearch(query: string) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["gameSearch", query],
    queryFn: () => fetchGameSearch(query),
    enabled: query.length >= 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const results = data ?? [];
  const isEmpty = query.length >= 2 && results.length === 0;

  return {
    results,
    isLoading,
    isError,
    isEmpty,
  };
}
