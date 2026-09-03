import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  CircleCheck,
  Gauge,
  Plane,
  TrendingUp,
  TriangleAlert,
} from "lucide-react";
import { useMemo, useState } from "react";

import { GlassCard } from "@/components/GlassCard";
import { SectionHeading } from "@/components/SectionHeading";
import { Sparkline } from "@/components/Sparkline";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { routeFares } from "@/lib/mockData";
import type { RouteFare } from "@/lib/types";
import { cn } from "@/lib/utils";

type AlertKind = "high" | "low" | "volatility";

interface RouteAlert {
  id: string;
  kind: AlertKind;
  route: RouteFare;
  title: string;
  message: string;
  timestamp: string;
}

const kindMeta: Record<
  AlertKind,
  { icon: typeof TriangleAlert; color: string; label: string }
> = {
  high: { icon: TriangleAlert, color: "text-destructive", label: "High Fare" },
  low: { icon: CircleCheck, color: "text-success", label: "Low Fare" },
  volatility: {
    icon: Activity,
    color: "text-warning",
    label: "Volatility",
  },
};

function volatilityOf(route: RouteFare): number {
  const trend = route.trend;
  const mean = trend.reduce((a, b) => a + b, 0) / trend.length;
  const variance =
    trend.reduce((a, b) => a + (b - mean) ** 2, 0) / trend.length;
  return (Math.sqrt(variance) / mean) * 100;
}

function buildAlerts(): RouteAlert[] {
  const alerts: RouteAlert[] = [];
  const now = Date.now();

  routeFares
    .filter((r) => r.changePct >= 1.5)
    .forEach((route, i) => {
      alerts.push({
        id: `high-${route.id}`,
        kind: "high",
        route,
        title: `High Fare Alert — ${route.origin} → ${route.destination}`,
        message: `Average fare up ${route.changePct.toFixed(1)}% — above the 2σ threshold. Book early to avoid spikes.`,
        timestamp: new Date(now - (i + 1) * 18 * 60000).toISOString(),
      });
    });

  routeFares
    .filter((r) => r.changePct <= -0.5)
    .forEach((route, i) => {
      alerts.push({
        id: `low-${route.id}`,
        kind: "low",
        route,
        title: `Low Fare Opportunity — ${route.origin} → ${route.destination}`,
        message: `Fares down ${Math.abs(route.changePct).toFixed(1)}% — favorable window to lock in a price.`,
        timestamp: new Date(now - (i + 2) * 22 * 60000).toISOString(),
      });
    });

  [...routeFares]
    .map((route) => ({ route, vol: volatilityOf(route) }))
    .sort((a, b) => b.vol - a.vol)
    .slice(0, 2)
    .forEach(({ route, vol }, i) => {
      alerts.push({
        id: `vol-${route.id}`,
        kind: "volatility",
        route,
        title: `Volatility Alert — ${route.origin} → ${route.destination}`,
        message: `Fare volatility at ${vol.toFixed(1)}% — prices swing sharply. Monitor before booking.`,
        timestamp: new Date(now - (i + 3) * 35 * 60000).toISOString(),
      });
    });

  return alerts.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.max(1, Math.round(diff / 60000));
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

interface RouteAnalysis {
  currentIndex: number;
  averageFare: number;
  lowest: number;
  highest: number;
  volatilityPct: number;
  trend: number[];
  rising: boolean;
}

function analyzeRoute(route: RouteFare): RouteAnalysis {
  const trend = route.trend;
  const mean = trend.reduce((a, b) => a + b, 0) / trend.length;
  const variance =
    trend.reduce((a, b) => a + (b - mean) ** 2, 0) / trend.length;
  const volatilityPct = (Math.sqrt(variance) / mean) * 100;
  const lowest = Math.round(route.price * (1 - volatilityPct / 100));
  const highest = Math.round(route.price * (1 + volatilityPct / 100));
  const rising = trend[trend.length - 1] >= trend[0];
  return {
    currentIndex: trend[trend.length - 1],
    averageFare: route.price,
    lowest,
    highest,
    volatilityPct,
    trend,
    rising,
  };
}

export function AlertsPanel() {
  const alerts = useMemo(buildAlerts, []);
  const [selected, setSelected] = useState<RouteAlert | null>(null);

  return (
    <GlassCard className="p-6">
      <SectionHeading
        title="Live Alerts"
        description="Route-level fare signals flagged by the quality engine."
        action={
          <span className="text-muted-foreground text-xs">
            {alerts.length} active
          </span>
        }
      />

      <div data-ocid="alerts_panel" className="space-y-3">
        {alerts.map((alert) => {
          const meta = kindMeta[alert.kind];
          const Icon = meta.icon;
          return (
            <button
              key={alert.id}
              type="button"
              data-ocid={`alert.${alert.id}`}
              onClick={() => setSelected(alert)}
              className="group flex w-full items-start gap-3 rounded-xl border border-border bg-background/40 p-4 text-left transition-smooth hover:border-primary/40 hover:bg-background/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <span
                className={cn(
                  "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg",
                  meta.color,
                )}
              >
                <Icon className="size-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="font-display text-sm font-semibold tracking-tight">
                    {alert.title}
                  </span>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase",
                      meta.color,
                    )}
                  >
                    {meta.label}
                  </span>
                </span>
                <span className="text-muted-foreground mt-1 block text-sm leading-relaxed">
                  {alert.message}
                </span>
                <span className="text-muted-foreground mt-2 block text-xs">
                  {timeAgo(alert.timestamp)} · Click to view route analytics
                </span>
              </span>
              <ArrowUpRight className="text-muted-foreground group-hover:text-primary mt-1 size-4 shrink-0 transition-smooth" />
            </button>
          );
        })}
      </div>

      <Dialog
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <DialogContent className="sm:max-w-2xl">
          {selected ? <RouteAnalyticsModal alert={selected} /> : null}
        </DialogContent>
      </Dialog>
    </GlassCard>
  );
}

