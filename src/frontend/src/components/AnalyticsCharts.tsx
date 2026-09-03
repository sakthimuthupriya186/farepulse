import { useMemo } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";

import { GlassCard } from "@/components/GlassCard";
import { SectionHeading } from "@/components/SectionHeading";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { airlines, indexSeries, routeFares } from "@/lib/mockData";
import type { IndexRange } from "@/lib/types";
import { cn } from "@/lib/utils";

function formatIndexTick(timestamp: string, range: IndexRange): string {
  const date = new Date(timestamp);
  switch (range) {
    case "24H":
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    case "7D":
      return date.toLocaleDateString([], { weekday: "short" });
    case "30D":
    case "3M":
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    case "1Y":
      return date.toLocaleDateString([], { month: "short" });
  }
}

/** Deterministic booking-window curve: fares rise as departure approaches. */
const BOOKING_WINDOWS = [
  { label: "0–7d", index: 118 },
  { label: "8–14d", index: 112 },
  { label: "15–21d", index: 106 },
  { label: "22–30d", index: 101 },
  { label: "31–45d", index: 97 },
  { label: "46–60d", index: 94 },
];

/** Volatility = normalized spread of each route's trend series. */
function routeVolatility(): { route: string; volatility: number }[] {
  return routeFares.map((route) => {
    const min = Math.min(...route.trend);
    const max = Math.max(...route.trend);
    const mean = route.trend.reduce((a, b) => a + b, 0) / route.trend.length;
    const variance =
      route.trend.reduce((a, b) => a + (b - mean) ** 2, 0) / route.trend.length;
    const stdDev = Math.sqrt(variance);
    // Volatility as a 0-100 scale combining spread and deviation.
    const volatility = Math.min(
      100,
      Math.round(((max - min) / mean) * 100 + stdDev * 2),
    );
    return { route: `${route.origin}→${route.destination}`, volatility };
  });
}

