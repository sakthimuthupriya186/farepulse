import { Activity, BarChart3, Gauge, Plane, Radar, Waves } from "lucide-react";

import { StatCard } from "@/components/StatCard";
import { dataQualityMetrics, observations, routeFares } from "@/lib/mockData";
import type { IndexSeries } from "@/lib/types";

interface IndexStatsProps {
  /** The active index series used for the Current Index and % Change readouts */
  series: IndexSeries;
}

export function IndexStats({ series }: IndexStatsProps) {
  const avgQuality =
    dataQualityMetrics.reduce((sum, m) => sum + m.pct, 0) /
    dataQualityMetrics.length;

  const stats = [
    {
      label: "Current Index",
      value: series.current.toFixed(1),
      delta: <span className="text-primary">Base-100 benchmark</span>,
      icon: Activity,
    },
    {
      label: "% Change",
      value: `${series.changePct >= 0 ? "+" : ""}${series.changePct.toFixed(1)}%`,
      delta: <span className="text-muted-foreground">vs. start of range</span>,
      icon: BarChart3,
    },
    {
      label: "Base",
      value: "100",
      delta: (
        <span className="text-muted-foreground">Index reference point</span>
      ),
      icon: Gauge,
    },
    {
      label: "Routes Tracked",
      value: String(routeFares.length),
      delta: <span className="text-muted-foreground">Active city-pairs</span>,
      icon: Plane,
    },
    {
      label: "Observations",
      value: String(observations.length),
      delta: <span className="text-muted-foreground">Latest fare samples</span>,
      icon: Waves,
    },
    {
      label: "Data Quality Score",
      value: `${avgQuality.toFixed(1)}%`,
      delta: <span className="text-primary">Feed health composite</span>,
      icon: Radar,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}
