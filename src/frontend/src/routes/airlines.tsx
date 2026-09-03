import { createRoute } from "@tanstack/react-router";

import { AirlineComparison } from "@/components/AirlineComparison";
import { DemoDataBanner } from "@/components/DemoDataBanner";
import { PageHeader } from "@/components/PageHeader";
import { airlines } from "@/lib/mockData";
import { rootRoute } from "./__root";

export const airlinesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/airlines",
  component: AirlinesPage,
});

function AirlinesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Airlines"
        title="Carrier-Level Intelligence"
        description="Compare average fares, index levels, and 7-day momentum across India's leading carriers."
      />

      <DemoDataBanner />

      <div className="mt-8">
        <AirlineComparison airlines={airlines} />
      </div>
    </div>
  );
}
