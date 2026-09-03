import { IndexChart } from "@/components/IndexChart";
import { indexSeries } from "@/lib/mockData";
import { renderWithProviders } from "@/test/renderApp";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

describe("IndexChart time-range filters", () => {
  it("responds to 24H / 7D / 30D / 3M / 1Y filter selection", async () => {
    const user = userEvent.setup();
    renderWithProviders(<IndexChart />);

    const ranges = ["24H", "7D", "30D", "3M", "1Y"] as const;
    for (const range of ranges) {
      const button = screen.getByTestId(`chart.range.${range}`);
      await user.click(button);
      expect(button).toHaveAttribute("aria-pressed", "true");

      const series = indexSeries[range];
      expect(
        screen.getByText(
          new RegExp(`${series.points.length} samples · ${range} range`, "i"),
        ),
      ).toBeInTheDocument();
    }
  });
});
