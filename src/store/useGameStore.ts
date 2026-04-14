import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  ViewMode,
  GameVendor,
  GameCategory,
  SortField,
  SortOrder,
} from "@/types/game.types";

/**
 * Casino Lobby Game Store
 *
 * Manages global state for the casino lobby application including:
 * - View mode control (lobby/grid/search)
 * - Active category navigation
 * - Search query and debounced search state
 * - Filter selections (vendors, category, sorting)
 * - User favorites (persisted to localStorage)
 *
 * The favorites array is persisted to localStorage using Zustand's persist middleware.
 * All other state is ephemeral and resets on page reload.
 */

interface GameStoreState {
  // View control
  viewMode: ViewMode;
  activeCategory: string | null;

  // Search
  searchQuery: string;
  debouncedQuery: string;

  // Filters
  selectedVendors: GameVendor[];
  selectedCategory: GameCategory | null;
  sortField: SortField;
  sortOrder: SortOrder;

  // Favorites — persisted to localStorage
  favorites: string[];
}

interface GameStoreActions {
  setViewMode: (mode: ViewMode) => void;
  setActiveCategory: (category: string | null) => void;
  setSearchQuery: (query: string) => void;
  setDebouncedQuery: (query: string) => void;
  toggleVendor: (vendor: GameVendor) => void;
  setCategory: (category: GameCategory | null) => void;
  setSortField: (field: SortField) => void;
  setSortOrder: (order: SortOrder) => void;
  toggleFavorite: (slug: string) => void;
  isFavorite: (slug: string) => boolean;
  clearFilters: () => void;
  openGridView: (category?: GameCategory) => void;
}

export type GameStore = GameStoreState & GameStoreActions;

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // Initial state
      viewMode: "lobby",
      activeCategory: null,
      searchQuery: "",
      debouncedQuery: "",
      selectedVendors: [],
      selectedCategory: null,
      sortField: "featuredPriority",
      sortOrder: "desc",
      favorites: [],

      // Actions
      setViewMode: (mode) =>
        set(() => ({
          viewMode: mode,
        })),

      setActiveCategory: (category) =>
        set(() => ({
          activeCategory: category,
        })),

      setSearchQuery: (query) =>
        set(() => ({
          searchQuery: query,
        })),

      setDebouncedQuery: (query) =>
        set(() => ({
          debouncedQuery: query,
        })),

      toggleVendor: (vendor) =>
        set((state) => {
          const isSelected = state.selectedVendors.includes(vendor);
          return {
            selectedVendors: isSelected
              ? state.selectedVendors.filter((v) => v !== vendor)
              : [...state.selectedVendors, vendor],
          };
        }),

      setCategory: (category) =>
        set(() => ({
          selectedCategory: category,
        })),

      setSortField: (field) =>
        set(() => ({
          sortField: field,
        })),

      setSortOrder: (order) =>
        set(() => ({
          sortOrder: order,
        })),

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

      clearFilters: () =>
        set(() => ({
          selectedVendors: [],
          selectedCategory: null,
          sortField: "featuredPriority",
          sortOrder: "desc",
        })),

      openGridView: (category) =>
        set(() => ({
          viewMode: "grid",
          selectedCategory: category || null,
        })),
    }),
    {
      name: "casino-lobby-favorites",
      partialize: (state) => ({
        favorites: state.favorites,
      }),
    },
  ),
);
