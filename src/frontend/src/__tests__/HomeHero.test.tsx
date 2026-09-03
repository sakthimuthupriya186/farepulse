import { renderApp } from "@/test/renderApp";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

describe("HomeHero", () => {
  it("renders the headline, subtitle, and SIH badge", async () => {
    await renderApp();
    expect(
      screen.getByRole("heading", { name: /India's Airfare Pulse/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /FAREPULSE converts permissioned airline and OTA fare observations/i,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText("SIH 2026 · Problem Statement 26056"),
    ).toBeInTheDocument();
  });

  it("navigates to the Live Index page via the Explore Live Index button", async () => {
    const user = userEvent.setup();
    await renderApp();
    await user.click(screen.getByTestId("primary_button"));
    expect(
      await screen.findByRole("heading", {
        name: /Base-100 Airfare Price Index/i,
      }),
    ).toBeInTheDocument();
  });

  it("navigates to the Methodology page via the View Methodology button", async () => {
    const user = userEvent.setup();
    await renderApp();
    await user.click(screen.getByTestId("secondary_button"));
    expect(
      await screen.findByRole("heading", { name: /How FAREPULSE Works/i }),
    ).toBeInTheDocument();
  });
});
