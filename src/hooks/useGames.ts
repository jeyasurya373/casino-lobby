import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchGames } from "@/services/gamesApi";
import { toApiCategory } from "@/utils/categoryMapper";
import type { Game, GameCategory } from "@/types/game.types";

interface UseGamesOptions {
  category?: GameCategory;
}

/**
 * Infinite scroll query for the full grid view.
 * Fetches pages of 20 games, accumulates on scroll.
 * Accepts category as parameter instead of reading from store.
 *
 * @param options - Query options including category filter
 * @returns Infinite query result with flattened games array and pagination controls
 */
export function useGames(options: UseGamesOptions = {}) {
  const { category } = options;
  const apiCategory = toApiCategory(category);

  const query = useInfiniteQuery({
    queryKey: ["games", category],
    queryFn: ({ pageParam = 0 }) =>
      fetchGames({
        category: apiCategory,
        sort: "featuredPriority",
        order: "desc",
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
