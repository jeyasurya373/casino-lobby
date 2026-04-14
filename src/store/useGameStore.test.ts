import { renderHook, act } from "@testing-library/react";
import { useGameStore } from "./useGameStore";

describe("useGameStore", () => {
  beforeEach(() => {
    // Reset store state before each test
    const { result } = renderHook(() => useGameStore());
    act(() => {
      result.current.clearFilters();
      // Clear favorites
      result.current.favorites.forEach((slug) => {
        result.current.toggleFavorite(slug);
      });
      // Reset view mode
      result.current.setViewMode("lobby");
    });
  });

  describe("toggleFavorite", () => {
    it("adds a slug to favorites array", () => {
      const { result } = renderHook(() => useGameStore());

      act(() => {
        result.current.toggleFavorite("test-game-slug");
      });

      expect(result.current.favorites).toContain("test-game-slug");
      expect(result.current.isFavorite("test-game-slug")).toBe(true);
    });

    it("removes a slug if already in favorites (toggle behavior)", () => {
      const { result } = renderHook(() => useGameStore());

      // Add favorite
      act(() => {
        result.current.toggleFavorite("test-game-slug");
      });

      expect(result.current.favorites).toContain("test-game-slug");

      // Remove favorite
      act(() => {
        result.current.toggleFavorite("test-game-slug");
      });

      expect(result.current.favorites).not.toContain("test-game-slug");
      expect(result.current.isFavorite("test-game-slug")).toBe(false);
    });
  });

  describe("isFavorite", () => {
    it("returns true for slugs in favorites, false otherwise", () => {
      const { result } = renderHook(() => useGameStore());

      act(() => {
        result.current.toggleFavorite("favorite-game");
      });

      expect(result.current.isFavorite("favorite-game")).toBe(true);
      expect(result.current.isFavorite("non-favorite-game")).toBe(false);
    });
  });

  describe("clearFilters", () => {
    it("resets selectedVendors to [] and selectedCategory to null", () => {
      const { result } = renderHook(() => useGameStore());

      // Set some filters
      act(() => {
        result.current.toggleVendor("PragmaticPlay");
        result.current.toggleVendor("EvolutionGaming");
        result.current.setCategory("VIDEOSLOTS");
        result.current.setSortField("name");
        result.current.setSortOrder("asc");
      });

      expect(result.current.selectedVendors).toHaveLength(2);
      expect(result.current.selectedCategory).toBe("VIDEOSLOTS");

      // Clear filters
      act(() => {
        result.current.clearFilters();
      });

      expect(result.current.selectedVendors).toEqual([]);
      expect(result.current.selectedCategory).toBeNull();
      expect(result.current.sortField).toBe("featuredPriority");
      expect(result.current.sortOrder).toBe("desc");
    });
  });

  describe("openGridView", () => {
    it("sets viewMode to grid and optionally sets selectedCategory", () => {
      const { result } = renderHook(() => useGameStore());

      act(() => {
        result.current.openGridView("BLACKJACK");
      });

      expect(result.current.viewMode).toBe("grid");
      expect(result.current.selectedCategory).toBe("BLACKJACK");
    });

    it("sets viewMode to grid without setting category if not provided", () => {
      const { result } = renderHook(() => useGameStore());

      // Set a category first
      act(() => {
        result.current.setCategory("VIDEOSLOTS");
      });

      act(() => {
        result.current.openGridView();
      });

      expect(result.current.viewMode).toBe("grid");
      expect(result.current.selectedCategory).toBeNull();
    });
  });
});
