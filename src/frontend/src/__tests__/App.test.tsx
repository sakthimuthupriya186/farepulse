import { renderApp } from "@/test/renderApp";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

const NAV_LINKS = [
  { label: "Home", heading: "India's Airfare Pulse," },
  { label: "Live Index", heading: "Base-100 Airfare Price Index" },
  { label: "Routes", heading: "City-Pair Fare Explorer" },
  { label: "Airlines", heading: "Carrier-Level Intelligence" },
  { label: "Analytics", heading: "Market Intelligence" },
  { label: "Methodology", heading: "How FAREPULSE Works" },
  { label: "Data Quality", heading: "Feed Health & Coverage" },
  { label: "API", heading: "Developer API" },
  { label: "About", heading: "About FAREPULSE" },
];

describe("App shell and navigation", () => {
  it("renders the home page without a blank screen", async () => {
    await renderApp();
    expect(
      screen.getByRole("heading", { name: /India's Airfare Pulse/i }),
    ).toBeInTheDocument();
  });

  it("renders the persistent footer with brand and hackathon details", async () => {
    await renderApp();
    const footer = screen.getByTestId("footer");
    expect(within(footer).getByText("FAREPULSE")).toBeInTheDocument();
    expect(
      within(footer).getByText("India's Airfare Pulse, in Real Time."),
    ).toBeInTheDocument();
    expect(
      within(footer).getByText("Smart India Hackathon 2026"),
    ).toBeInTheDocument();
    expect(
      within(footer).getByText("PS 26056 • Logic Loops"),
    ).toBeInTheDocument();
  });

  it("shows the demo-data disclaimer on the home page", async () => {
    await renderApp();
    expect(
      screen.getByText(
        "Demo Data – Replace with permissioned live fare feeds.",
      ),
    ).toBeInTheDocument();
  });

  it("navigates to every page via the top navigation links", async () => {
    const user = userEvent.setup();
    await renderApp();

    const navbar = screen.getByTestId("navbar");
    for (const { label, heading } of NAV_LINKS) {
      const link = within(navbar).getByRole("link", { name: label });
      await user.click(link);
      expect(
        await screen.findByRole("heading", { name: new RegExp(heading, "i") }),
      ).toBeInTheDocument();
    }
  });

  it("shows the demo-data disclaimer on data-driven pages", async () => {
    const user = userEvent.setup();
    await renderApp();

    const navbar = screen.getByTestId("navbar");
    const dataDriven = [
      "Live Index",
      "Routes",
      "Airlines",
      "Analytics",
      "Methodology",
      "Data Quality",
      "API",
    ];
    for (const label of dataDriven) {
      await user.click(within(navbar).getByRole("link", { name: label }));
      expect(
        await screen.findByText(
          "Demo Data – Replace with permissioned live fare feeds.",
        ),
      ).toBeInTheDocument();
    }
  });
});
