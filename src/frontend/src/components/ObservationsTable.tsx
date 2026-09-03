import { CheckCircle2, Clock, Flag } from "lucide-react";

import { GlassCard } from "@/components/GlassCard";
import { SectionHeading } from "@/components/SectionHeading";
import { observations } from "@/lib/mockData";
import type { ObservationRow } from "@/lib/types";
import { cn } from "@/lib/utils";

const BASELINE_FARE = 5000;

/** Derive a base-100 index value from an observed fare. */
function fareIndex(fare: number): number {
  return Math.round((fare / BASELINE_FARE) * 100 * 10) / 10;
}

type Status = "captured" | "verified" | "flagged";

/** Deterministic status derived from the observation's source and seats. */
function statusFor(row: ObservationRow): Status {
  if (row.seats <= 5) return "flagged";
  if (row.source === "Web Fare Feed") return "verified";
  return "captured";
}

const STATUS_META: Record<
  Status,
  { label: string; className: string; icon: typeof Clock }
> = {
  captured: {
    label: "Captured",
    className: "bg-primary/15 text-primary",
    icon: Clock,
  },
  verified: {
    label: "Verified",
    className: "bg-success/15 text-success",
    icon: CheckCircle2,
  },
  flagged: {
    label: "Flagged",
    className: "bg-warning/15 text-warning",
    icon: Flag,
  },
};

function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ObservationsTable() {
  return (
    <GlassCard className="p-6">
      <SectionHeading
        title="Recent Observations"
        description="Latest fare samples captured across the network."
      />

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="text-muted-foreground border-border/60 border-b text-[11px] tracking-widest uppercase">
              <th className="px-3 py-2.5 font-semibold">Route</th>
              <th className="px-3 py-2.5 font-semibold">Carrier</th>
              <th className="px-3 py-2.5 text-right font-semibold">Fare</th>
              <th className="px-3 py-2.5 text-right font-semibold">Index</th>
              <th className="px-3 py-2.5 font-semibold">Timestamp</th>
              <th className="px-3 py-2.5 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {observations.map((row, i) => {
              const status = statusFor(row);
              const meta = STATUS_META[status];
              const StatusIcon = meta.icon;
              return (
                <tr
                  key={row.id}
                  data-ocid={`observation.row.${i + 1}`}
                  className="border-border/40 hover:bg-accent/40 border-b transition-smooth last:border-0"
                >
                  <td className="font-mono px-3 py-3 font-medium">
                    {row.route}
                  </td>
                  <td className="px-3 py-3">
                    <span className="text-muted-foreground mr-1.5 font-mono text-xs">
                      {row.cabin === "Business" ? "J" : "Y"}
                    </span>
                    {row.airline}
                  </td>
                  <td className="font-mono px-3 py-3 text-right font-semibold tabular-nums">
                    ₹{row.fare.toLocaleString("en-IN")}
                  </td>
                  <td className="font-mono text-gradient px-3 py-3 text-right font-semibold tabular-nums">
                    {fareIndex(row.fare).toFixed(1)}
                  </td>
                  <td className="text-muted-foreground px-3 py-3 whitespace-nowrap tabular-nums">
                    {formatTimestamp(row.timestamp)}
                  </td>
                  <td className="px-3 py-3">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold",
                        meta.className,
                      )}
                    >
                      <StatusIcon className="size-3" />
                      {meta.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-muted-foreground mt-4 text-xs">
        {observations.length} samples · GDS + web fare feeds · refreshed
        continuously
      </p>
    </GlassCard>
  );
}
