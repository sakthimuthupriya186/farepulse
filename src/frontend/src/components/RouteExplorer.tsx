import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  Gauge,
  Plane,
  Search,
  TrendingUp,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";

import { GlassCard } from "@/components/GlassCard";
import { SectionHeading } from "@/components/SectionHeading";
import { Sparkline } from "@/components/Sparkline";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { routeFares } from "@/lib/mockData";
import type { RouteFare } from "@/lib/types";

interface RouteExplorerProps {
  route: RouteFare | null;
  onSelectRoute: (route: RouteFare) => void;
}

const cities = Array.from(
  new Set(routeFares.flatMap((r) => [r.origin, r.destination])),
).sort();

const bookingWindows = [
  { value: "7", label: "7 days" },
  { value: "14", label: "14 days" },
  { value: "21", label: "21 days" },
  { value: "30", label: "30 days" },
];

interface RouteAnalysis {
  currentIndex: number;
  averageFare: number;
  lowest: number;
  highest: number;
  volatilityPct: number;
  trend: number[];
  rising: boolean;
  recommendedWindow: string;
}

function analyzeRoute(route: RouteFare): RouteAnalysis {
  const trend = route.trend;
  const mean = trend.reduce((a, b) => a + b, 0) / trend.length;
  const variance =
    trend.reduce((a, b) => a + (b - mean) ** 2, 0) / trend.length;
  const volatility = Math.sqrt(variance) / mean;
  const volatilityPct = volatility * 100;
  const lowest = Math.round(route.price * (1 - volatility));
  const highest = Math.round(route.price * (1 + volatility));
  const rising = trend[trend.length - 1] >= trend[0];

  let recommendedWindow: string;
  if (volatilityPct < 2) {
    recommendedWindow = "Book 7–14 days ahead";
  } else if (volatilityPct < 4) {
    recommendedWindow = "Book 14–21 days ahead";
  } else {
    recommendedWindow = "Book 21–30 days ahead";
  }

  return {
    currentIndex: trend[trend.length - 1],
    averageFare: route.price,
    lowest,
    highest,
    volatilityPct,
    trend,
    rising,
    recommendedWindow,
  };
}

export function RouteExplorer({ route, onSelectRoute }: RouteExplorerProps) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [windowDays, setWindowDays] = useState("14");
  const [error, setError] = useState<string | null>(null);

  // Sync the form fields when a route is selected from the cards.
  useEffect(() => {
    if (route) {
      setFrom(route.origin);
      setTo(route.destination);
      setError(null);
    }
  }, [route]);

  const analysis = useMemo(() => (route ? analyzeRoute(route) : null), [route]);

  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const match = routeFares.find(
      (r) => r.origin === from && r.destination === to,
    );
    if (!match) {
      setError("No fare data available for that city pair yet.");
      return;
    }
    setError(null);
    onSelectRoute(match);
  };

  return (
    <div className="space-y-6">
      <GlassCard className="p-6">
        <SectionHeading
          title="Route Fare Analysis"
          description="Pick a city pair and travel window to run a fare analysis."
        />
        <form
          onSubmit={handleSubmit}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5"
        >
          <div className="space-y-2">
            <Label htmlFor="from">From</Label>
            <Select value={from} onValueChange={setFrom}>
              <SelectTrigger
                id="from"
                data-ocid="route_explorer.from"
                className="w-full"
              >
                <SelectValue placeholder="Origin city" />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="to">To</Label>
            <Select value={to} onValueChange={setTo}>
              <SelectTrigger
                id="to"
                data-ocid="route_explorer.to"
                className="w-full"
              >
                <SelectValue placeholder="Destination city" />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="travel-date">Travel Date</Label>
            <Input
              id="travel-date"
              data-ocid="route_explorer.travel_date"
              type="date"
              min={today}
              value={travelDate}
              onChange={(e) => setTravelDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="window">Booking Window</Label>
            <Select value={windowDays} onValueChange={setWindowDays}>
              <SelectTrigger
                id="window"
                data-ocid="route_explorer.booking_window"
                className="w-full"
              >
                <SelectValue placeholder="Booking window" />
              </SelectTrigger>
              <SelectContent>
                {bookingWindows.map((w) => (
                  <SelectItem key={w.value} value={w.value}>
                    {w.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button
              type="submit"
              data-ocid="route_explorer.analyze_button"
              className="w-full lg:h-9"
            >
              <Search className="size-4" />
              Analyze Fare
            </Button>
          </div>
        </form>

        {error ? (
          <p
            data-ocid="route_explorer.error"
            className="text-destructive mt-4 text-sm"
          >
            {error}
          </p>
        ) : null}
      </GlassCard>

      {route && analysis ? (
        <ResultsPanel route={route} analysis={analysis} />
      ) : (
        <EmptyState />
      )}
    </div>
  );
}

function ResultsPanel({
  route,
  analysis,
}: {
  route: RouteFare;
  analysis: RouteAnalysis;
}) {
  const TrendIcon = analysis.rising ? ArrowUpRight : ArrowDownRight;
  const trendColor = analysis.rising ? "text-primary" : "text-success";

  return (
    <div data-ocid="route_explorer.results" className="space-y-4">
      <GlassCard strong glow className="p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-primary text-primary-foreground flex size-11 items-center justify-center rounded-xl shadow-subtle">
              <Plane className="size-5" />
            </div>
            <div>
              <p className="font-display text-xl font-semibold tracking-tight">
                {route.origin} → {route.destination}
              </p>
              <p className="text-muted-foreground text-sm">
                {route.originCity} to {route.destinationCity} · {route.flights}{" "}
                daily flights
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendIcon className={`size-5 ${trendColor}`} />
            <span className={`font-mono text-lg font-semibold ${trendColor}`}>
              {analysis.rising ? "+" : ""}
              {route.changePct.toFixed(1)}%
            </span>
          </div>
        </div>
      </GlassCard>

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

      <GlassCard className="p-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              Price Trend
            </p>
            <div className="mt-3">
              <Sparkline
                data={analysis.trend}
                className={`h-24 w-full ${trendColor}`}
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
              {analysis.recommendedWindow}
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
    </div>
  );
}

function EmptyState() {
  return (
    <GlassCard
      data-ocid="route_explorer.empty_state"
      className="flex flex-col items-center justify-center p-10 text-center"
    >
      <div className="bg-gradient-primary text-primary-foreground flex size-14 items-center justify-center rounded-2xl shadow-subtle">
        <Search className="size-6" />
      </div>
      <h3 className="font-display mt-4 text-lg font-semibold tracking-tight">
        No analysis loaded
      </h3>
      <p className="text-muted-foreground mt-2 max-w-md text-sm leading-relaxed">
        Choose a route from the cards below or fill in the form and hit{" "}
        <span className="text-foreground font-medium">Analyze Fare</span> to see
        the fare breakdown.
      </p>
    </GlassCard>
  );
}
