import { renderApp } from "@/test/renderApp";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

describe("Mobile sidebar drawer", () => {
  it("opens, navigates via a link, and closes", async () => {
    const user = userEvent.setup();
    await renderApp();

    // Open the drawer via the hamburger button.
    await user.click(screen.getByTestId("open_sidebar_button"));

    // The mobile nav links are rendered inside the sheet.
    const mobileLinks = screen.getAllByTestId("mobile_nav_link");
    const liveIndex = mobileLinks.find((el) => el.textContent === "Live Index");
    expect(liveIndex).toBeTruthy();
    await user.click(liveIndex!);

    // Navigation happened and the drawer closed.
    expect(
      await screen.findByRole("heading", {
        name: /Base-100 Airfare Price Index/i,
      }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
