import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Casino Lobby Game Store
 *
 * Minimal store for persisted user preferences.
 * URL params are the source of truth for navigation/filtering.
 * This store only manages favorites (persisted to localStorage).
 */

interface GameStoreState {
  // Favorites — persisted to localStorage
  favorites: string[];
}

interface GameStoreActions {
  toggleFavorite: (slug: string) => void;
  isFavorite: (slug: string) => boolean;
}

export type GameStore = GameStoreState & GameStoreActions;

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // Initial state
      favorites: [],

      // Actions
      toggleFavorite: (slug) =>
        set((state) => {
          const isFav = state.favorites.includes(slug);
          return {
            favorites: isFav
              ? state.favorites.filter((s) => s !== slug)
              : [...state.favorites, slug],
          };
        }),

      isFavorite: (slug) => {
        return get().favorites.includes(slug);
      },
    }),
    {
      name: "casino-lobby-favorites",
      partialize: (state) => ({
        favorites: state.favorites,
      }),
    },
  ),
);