function RouteAnalyticsModal({ alert }: { alert: RouteAlert }) {
  const route = alert.route;
  const analysis = analyzeRoute(route);
  const meta = kindMeta[alert.kind];
  const trendColor = analysis.rising ? "text-primary" : "text-success";

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Plane className="text-primary size-5" />
          {route.origin} → {route.destination}
        </DialogTitle>
        <DialogDescription>
          {route.originCity} to {route.destinationCity} · {route.flights} daily
          flights ·{" "}
          <span className={cn("font-medium", meta.color)}>{meta.label}</span>
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard
          label="Current Index"
          value={analysis.currentIndex.toFixed(1)}
          delta={
            <span className={trendColor}>
              {analysis.rising ? "▲" : "▼"} Base-100
            </span>
          }
          icon={Gauge}
        />
        <StatCard
          label="Average Fare"
          value={`₹${analysis.averageFare.toLocaleString("en-IN")}`}
          delta={<span className="text-muted-foreground">One-way economy</span>}
          icon={Plane}
        />
        <StatCard
          label="Lowest Fare"
          value={`₹${analysis.lowest.toLocaleString("en-IN")}`}
          delta={<span className="text-success">Best observed</span>}
          icon={ArrowDownRight}
        />
        <StatCard
          label="Highest Fare"
          value={`₹${analysis.highest.toLocaleString("en-IN")}`}
          delta={<span className="text-warning">Peak observed</span>}
          icon={ArrowUpRight}
        />
        <StatCard
          label="Volatility"
          value={`${analysis.volatilityPct.toFixed(1)}%`}
          delta={<span className="text-muted-foreground">30-day spread</span>}
          icon={TrendingUp}
        />
      </div>

      <GlassCard className="p-5">
        <div className="grid gap-5 lg:grid-cols-2">
          <div>
            <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              Price Trend
            </p>
            <div className="mt-3">
              <Sparkline
                data={analysis.trend}
                className={cn("h-20 w-full", trendColor)}
              />
            </div>
            <p className="text-muted-foreground mt-2 text-xs">
              Indexed trend across the last 10 observation periods.
            </p>
          </div>
          <div className="flex flex-col justify-center rounded-xl border border-border bg-background/40 p-5">
            <div className="flex items-center gap-2 text-primary">
              <CalendarDays className="size-5" />
              <p className="text-xs font-semibold tracking-[0.2em] uppercase">
                Recommended Booking Window
              </p>
            </div>
            <p className="font-display mt-3 text-2xl font-semibold tracking-tight">
              {analysis.volatilityPct < 2
                ? "Book 7–14 days ahead"
                : analysis.volatilityPct < 4
                  ? "Book 14–21 days ahead"
                  : "Book 21–30 days ahead"}
            </p>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
              {analysis.volatilityPct < 2
                ? "Fares are stable on this route — you can wait closer to departure."
                : analysis.volatilityPct < 4
                  ? "Moderate fare movement — booking mid-range locks in a fair price."
                  : "Fares swing sharply on this route — book early to avoid spikes."}
            </p>
          </div>
        </div>
      </GlassCard>

      <div className="flex justify-end">
        <DialogClose asChild>
          <Button data-ocid="alert.close_button" variant="outline">
            Close
          </Button>
        </DialogClose>
      </div>
    </>
  );
}
