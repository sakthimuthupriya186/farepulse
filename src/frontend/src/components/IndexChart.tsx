import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { GlassCard } from "@/components/GlassCard";
import { SectionHeading } from "@/components/SectionHeading";
import { indexRanges, indexSeries } from "@/lib/mockData";
import type { IndexRange } from "@/lib/types";
import { cn } from "@/lib/utils";

const RANGE_LABELS: Record<IndexRange, string> = {
  "24H": "24H",
  "7D": "7D",
  "30D": "30D",
  "3M": "3M",
  "1Y": "1Y",
};

function formatTick(timestamp: string, range: IndexRange): string {
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

export function IndexChart() {
  const [range, setRange] = useState<IndexRange>("24H");
  const series = indexSeries[range];

  return (
    <GlassCard className="p-6">
      <SectionHeading
        title="Airfare Price Index"
        description="Higher index = higher fares. Base = 100."
        action={
          <fieldset className="flex flex-wrap gap-1 rounded-lg bg-muted p-1">
            <legend className="sr-only">Time range</legend>
            {indexRanges.map((r) => (
              <button
                key={r}
                type="button"
                data-ocid={`chart.range.${r}`}
                onClick={() => setRange(r)}
                aria-pressed={range === r}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-semibold transition-smooth",
                  range === r
                    ? "bg-gradient-primary text-primary-foreground shadow-subtle"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {RANGE_LABELS[r]}
              </button>
            ))}
          </fieldset>
        }
      />

      <div className="h-72 w-full sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={series.points}
            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="indexFill" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--chart-1)"
                  stopOpacity={0.45}
                />
                <stop
                  offset="100%"
                  stopColor="var(--chart-1)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              stroke="var(--border)"
              strokeDasharray="4 4"
              vertical={false}
            />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(t) => formatTick(t, range)}
              tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              minTickGap={24}
            />
            <YAxis
              domain={["auto", "auto"]}
              tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={40}
            />
            <Tooltip
              contentStyle={{
                background: "var(--popover)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                color: "var(--foreground)",
              }}
              labelFormatter={(t) => new Date(t).toLocaleString()}
              formatter={(value) => [Number(value).toFixed(1), "Index"]}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="var(--chart-1)"
              strokeWidth={2.5}
              fill="url(#indexFill)"
              activeDot={{
                r: 5,
                fill: "var(--chart-1)",
                stroke: "var(--background)",
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <p className="text-muted-foreground mt-4 text-xs">
        {series.points.length} samples · {RANGE_LABELS[range]} range · Base-100
        index
      </p>
    </GlassCard>
  );
}
