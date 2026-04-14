/**
 * Valid game category types
 */
export type GameCategory =
  | "VIDEOSLOTS"
  | "BLACKJACK"
  | "BACCARAT"
  | "GAMESHOWSLIVEDEALER"
  | "ORIGINAL"
  | "TABLEGAMES"
  | "LIVEDEALER";

/**
 * Supported game vendors
 */
export type GameVendor =
  | "PragmaticPlay"
  | "EvolutionGaming"
  | "JackpotOriginal"
  | "Play'nGo"
  | "RelaxGaming"
  | "BGaming";

/**
 * Fields available for sorting games
 */
export type SortField =
  | "name"
  | "theoreticalPayOut"
  | "popularity"
  | "createdAt"
  | "featuredPriority";

/**
 * Sort order direction
 */
export type SortOrder = "asc" | "desc";

/**
 * Display mode for game views
 */
export type ViewMode = "lobby" | "grid" | "search";

/**
 * Represents a casino game from the API
 */
export interface Game {
  enabled: boolean;
  name: string;
  slug: string;
  vendor: string;
  description: string;
  thumbnail: string;
  thumbnailBlur: string;
  borderColor: string;
  categories: string[];
  theoreticalPayOut: number;
  restrictedTerritories: string[];
  hasFunMode: boolean;
  featured: boolean;
  favorite: boolean;
}

/**
 * API response wrapper for games list endpoint
 */
export interface GamesApiResponse {
  success: boolean;
  data: {
    count: number;
    total: number;
    items: Game[];
  };
}

/**
 * API response wrapper for game search endpoint
 */
export interface GameSearchApiResponse {
  success: boolean;
  data: {
    items: Game[];
  };
}

/**
 * Parameters for fetching games from the API
 */
export interface GamesApiParams {
  limit?: number;
  offset?: number;
  sort?: SortField;
  order?: SortOrder;
  category?: GameCategory;
  vendor?: GameVendor[];
  excludeCategory?: string;
}
