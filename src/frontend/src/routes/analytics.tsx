import { Link, createRoute } from "@tanstack/react-router";
import {
  Activity,
  BarChart3,
  Building2,
  Gauge,
  GitBranch,
  Route,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

import { AnalyticsCharts } from "@/components/AnalyticsCharts";
import { AnalyticsSidebar } from "@/components/AnalyticsSidebar";
import { DemoDataBanner } from "@/components/DemoDataBanner";
import { ObservationsTable } from "@/components/ObservationsTable";
import { PageHeader } from "@/components/PageHeader";
import { rootRoute } from "./__root";

const MOBILE_NAV = [
  { label: "Overview", to: "#overview", icon: Gauge },
  { label: "Live Index", to: "/live-index", icon: Activity },
  { label: "Routes", to: "/routes", icon: Route },
  { label: "Airlines", to: "/airlines", icon: Building2 },
  { label: "Trends", to: "#trends", icon: TrendingUp },
  { label: "Data Quality", to: "/data-quality", icon: ShieldCheck },
  { label: "Methodology", to: "/methodology", icon: GitBranch },
  { label: "API", to: "/api", icon: BarChart3 },
];

export const analyticsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/analytics",
  component: AnalyticsPage,
});

function AnalyticsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Analytics"
        title="Market Intelligence"
        description="Deep-dive trends, seasonality, and fare movement analytics across the domestic network."
      />

      <DemoDataBanner />

      {/* Mobile horizontal nav */}
      <nav
        data-ocid="analytics_mobile_nav"
        aria-label="Analytics"
        className="glass-strong -mx-4 mb-8 flex gap-1 overflow-x-auto px-4 py-2 sm:-mx-6 sm:px-6 lg:hidden"
      >
        {MOBILE_NAV.map((item) => {
          const Icon = item.icon;
          if (item.to.startsWith("#")) {
            return (
              <button
                key={item.label}
                type="button"
                data-ocid={`analytics.nav.${item.to.slice(1)}`}
                onClick={() =>
                  document
                    .getElementById(item.to.slice(1))
                    ?.scrollIntoView({ behavior: "smooth", block: "start" })
                }
                className="text-muted-foreground hover:text-foreground hover:bg-accent/60 flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-smooth"
              >
                <Icon className="size-4" />
                {item.label}
              </button>
            );
          }
          return (
            <Link
              key={item.label}
              to={item.to}
              data-ocid={`analytics.nav.${item.to.replace("/", "")}`}
              className="text-muted-foreground hover:text-foreground hover:bg-accent/60 flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-smooth"
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-start">
        <AnalyticsSidebar />

        <div className="min-w-0 flex-1 space-y-8">
          <AnalyticsCharts />
          <ObservationsTable />
        </div>
      </div>
    </div>
  );
}
