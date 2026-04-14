import { useQuery } from "@tanstack/react-query";
import { fetchGames } from "@/services/gamesApi";
import type { GameCategory } from "@/types/game.types";

/**
 * Fetches a fixed number of games for a single lobby row.
 * Used in lobby view — one instance per category section.
 * Independent queries so one failure doesn't break other rows.
 *
 * @param category - The game category to fetch games for
 * @returns Query result with games array and status flags
 */
export function useGameRow(category: GameCategory) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["gameRow", category],
    queryFn: () => fetchGames({ category, limit: 10, offset: 0 }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    games: data?.items ?? [],
    isLoading,
    isError,
    error,
  };
}
