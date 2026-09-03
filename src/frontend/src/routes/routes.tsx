import { createRoute } from "@tanstack/react-router";
import { useState } from "react";

import { DemoDataBanner } from "@/components/DemoDataBanner";
import { PageHeader } from "@/components/PageHeader";
import { RouteCards } from "@/components/RouteCards";
import { RouteExplorer } from "@/components/RouteExplorer";
import { SectionHeading } from "@/components/SectionHeading";
import { routeFares } from "@/lib/mockData";
import { rootRoute } from "./__root";

export const routesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/routes",
  component: RoutesPage,
});

function RoutesPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedRoute =
    routeFares.find((route) => route.id === selectedId) ?? null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Routes"
        title="City-Pair Fare Explorer"
        description="Analyze average one-way fares and booking windows across India's busiest domestic routes."
      />

      <DemoDataBanner />

      <div className="mt-8">
        <RouteExplorer
          route={selectedRoute}
          onSelectRoute={(route) => setSelectedId(route.id)}
        />
      </div>

      <div className="mt-10">
        <SectionHeading
          title="Popular Routes"
          description="Select a route to load its fare analysis."
        />
        <RouteCards
          selectedId={selectedId}
          onSelect={(route) => setSelectedId(route.id)}
        />
      </div>
    </div>
  );
}
