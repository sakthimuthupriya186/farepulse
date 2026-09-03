import { AlertsPanel } from "@/components/AlertsPanel";
import { renderWithProviders } from "@/test/renderApp";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

describe("AlertsPanel", () => {
  it("opens the route analytics when an alert is clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(<AlertsPanel />);

    // The DEL → BOM route has changePct 1.5, so it produces a high-fare alert.
    const alert = screen.getByTestId("alert.high-del-bom");
    expect(alert).toBeInTheDocument();

    await user.click(alert);

    // The dialog opens with the route's analytics.
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("DEL → BOM")).toBeInTheDocument();
    expect(screen.getByText("Current Index")).toBeInTheDocument();
    expect(screen.getByText("Average Fare")).toBeInTheDocument();
    expect(screen.getByText("Recommended Booking Window")).toBeInTheDocument();
  });

  it("closes the analytics dialog via the Close button", async () => {
    const user = userEvent.setup();
    renderWithProviders(<AlertsPanel />);

    await user.click(screen.getByTestId("alert.high-del-bom"));
    expect(await screen.findByRole("dialog")).toBeInTheDocument();

    await user.click(screen.getByTestId("alert.close_button"));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
