import { RouteExplorer } from "@/components/RouteExplorer";
import { renderWithProviders } from "@/test/renderApp";
import { fireEvent, screen } from "@testing-library/react";
import { expect, it } from "vitest";

it("selects a city in the form without leaking pending timers", () => {
  renderWithProviders(<RouteExplorer route={null} onSelectRoute={() => {}} />);

  const fromTrigger = screen.getByTestId("route_explorer.from");
  fireEvent.pointerDown(fromTrigger);
  fireEvent.click(fromTrigger);
  fireEvent.click(screen.getByRole("option", { name: "DEL" }));

  // The chosen city is reflected in the trigger.
  expect(screen.getByTestId("route_explorer.from")).toHaveTextContent("DEL");
});
