import { RouteExplorer } from "@/components/RouteExplorer";
import { routeFares } from "@/lib/mockData";
import { renderWithProviders } from "@/test/renderApp";
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const delBom = routeFares.find((r) => r.id === "del-bom")!;

/**
 * Radix Select opens on pointerdown and selects an option on click. userEvent's
 * click sequence hangs on the Radix Select trigger in jsdom, so drive the
 * select with fireEvent instead — the same events Radix listens for.
 *
 * The Radix Select module is mocked in src/test/setup.ts with a lightweight
 * controlled implementation, so these interactions run instantly and leave no
 * pending animation timers.
 */
function selectOption(testId: string, optionName: string) {
  const trigger = screen.getByTestId(testId);
  fireEvent.pointerDown(trigger);
  fireEvent.click(trigger);
  fireEvent.click(screen.getByRole("option", { name: optionName }));
}

describe("RouteExplorer", () => {
  it("returns a populated analysis for a selected route", () => {
    renderWithProviders(
      <RouteExplorer route={delBom} onSelectRoute={() => {}} />,
    );

    expect(screen.getByTestId("route_explorer.results")).toBeInTheDocument();
    expect(screen.getByText("DEL → BOM")).toBeInTheDocument();
    expect(screen.getByText("Current Index")).toBeInTheDocument();
    expect(screen.getByText("Average Fare")).toBeInTheDocument();
    expect(screen.getByText("Lowest Fare")).toBeInTheDocument();
    expect(screen.getByText("Highest Fare")).toBeInTheDocument();
    expect(screen.getByText("Volatility")).toBeInTheDocument();
    expect(screen.getByText("Recommended Booking Window")).toBeInTheDocument();
  });

  it("shows an empty state before a route is selected", () => {
    renderWithProviders(
      <RouteExplorer route={null} onSelectRoute={() => {}} />,
    );
    expect(
      screen.getByTestId("route_explorer.empty_state"),
    ).toBeInTheDocument();
    expect(screen.getByText("No analysis loaded")).toBeInTheDocument();
  });

  it("analyzes a fare for a city pair chosen in the form", () => {
    const onSelectRoute = vi.fn();
    renderWithProviders(
      <RouteExplorer route={null} onSelectRoute={onSelectRoute} />,
    );

    // Choose From = DEL.
    selectOption("route_explorer.from", "DEL");

    // Choose To = BOM.
    selectOption("route_explorer.to", "BOM");

    fireEvent.click(screen.getByTestId("route_explorer.analyze_button"));

    expect(onSelectRoute).toHaveBeenCalledWith(delBom);
  });

  it("reports an error for a city pair with no fare data", () => {
    const onSelectRoute = vi.fn();
    renderWithProviders(
      <RouteExplorer route={null} onSelectRoute={onSelectRoute} />,
    );

    selectOption("route_explorer.from", "DEL");
    selectOption("route_explorer.to", "BLR");

    fireEvent.click(screen.getByTestId("route_explorer.analyze_button"));

    expect(
      screen.getByText("No fare data available for that city pair yet."),
    ).toBeInTheDocument();
    expect(onSelectRoute).not.toHaveBeenCalled();
  });
});
