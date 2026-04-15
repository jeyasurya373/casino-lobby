import axios, { AxiosInstance } from "axios";
import type {
  Game,
  GamesApiParams,
  GamesApiResponse,
  GameSearchApiResponse,
} from "@/types/game.types";

/**
 * Custom API error class with status code
 */
export class ApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
  }
}

/**
 * Axios instance configured for the casino games API
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: "https://jpapi-staging.jackpot.bet",
  timeout: 10000,
});

/**
 * Response interceptor for error logging in development
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (process.env.NODE_ENV === "development") {
      console.error("API Error:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url,
      });
    }
    return Promise.reject(error);
  },
);

/**
 * Fetches a paginated list of casino games with optional filters and sorting
 *
 * @param params - Query parameters for filtering, sorting, and pagination
 * @param params.limit - Maximum number of games to return
 * @param params.offset - Number of games to skip for pagination
 * @param params.sort - Field to sort by
 * @param params.order - Sort order (ascending or descending)
 * @param params.category - Filter by game category
 * @param params.vendor - Filter by game vendor(s) - supports multiple vendors
 * @param params.excludeCategory - Category to exclude from results
 * @returns Promise resolving to games data with pagination info
 * @throws {ApiError} When the API request fails or returns success: false
 */
export async function fetchGames(params: GamesApiParams): Promise<{
  items: Game[];
  total: number;
  count: number;
}> {
  try {
    // Build query parameters, handling vendor array specially
    const queryParams = new URLSearchParams();

    if (params.limit !== undefined) {
      queryParams.append("limit", params.limit.toString());
    }
    if (params.offset !== undefined) {
      queryParams.append("offset", params.offset.toString());
    }
    if (params.sort) {
      queryParams.append("sort", params.sort);
    }
    if (params.order) {
      queryParams.append("order", params.order);
    }
    if (params.category) {
      queryParams.append("category", params.category);
    }
    if (params.excludeCategory) {
      queryParams.append("excludeCategory", params.excludeCategory);
    }

    // Serialize vendor array as repeated params: vendor=X&vendor=Y
    if (params.vendor && params.vendor.length > 0) {
      params.vendor.forEach((v) => {
        queryParams.append("vendor", v);
      });
    }

    const response = await apiClient.get<GamesApiResponse>(
      `/casino/games?${queryParams.toString()}`,
    );

    if (!response.data.success) {
      throw new ApiError("API request failed", response.status);
    }

    return {
      items: response.data.data.items ?? [],
      total: response.data.data.total,
      count: response.data.data.count,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    if (axios.isAxiosError(error)) {
      throw new ApiError(
        error.response?.data?.message || error.message,
        error.response?.status || 500,
      );
    }
    throw new ApiError("Unknown error occurred", 500);
  }
}

/**
 * Searches for games by name using a text query
 *
 * @param query - Search term to find games by name
 * @returns Promise resolving to array of matching games
 * @throws {ApiError} When query is empty or API request fails
 */
export async function fetchGameSearch(query: string): Promise<Game[]> {
  if (!query || query.trim().length === 0) {
    throw new ApiError("Search query cannot be empty", 400);
  }

  try {
    const response = await apiClient.get<GameSearchApiResponse>(
      `/casino/games/search`,
      {
        params: { query },
      },
    );

    if (!response.data.success) {
      throw new ApiError("Search request failed", response.status);
    }

    return response.data.data.items ?? [];
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    if (axios.isAxiosError(error)) {
      throw new ApiError(
        error.response?.data?.message || error.message,
        error.response?.status || 500,
      );
    }
    throw new ApiError("Unknown error occurred", 500);
  }
}
