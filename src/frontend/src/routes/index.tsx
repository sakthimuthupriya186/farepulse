import { createRoute } from "@tanstack/react-router";

import { DemoDataBanner } from "@/components/DemoDataBanner";
import { HomeHero } from "@/components/HomeHero";
import { HomeSections } from "@/components/HomeSections";
import { rootRoute } from "./__root";

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

function HomePage() {
  return (
    <div>
      <HomeHero />
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <DemoDataBanner />
      </div>
      <HomeSections />
    </div>
  );
}
