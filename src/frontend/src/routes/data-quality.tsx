import { createRoute } from "@tanstack/react-router";

import { AlertsPanel } from "@/components/AlertsPanel";
import { DataQualityCharts } from "@/components/DataQualityCharts";
import { DemoDataBanner } from "@/components/DemoDataBanner";
import { PageHeader } from "@/components/PageHeader";
import { SectionHeading } from "@/components/SectionHeading";
import { rootRoute } from "./__root";

export const dataQualityRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/data-quality",
  component: DataQualityPage,
});

function DataQualityPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Data Quality"
        title="Feed Health & Coverage"
        description="Live health metrics for the underlying fare feeds powering FAREPULSE, plus route-level alerts flagged by the quality engine."
      />

      <DemoDataBanner />

      <div className="mt-8">
        <DataQualityCharts />
      </div>

      <div className="mt-10">
        <SectionHeading
          title="Alerts"
          description="Click any alert to open that route's fare analytics."
        />
        <AlertsPanel />
      </div>
    </div>
  );
}
