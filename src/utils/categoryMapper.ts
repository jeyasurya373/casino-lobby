import type { GameCategory } from "@/types/game.types";

/**
 * Maps UI category names (lowercase, hyphenated) to API category names (uppercase, underscored)
 * Production uses lowercase in URLs, but API expects uppercase
 */
const CATEGORY_MAP: Record<string, string> = {
  slots: "VIDEOSLOTS",
  blackjack: "BLACKJACK",
  baccarat: "BACCARAT",
  "live-casino": "GAMESHOWSLIVEDEALER",
  original: "ORIGINAL",
  table: "TABLEGAMES",
  "live-dealer": "LIVEDEALER",
  new: "NEW",
  popular: "POPULAR",
};

/**
 * Converts a UI category to its API equivalent
 * @param uiCategory - Lowercase category from URL/UI
 * @returns Uppercase API category string, or undefined if not mapped
 */
export function toApiCategory(
  uiCategory: GameCategory | string | undefined,
): string | undefined {
  if (!uiCategory) return undefined;
  return CATEGORY_MAP[uiCategory.toLowerCase()];
}

/**
 * Converts an API category to its UI equivalent
 * @param apiCategory - Uppercase category from API
 * @returns Lowercase UI category string, or undefined if not mapped
 */
export function toUiCategory(
  apiCategory: string | undefined,
): GameCategory | undefined {
  if (!apiCategory) return undefined;
  const entry = Object.entries(CATEGORY_MAP).find(
    ([_, api]) => api === apiCategory.toUpperCase(),
  );
  return entry?.[0] as GameCategory | undefined;
}
