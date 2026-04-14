import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchGames } from "@/services/gamesApi";
import { useGameStore } from "@/store/useGameStore";
import type { Game } from "@/types/game.types";

/**
 * Infinite scroll query for the full grid view.
 * Fetches pages of 20 games, accumulates on scroll.
 *
 * Reads filter state from the game store and constructs
 * the appropriate query parameters.
 *
 * @returns Infinite query result with flattened games array and pagination controls
 */
export function useGames() {
  const selectedCategory = useGameStore((state) => state.selectedCategory);
  const selectedVendors = useGameStore((state) => state.selectedVendors);
  const sortField = useGameStore((state) => state.sortField);
  const sortOrder = useGameStore((state) => state.sortOrder);

  const query = useInfiniteQuery({
    queryKey: [
      "games",
      selectedCategory,
      selectedVendors,
      sortField,
      sortOrder,
    ],
    queryFn: ({ pageParam = 0 }) =>
      fetchGames({
        category: selectedCategory ?? undefined,
        vendor: selectedVendors.length > 0 ? selectedVendors : undefined,
        sort: sortField,
        order: sortOrder,
        limit: 20,
        offset: pageParam,
      }),
    getNextPageParam: (lastPage, pages) => {
      const currentOffset = (pages.length - 1) * 20;
      const hasMore = currentOffset + lastPage.count < lastPage.total;
      return hasMore ? currentOffset + lastPage.count : undefined;
    },
    initialPageParam: 0,
  });

  // Flatten all pages into a single games array
  const games: Game[] = query.data?.pages.flatMap((page) => page.items) ?? [];

  return {
    games,
    fetchNextPage: query.fetchNextPage,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
