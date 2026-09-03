import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { GlassCard } from "./GlassCard";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  /** Optional delta line, e.g. "+2.8% (24H)" */
  delta?: ReactNode;
  className?: string;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  delta,
  className,
}: StatCardProps) {
  return (
    <GlassCard className={cn("p-5", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            {label}
          </p>
          <p className="font-display mt-2 text-2xl font-semibold tracking-tight text-foreground">
            {value}
          </p>
          {delta ? <div className="mt-1.5 text-sm">{delta}</div> : null}
        </div>
        <div className="bg-gradient-primary text-primary-foreground flex size-10 shrink-0 items-center justify-center rounded-xl shadow-subtle">
          <Icon className="size-5" />
        </div>
      </div>
    </GlassCard>
  );
}