export function AnalyticsCharts() {
  const indexSeriesData = indexSeries["30D"];
  const routeData = useMemo(
    () =>
      routeFares.map((r) => ({
        route: `${r.origin}→${r.destination}`,
        fare: r.price,
        change: r.changePct,
      })),
    [],
  );
  const airlineData = useMemo(
    () =>
      airlines.map((a) => ({
        name: a.code,
        fullName: a.name,
        avgFare: a.avgFare,
        marketShare: a.marketShare,
      })),
    [],
  );
  const volatilityData = useMemo(() => routeVolatility(), []);

  const routeConfig = {
    fare: { label: "Avg Fare (₹)", color: "var(--chart-1)" },
  };
  const airlineConfig = {
    avgFare: { label: "Avg Fare (₹)", color: "var(--chart-2)" },
    marketShare: { label: "Market Share (%)", color: "var(--chart-3)" },
  };
  const bookingConfig = {
    index: { label: "Fare Index", color: "var(--chart-1)" },
  };
  const volatilityConfig = {
    volatility: { label: "Volatility", color: "var(--chart-4)" },
  };

  return (
    <div className="space-y-6">
      {/* Airfare Index line chart */}
      <GlassCard className="p-6" id="overview">
        <SectionHeading
          title="Airfare Index — 30 Day Trend"
          description="Base-100 weighted index across the domestic network."
        />
        <ChartContainer config={routeConfig} className="h-72 w-full">
          <AreaChart
            data={indexSeriesData.points}
            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient
                id="analyticsIndexFill"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="var(--chart-1)"
                  stopOpacity={0.4}
                />
                <stop
                  offset="100%"
                  stopColor="var(--chart-1)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(t) => formatIndexTick(t, "30D")}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={24}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={40}
              domain={["auto", "auto"]}
            />
            <ChartTooltip
              cursor={{ stroke: "oklch(var(--border))" }}
              content={
                <ChartTooltipContent
                  labelFormatter={(t) => new Date(t).toLocaleString()}
                  formatter={(value) => [Number(value).toFixed(1), "Index"]}
                />
              }
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="var(--chart-1)"
              strokeWidth={2.5}
              fill="url(#analyticsIndexFill)"
              dot={false}
            />
          </AreaChart>
        </ChartContainer>
      </GlassCard>

      {/* Route comparison */}
      <GlassCard className="p-6">
        <SectionHeading
          title="Route Comparison"
          description="Average one-way fare by city-pair."
        />
        <ChartContainer config={routeConfig} className="h-72 w-full">
          <BarChart
            data={routeData}
            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="route"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={52}
              tickFormatter={(v: number) => `₹${v}`}
            />
            <ChartTooltip
              cursor={{ fill: "oklch(var(--muted) / 0.4)" }}
              content={
                <ChartTooltipContent
                  formatter={(value) => [
                    `₹${Number(value).toLocaleString("en-IN")}`,
                    "Avg Fare",
                  ]}
                />
              }
            />
            <Bar
              dataKey="fare"
              radius={[6, 6, 0, 0]}
              fill="var(--color-fare)"
            />
          </BarChart>
        </ChartContainer>
      </GlassCard>

      {/* Airline comparison */}
      <GlassCard className="p-6">
        <SectionHeading
          title="Airline Comparison"
          description="Average fare and market share across leading carriers."
        />
        <ChartContainer config={airlineConfig} className="h-72 w-full">
          <BarChart
            data={airlineData}
            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              yAxisId="fare"
              tickLine={false}
              axisLine={false}
              width={52}
              tickFormatter={(v: number) => `₹${v}`}
            />
            <YAxis
              yAxisId="share"
              orientation="right"
              tickLine={false}
              axisLine={false}
              width={40}
              tickFormatter={(v: number) => `${v}%`}
            />
            <ChartTooltip
              cursor={{ fill: "oklch(var(--muted) / 0.4)" }}
              content={
                <ChartTooltipContent
                  formatter={(value, name) => {
                    const num = Number(value);
                    return name === "marketShare"
                      ? [`${num.toFixed(1)}%`, "Market Share"]
                      : [`₹${num.toLocaleString("en-IN")}`, "Avg Fare"];
                  }}
                />
              }
            />
            <Bar
              yAxisId="fare"
              dataKey="avgFare"
              radius={[6, 6, 0, 0]}
              fill="var(--color-avgFare)"
            />
            <Bar
              yAxisId="share"
              dataKey="marketShare"
              radius={[6, 6, 0, 0]}
              fill="var(--color-marketShare)"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </BarChart>
        </ChartContainer>
      </GlassCard>

      {/* Booking-window + Fare volatility */}
      <div id="trends" className="grid gap-6 lg:grid-cols-2">
        <GlassCard className="p-6">
          <SectionHeading
            title="Booking-Window Analysis"
            description="Average fare index by days before departure."
          />
          <ChartContainer config={bookingConfig} className="h-64 w-full">
            <LineChart
              data={BOOKING_WINDOWS}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={40}
                domain={["dataMin - 4", "dataMax + 4"]}
              />
              <ChartTooltip
                cursor={{ stroke: "oklch(var(--border))" }}
                content={
                  <ChartTooltipContent
                    formatter={(value) => [
                      Number(value).toFixed(1),
                      "Fare Index",
                    ]}
                  />
                }
              />
              <Line
                type="monotone"
                dataKey="index"
                stroke="var(--chart-1)"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "var(--chart-1)" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ChartContainer>
        </GlassCard>

        <GlassCard className="p-6">
          <SectionHeading
            title="Fare Volatility"
            description="Price volatility by route (higher = more unstable)."
          />
          <ChartContainer config={volatilityConfig} className="h-64 w-full">
            <BarChart
              data={volatilityData}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="route"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={40}
                domain={[0, 100]}
              />
              <ChartTooltip
                cursor={{ fill: "oklch(var(--muted) / 0.4)" }}
                content={
                  <ChartTooltipContent
                    formatter={(value) => [
                      `${Number(value).toFixed(1)}`,
                      "Volatility",
                    ]}
                  />
                }
              />
              <Bar
                dataKey="volatility"
                radius={[6, 6, 0, 0]}
                fill="var(--color-volatility)"
              />
            </BarChart>
          </ChartContainer>
        </GlassCard>
      </div>
    </div>
  );
}
