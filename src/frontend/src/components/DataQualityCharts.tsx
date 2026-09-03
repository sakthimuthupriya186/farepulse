import {
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
} from "recharts";

import { GlassCard } from "@/components/GlassCard";
import { SectionHeading } from "@/components/SectionHeading";
import { dataQualityMetrics } from "@/lib/mockData";
import type { DataQualityMetric } from "@/lib/types";
import { cn } from "@/lib/utils";

const overallScore =
  dataQualityMetrics.reduce((sum, m) => sum + m.pct, 0) /
  dataQualityMetrics.length;

const scoreData = [{ name: "Data Quality Score", value: overallScore }];

const statusStyles: Record<
  DataQualityMetric["status"],
  { bar: string; text: string; label: string }
> = {
  healthy: { bar: "bg-success", text: "text-success", label: "Healthy" },
  warning: { bar: "bg-warning", text: "text-warning", label: "Warning" },
  critical: {
    bar: "bg-destructive",
    text: "text-destructive",
    label: "Critical",
  },
};

export function DataQualityCharts() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <GlassCard strong glow className="p-6 lg:col-span-1">
        <SectionHeading
          title="Data Quality Score"
          description="Composite health across all active fare feeds."
        />
        <div className="relative mx-auto mt-2 h-56 w-full max-w-xs">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              data={scoreData}
              startAngle={90}
              endAngle={-270}
              innerRadius="72%"
              outerRadius="100%"
            >
              <defs>
                <linearGradient id="scoreGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#00F2FF" />
                  <stop offset="100%" stopColor="#0066FF" />
                </linearGradient>
              </defs>
              <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
              <RadialBar
                dataKey="value"
                cornerRadius={12}
                fill="url(#scoreGradient)"
                background={{ fill: "oklch(var(--muted) / 0.5)" }}
              />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <p className="font-mono text-gradient text-5xl font-bold tracking-tight">
              {overallScore.toFixed(1)}
            </p>
            <p className="text-muted-foreground mt-1 text-xs font-medium tracking-wide uppercase">
              / 100
            </p>
          </div>
        </div>
        <p className="text-muted-foreground mt-4 text-center text-xs leading-relaxed">
          Weighted average of {dataQualityMetrics.length} feed health signals.
        </p>
      </GlassCard>

      <GlassCard className="p-6 lg:col-span-2">
        <SectionHeading
          title="Signal Breakdown"
          description="Individual feed health metrics driving the composite score."
        />
        <div className="space-y-5">
          {dataQualityMetrics.map((metric) => {
            const style = statusStyles[metric.status];
            return (
              <div
                key={metric.id}
                data-ocid={`data_quality.metric.${metric.id}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-display text-sm font-semibold tracking-tight">
                    {metric.label}
                  </p>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase",
                        style.text,
                      )}
                    >
                      {style.label}
                    </span>
                    <span className="font-mono text-sm font-semibold">
                      {metric.pct.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="bg-muted mt-2 h-2.5 w-full overflow-hidden rounded-full">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      style.bar,
                    )}
                    style={{ width: `${metric.pct}%` }}
                  />
                </div>
                <p className="text-muted-foreground mt-1.5 text-xs leading-relaxed">
                  {metric.detail}
                </p>
              </div>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );
}
