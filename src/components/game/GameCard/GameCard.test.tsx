import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import GameCard from "./GameCard";
import { useGameStore } from "@/store/useGameStore";
import type { Game } from "@/types/game.types";

// Mock Next.js Image component
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    return <img {...props} />;
  },
}));

// Mock Framer Motion
jest.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      ...props
    }: {
      children: React.ReactNode;
      [key: string]: unknown;
    }) => <div {...props}>{children}</div>,
  },
}));

// Mock Zustand store
jest.mock("@/store/useGameStore");

const mockGame: Game = {
  enabled: true,
  name: "Test Game",
  slug: "test-game",
  vendor: "PragmaticPlay",
  description: "A test game",
  thumbnail: "https://example.com/thumbnail.jpg",
  thumbnailBlur: "data:image/jpeg;base64,test",
  borderColor: "#ff0000",
  categories: ["VIDEOSLOTS"],
  theoreticalPayOut: 96.5,
  restrictedTerritories: [],
  hasFunMode: true,
  featured: false,
  favorite: false,
};

describe("GameCard", () => {
  beforeEach(() => {
    (useGameStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector({ isFavorite: () => false }),
    );
  });

  it("renders game name", () => {
    const { getByText } = render(
      <GameCard game={mockGame} variant="compact" />,
    );

    expect(getByText("Test Game")).toBeInTheDocument();
  });

  describe("variant: full", () => {
    it("renders vendor name when variant is full", () => {
      const { getByText } = render(<GameCard game={mockGame} variant="full" />);

      expect(getByText("PragmaticPlay")).toBeInTheDocument();
    });

    it("shows RTP badge when theoreticalPayOut > 0", () => {
      const { getByText } = render(<GameCard game={mockGame} variant="full" />);

      expect(getByText(/RTP 96.5%/)).toBeInTheDocument();
    });

    it("does NOT show RTP badge when theoreticalPayOut is 0", () => {
      const gameWithoutRTP = { ...mockGame, theoreticalPayOut: 0 };
      const { queryByText } = render(
        <GameCard game={gameWithoutRTP} variant="full" />,
      );

      expect(queryByText(/RTP/)).not.toBeInTheDocument();
    });

    it("shows FUN badge when hasFunMode is true", () => {
      const { getByText } = render(<GameCard game={mockGame} variant="full" />);

      expect(getByText("FUN")).toBeInTheDocument();
    });

    it("does NOT show FUN badge when hasFunMode is false", () => {
      const gameWithoutFunMode = { ...mockGame, hasFunMode: false };
      const { queryByText } = render(
        <GameCard game={gameWithoutFunMode} variant="full" />,
      );

      expect(queryByText("FUN")).not.toBeInTheDocument();
    });
  });

  describe("variant: compact", () => {
    it("does NOT render vendor when variant is compact", () => {
      const { queryByText } = render(
        <GameCard game={mockGame} variant="compact" />,
      );

      expect(queryByText("PragmaticPlay")).not.toBeInTheDocument();
    });

    it("does NOT show RTP badge in compact variant", () => {
      const { queryByText } = render(
        <GameCard game={mockGame} variant="compact" />,
      );

      expect(queryByText(/RTP/)).not.toBeInTheDocument();
    });

    it("does NOT show FUN badge in compact variant", () => {
      const { queryByText } = render(
        <GameCard game={mockGame} variant="compact" />,
      );

      expect(queryByText("FUN")).not.toBeInTheDocument();
    });
  });

  describe("favorite functionality", () => {
    it("heart click calls onFavoriteToggle with correct slug", async () => {
      const onFavoriteToggle = jest.fn();
      const { getByRole } = render(
        <GameCard
          game={mockGame}
          variant="full"
          onFavoriteToggle={onFavoriteToggle}
        />,
      );

      // Find favorite button (heart icon button)
      const favoriteButton = getByRole("button", {
        name: /add to favorites/i,
      });
      await userEvent.click(favoriteButton);

      expect(onFavoriteToggle).toHaveBeenCalledWith("test-game");
      expect(onFavoriteToggle).toHaveBeenCalledTimes(1);
    });

    it("heart click does NOT bubble to parent card click", async () => {
      const onFavoriteToggle = jest.fn();
      const parentClickHandler = jest.fn();

      const { getByRole } = render(
        <div onClick={parentClickHandler}>
          <GameCard
            game={mockGame}
            variant="full"
            onFavoriteToggle={onFavoriteToggle}
          />
        </div>,
      );

      const favoriteButton = getByRole("button", {
        name: /add to favorites/i,
      });
      await userEvent.click(favoriteButton);

      expect(onFavoriteToggle).toHaveBeenCalledTimes(1);
      expect(parentClickHandler).not.toHaveBeenCalled();
    });

    it("shows filled heart when game is favorited", () => {
      (useGameStore as unknown as jest.Mock).mockImplementation((selector) =>
        selector({ isFavorite: () => true }),
      );

      const { getByRole } = render(<GameCard game={mockGame} variant="full" />);

      const favoriteButton = getByRole("button", {
        name: /remove from favorites/i,
      });
      expect(favoriteButton).toBeInTheDocument();
    });
  });
});
