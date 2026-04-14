import { render } from "@testing-library/react";
import GameCardSkeleton from "./GameCardSkeleton";

describe("GameCardSkeleton", () => {
  it("renders correct number of skeletons based on count prop", () => {
    const { getAllByLabelText } = render(
      <GameCardSkeleton variant="compact" count={5} />,
    );

    // Each skeleton has an aria-label="Loading game card"
    const skeletons = getAllByLabelText("Loading game card");
    expect(skeletons).toHaveLength(5);
  });

  it("renders 10 skeletons by default", () => {
    const { getAllByLabelText } = render(<GameCardSkeleton variant="full" />);

    const skeletons = getAllByLabelText("Loading game card");
    expect(skeletons).toHaveLength(10);
  });

  it("renders compact variant correctly", () => {
    const { getAllByLabelText } = render(
      <GameCardSkeleton variant="compact" count={3} />,
    );

    const skeletons = getAllByLabelText("Loading game card");
    expect(skeletons).toHaveLength(3);
  });

  it("renders full variant correctly", () => {
    const { getAllByLabelText } = render(
      <GameCardSkeleton variant="full" count={2} />,
    );

    const skeletons = getAllByLabelText("Loading game card");
    expect(skeletons).toHaveLength(2);
  });
});
