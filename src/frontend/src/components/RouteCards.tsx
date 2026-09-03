import { ArrowDownRight, ArrowUpRight, Plane } from "lucide-react";

import { GlassCard } from "@/components/GlassCard";
import { Sparkline } from "@/components/Sparkline";
import { routeFares } from "@/lib/mockData";
import type { RouteFare } from "@/lib/types";
import { cn } from "@/lib/utils";

interface RouteCardsProps {
  selectedId: string | null;
  onSelect: (route: RouteFare) => void;
}

export function RouteCards({ selectedId, onSelect }: RouteCardsProps) {
  return (
    <div
      data-ocid="route_cards"
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      {routeFares.map((route) => {
        const selected = route.id === selectedId;
        const rising = route.changePct >= 0;
        const TrendIcon = rising ? ArrowUpRight : ArrowDownRight;
        const trendColor = rising ? "text-primary" : "text-success";

        return (
          <button
            key={route.id}
            type="button"
            data-ocid={`route_card.${route.id}`}
            onClick={() => onSelect(route)}
            aria-pressed={selected}
            className="group text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <GlassCard
              glow={selected}
              className={cn("h-full p-5", selected && "border-primary/60")}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="font-display text-lg font-semibold tracking-tight">
                  {route.origin} → {route.destination}
                </p>
                <span className="text-muted-foreground text-xs">
                  {route.flights} flights
                </span>
              </div>
              <p className="text-muted-foreground mt-1 text-sm">
                {route.originCity} to {route.destinationCity}
              </p>

              <div className="mt-4 flex items-end justify-between gap-3">
                <p className="font-mono text-2xl font-bold tracking-tight">
                  ₹{route.price.toLocaleString("en-IN")}
                </p>
                <span
                  className={cn(
                    "flex items-center gap-1 text-sm font-medium",
                    trendColor,
                  )}
                >
                  <TrendIcon className="size-4" />
                  {rising ? "+" : ""}
                  {route.changePct.toFixed(1)}%
                </span>
              </div>

              <div className="mt-4">
                <Sparkline
                  data={route.trend}
                  className={cn("h-10 w-full", trendColor)}
                />
              </div>

              <div className="mt-4 flex items-center gap-2">
                <Plane className="text-primary size-4" />
                <span className="text-muted-foreground text-xs">
                  {selected ? "Analysis loaded" : "Click to analyze"}
                </span>
              </div>
            </GlassCard>
          </button>
        );
      })}
    </div>
  );
}
