import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Use the stronger glass treatment for elevated surfaces */
  strong?: boolean;
  /** Add a cyan glow ring around the card */
  glow?: boolean;
}

export function GlassCard({
  className,
  strong = false,
  glow = false,
  ...props
}: GlassCardProps) {
  return (
    <div
      data-ocid="card"
      className={cn(
        "rounded-2xl",
        strong ? "glass-strong" : "glass",
        glow && "glow-primary",
        "transition-smooth hover:border-primary/40",
        className,
      )}
      {...props}
    />
  );
}
