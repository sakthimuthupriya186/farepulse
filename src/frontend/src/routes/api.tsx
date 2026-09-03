import { createRoute } from "@tanstack/react-router";

import { ApiDocs } from "@/components/ApiDocs";
import { DemoDataBanner } from "@/components/DemoDataBanner";
import { PageHeader } from "@/components/PageHeader";
import { rootRoute } from "./__root";

export const apiRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/api",
  component: ApiPage,
});

function ApiPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="API"
        title="Developer API"
        description="Programmatic access to FAREPULSE index, route, airline, and trend data. Explore the endpoints below with sample requests and responses."
      />

      <div className="mb-6">
        <DemoDataBanner />
      </div>

      <ApiDocs />
    </div>
  );
}
