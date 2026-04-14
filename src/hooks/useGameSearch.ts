import { useQuery } from "@tanstack/react-query";
import { fetchGameSearch } from "@/services/gamesApi";
import { useGameStore } from "@/store/useGameStore";

/**
 * Searches games by text query using the search endpoint.
 * Debounce is handled externally via store's debouncedQuery.
 * Only fires when debouncedQuery has 2+ characters.
 *
 * @returns Query result with search results and status flags
 */
export function useGameSearch() {
  const debouncedQuery = useGameStore((state) => state.debouncedQuery);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["gameSearch", debouncedQuery],
    queryFn: () => fetchGameSearch(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const results = data ?? [];
  const isEmpty = debouncedQuery.length >= 2 && results.length === 0;

  return {
    results,
    isLoading,
    isError,
    isEmpty,
  };
}
