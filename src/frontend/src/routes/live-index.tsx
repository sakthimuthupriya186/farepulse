import { createRoute } from "@tanstack/react-router";

import { DemoDataBanner } from "@/components/DemoDataBanner";
import { IndexChart } from "@/components/IndexChart";
import { IndexStats } from "@/components/IndexStats";
import { PageHeader } from "@/components/PageHeader";
import { indexSeries } from "@/lib/mockData";
import { rootRoute } from "./__root";

export const liveIndexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/live-index",
  component: LiveIndexPage,
});

function LiveIndexPage() {
  const series = indexSeries["24H"];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Live Index"
        title="Base-100 Airfare Price Index"
        description="The headline benchmark for domestic airfare movement across India. Higher index = higher fares."
      />

      <DemoDataBanner />

      <div className="mt-8">
        <IndexStats series={series} />
      </div>

      <div className="mt-8">
        <IndexChart />
      </div>
    </div>
  );
}
