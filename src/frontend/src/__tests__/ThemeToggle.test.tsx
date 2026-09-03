import { renderApp } from "@/test/renderApp";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

describe("Theme toggle", () => {
  it("switches between dark and light and persists across navigation", async () => {
    const user = userEvent.setup();
    await renderApp();

    // Default theme is dark.
    expect(document.documentElement.classList.contains("dark")).toBe(true);

    // Toggle to light.
    const toggle = screen.getByTestId("theme_toggle");
    await user.click(toggle);
    expect(document.documentElement.classList.contains("light")).toBe(true);
    expect(document.documentElement.classList.contains("dark")).toBe(false);

    // Navigate to another page; the theme must persist.
    await user.click(screen.getByRole("link", { name: "Live Index" }));
    expect(
      await screen.findByRole("heading", {
        name: /Base-100 Airfare Price Index/i,
      }),
    ).toBeInTheDocument();
    expect(document.documentElement.classList.contains("light")).toBe(true);
    expect(document.documentElement.classList.contains("dark")).toBe(false);

    // Toggle back to dark.
    await user.click(screen.getByTestId("theme_toggle"));
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });
});
