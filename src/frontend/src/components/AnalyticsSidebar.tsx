import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
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

import { cn } from "@/lib/utils";

type NavEntry =
  | { type: "route"; label: string; to: string; icon: LucideIcon }
  | { type: "section"; label: string; sectionId: string; icon: LucideIcon };

const NAV_ENTRIES: NavEntry[] = [
  { type: "section", label: "Overview", sectionId: "overview", icon: Gauge },
  { type: "route", label: "Live Index", to: "/live-index", icon: Activity },
  { type: "route", label: "Routes", to: "/routes", icon: Route },
  { type: "route", label: "Airlines", to: "/airlines", icon: Building2 },
  { type: "section", label: "Trends", sectionId: "trends", icon: TrendingUp },
  {
    type: "route",
    label: "Data Quality",
    to: "/data-quality",
    icon: ShieldCheck,
  },
  { type: "route", label: "Methodology", to: "/methodology", icon: GitBranch },
  { type: "route", label: "API", to: "/api", icon: BarChart3 },
];

function scrollToSection(sectionId: string) {
  document
    .getElementById(sectionId)
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function AnalyticsSidebar() {
  return (
    <aside
      data-ocid="analytics_sidebar"
      className="glass-strong sticky top-24 hidden w-60 shrink-0 self-start rounded-2xl p-3 lg:block"
      aria-label="Analytics navigation"
    >
      <p className="text-muted-foreground px-3 pb-2 pt-1 text-[11px] font-semibold tracking-widest uppercase">
        Analytics
      </p>
      <nav className="flex flex-col gap-1">
        {NAV_ENTRIES.map((entry) => {
          const Icon = entry.icon;
          if (entry.type === "section") {
            return (
              <button
                key={entry.label}
                type="button"
                data-ocid={`analytics.nav.${entry.sectionId}`}
                onClick={() => scrollToSection(entry.sectionId)}
                className="text-muted-foreground hover:text-foreground hover:bg-accent/60 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-smooth focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <Icon className="size-4 shrink-0" />
                {entry.label}
              </button>
            );
          }
          return (
            <Link
              key={entry.label}
              to={entry.to}
              data-ocid={`analytics.nav.${entry.to.replace("/", "")}`}
              className="text-muted-foreground hover:text-foreground hover:bg-accent/60 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-smooth focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring [&.active]:text-foreground [&.active]:bg-accent/60"
            >
              <Icon className="size-4 shrink-0" />
              {entry.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
