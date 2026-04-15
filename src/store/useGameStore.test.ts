import { renderHook, act } from "@testing-library/react";
import { useGameStore } from "./useGameStore";

describe("useGameStore", () => {
  beforeEach(() => {
    // Reset store state before each test
    const { result } = renderHook(() => useGameStore());
    act(() => {
      // Clear all favorites
      result.current.favorites.forEach((slug) => {
        result.current.toggleFavorite(slug);
      });
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

    it("can toggle multiple favorites independently", () => {
      const { result } = renderHook(() => useGameStore());

      act(() => {
        result.current.toggleFavorite("game-1");
        result.current.toggleFavorite("game-2");
        result.current.toggleFavorite("game-3");
      });

      expect(result.current.favorites).toHaveLength(3);
      expect(result.current.favorites).toEqual(
        expect.arrayContaining(["game-1", "game-2", "game-3"]),
      );

      // Remove one
      act(() => {
        result.current.toggleFavorite("game-2");
      });

      expect(result.current.favorites).toHaveLength(2);
      expect(result.current.favorites).toEqual(
        expect.arrayContaining(["game-1", "game-3"]),
      );
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

    it("returns false for empty string", () => {
      const { result } = renderHook(() => useGameStore());

      expect(result.current.isFavorite("")).toBe(false);
    });
  });

  describe("persistence", () => {
    it("persists favorites to localStorage", () => {
      const { result } = renderHook(() => useGameStore());

      act(() => {
        result.current.toggleFavorite("persisted-game");
      });

      // Create a new hook instance to simulate page reload
      const { result: newResult } = renderHook(() => useGameStore());

      expect(newResult.current.favorites).toContain("persisted-game");
    });
  });
});
