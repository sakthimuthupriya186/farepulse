import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
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
import type { Airline } from "@/lib/types";
import { cn } from "@/lib/utils";

const BASE_INDEX = 100;

interface AirlineComparisonProps {
  airlines: Airline[];
}

/** Deterministic 7-day index trend for a carrier, derived from its fare delta. */
function buildTrend(airline: Airline): number[] {
  const drift = airline.changePct / 7;
  const points: number[] = [];
  let value = BASE_INDEX - airline.changePct;
  for (let i = 0; i < 7; i++) {
    const wave = Math.sin(i * 1.1 + airline.id.length) * 0.6;
    value += drift + wave;
    points.push(Math.round(value * 10) / 10);
  }
  return points;
}

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function AirlineComparison({ airlines }: AirlineComparisonProps) {
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(airlines.map((a) => a.id)),
  );
  const [metric, setMetric] = useState<"fare" | "index" | "change">("fare");

  const toggleAirline = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const visible = useMemo(
    () => airlines.filter((a) => selected.has(a.id)),
    [airlines, selected],
  );

  const barData = useMemo(
    () =>
      visible.map((a) => ({
        name: a.code,
        fullName: a.name,
        fare: a.avgFare,
        index: Math.round((a.avgFare / 5000) * BASE_INDEX * 10) / 10,
        change: a.changePct,
      })),
    [visible],
  );

  const trendData = useMemo(
    () =>
      DAY_LABELS.map((day, i) => {
        const row: Record<string, string | number> = { day };
        for (const a of visible) {
          row[a.code] = buildTrend(a)[i];
        }
        return row;
      }),
    [visible],
  );

  const chartConfig = useMemo(() => {
    const palette = [
      "var(--chart-1)",
      "var(--chart-2)",
      "var(--chart-3)",
      "var(--chart-4)",
      "var(--chart-5)",
    ];
    const config: Record<string, { label: string; color: string }> = {};
    visible.forEach((a, i) => {
      config[a.code] = { label: a.name, color: palette[i % palette.length] };
    });
    return config;
  }, [visible]);

  const metricLabel =
    metric === "fare"
      ? "Average Fare"
      : metric === "index"
        ? "Index"
        : "7-Day Change";

  return (
    <div className="space-y-6">
      {/* Controls */}
      <GlassCard className="p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-muted-foreground mr-1 text-xs font-medium tracking-wide uppercase">
              Carriers
            </span>
            {airlines.map((a) => {
              const active = selected.has(a.id);
              return (
                <button
                  key={a.id}
                  type="button"
                  data-ocid={`airline.toggle.${a.code.toLowerCase()}`}
                  aria-pressed={active}
                  onClick={() => toggleAirline(a.id)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-sm font-medium transition-smooth focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                    active
                      ? "border-primary/50 bg-primary/15 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground",
                  )}
                >
                  {a.name}
                </button>
              );
            })}
          </div>

          <fieldset
            data-ocid="airline.metric.toggle"
            className="bg-muted flex rounded-lg p-1"
            aria-label="Comparison metric"
          >
            <legend className="sr-only">Comparison metric</legend>
            {(
              [
                ["fare", "Avg Fare"],
                ["index", "Index"],
                ["change", "7-Day Δ"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                data-ocid={`airline.metric.${key}`}
                aria-pressed={metric === key}
                onClick={() => setMetric(key)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium transition-smooth focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                  metric === key
                    ? "bg-gradient-primary text-primary-foreground shadow-subtle"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {label}
              </button>
            ))}
          </fieldset>
        </div>
      </GlassCard>

      {/* Per-airline stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {visible.map((a) => {
          const index = Math.round((a.avgFare / 5000) * BASE_INDEX * 10) / 10;
          const up = a.changePct >= 0;
          return (
            <GlassCard key={a.id} className="p-5">
              <div className="flex items-center justify-between">
                <p className="font-display text-base font-semibold tracking-tight">
                  {a.name}
                </p>
                <span className="text-muted-foreground font-mono text-xs">
                  {a.code}
                </span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-muted-foreground text-[11px] tracking-wide uppercase">
                    Avg Fare
                  </p>
                  <p className="font-mono mt-1 text-lg font-semibold">
                    ₹{a.avgFare.toLocaleString("en-IN")}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-[11px] tracking-wide uppercase">
                    Index
                  </p>
                  <p className="font-mono text-gradient mt-1 text-lg font-semibold">
                    {index.toFixed(1)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-[11px] tracking-wide uppercase">
                    7-Day Δ
                  </p>
                  <p
                    className={cn(
                      "font-mono mt-1 text-lg font-semibold",
                      up ? "text-primary" : "text-success",
                    )}
                  >
                    {up ? "+" : ""}
                    {a.changePct.toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-[11px] tracking-wide uppercase">
                    On-Time
                  </p>
                  <p className="font-mono mt-1 text-lg font-semibold">
                    {a.onTimePct.toFixed(1)}%
                  </p>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard className="p-5">
          <SectionHeading
            title={`${metricLabel} by Carrier`}
            description="Direct comparison across selected airlines."
          />
          <ChartContainer config={chartConfig} className="h-72 w-full">
            <BarChart
              data={barData}
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
                tickLine={false}
                axisLine={false}
                width={52}
                tickFormatter={(v: number) =>
                  metric === "fare" ? `₹${v}` : `${v}`
                }
              />
              <ChartTooltip
                cursor={{ fill: "oklch(var(--muted) / 0.4)" }}
                content={
                  <ChartTooltipContent
                    formatter={(value: unknown, name: unknown) => {
                      const num = Number(value);
                      const formatted =
                        metric === "fare"
                          ? `₹${num.toLocaleString("en-IN")}`
                          : metric === "change"
                            ? `${num > 0 ? "+" : ""}${num}%`
                            : num.toFixed(1);
                      return [
                        formatted,
                        chartConfig[String(name)]?.label ?? String(name),
                      ];
                    }}
                  />
                }
              />
              <Bar
                dataKey={metric}
                radius={[6, 6, 0, 0]}
                fill="var(--color-fare)"
              />
            </BarChart>
          </ChartContainer>
        </GlassCard>

        <GlassCard className="p-5">
          <SectionHeading
            title="7-Day Index Trend"
            description="Base-100 fare index trajectory per carrier."
          />
          <ChartContainer config={chartConfig} className="h-72 w-full">
            <AreaChart
              data={trendData}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <defs>
                {visible.map((a, i) => (
                  <linearGradient
                    key={a.id}
                    id={`grad-${a.id}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={`var(--chart-${(i % 5) + 1})`}
                      stopOpacity={0.35}
                    />
                    <stop
                      offset="95%"
                      stopColor={`var(--chart-${(i % 5) + 1})`}
                      stopOpacity={0}
                    />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={40}
                domain={["dataMin - 2", "dataMax + 2"]}
              />
              <ChartTooltip
                cursor={{ stroke: "oklch(var(--border))" }}
                content={<ChartTooltipContent />}
              />
              {visible.map((a, i) => (
                <Area
                  key={a.id}
                  type="monotone"
                  dataKey={a.code}
                  stroke={`var(--chart-${(i % 5) + 1})`}
                  strokeWidth={2}
                  fill={`url(#grad-${a.id})`}
                  dot={false}
                />
              ))}
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        </GlassCard>
      </div>
    </div>
  );
}
