import { Plane } from "lucide-react";
import { useState } from "react";

import { cityNodes } from "@/lib/mockData";

interface NodeDetail {
  index: number;
  trackedRoutes: number;
  lastUpdated: string;
}

/** Demo enrichment for each hub node — replace with live per-city fare data. */
const nodeDetails: Record<string, NodeDetail> = {
  del: { index: 112.4, trackedRoutes: 42, lastUpdated: "2 mins ago" },
  bom: { index: 108.9, trackedRoutes: 38, lastUpdated: "3 mins ago" },
  blr: { index: 104.2, trackedRoutes: 31, lastUpdated: "4 mins ago" },
  maa: { index: 106.7, trackedRoutes: 27, lastUpdated: "2 mins ago" },
  hyd: { index: 101.5, trackedRoutes: 22, lastUpdated: "5 mins ago" },
  ccu: { index: 99.8, trackedRoutes: 18, lastUpdated: "6 mins ago" },
  pnq: { index: 103.1, trackedRoutes: 14, lastUpdated: "4 mins ago" },
  cok: { index: 98.4, trackedRoutes: 12, lastUpdated: "7 mins ago" },
};

/** Connecting flight paths between hub cities (by node id). */
const connections: Array<[string, string]> = [
  ["del", "bom"],
  ["del", "ccu"],
  ["del", "maa"],
  ["bom", "blr"],
  ["bom", "hyd"],
  ["bom", "pnq"],
  ["blr", "maa"],
  ["blr", "cok"],
  ["maa", "hyd"],
];

/** Stylized India silhouette (normalized 0-100 coordinate space). */
const INDIA_OUTLINE =
  "M 58 4 L 72 8 L 80 14 L 84 22 L 88 30 L 86 38 L 82 44 L 84 50 L 80 56 L 74 60 L 70 66 L 64 70 L 60 76 L 54 80 L 48 84 L 42 82 L 38 76 L 34 70 L 30 64 L 26 58 L 24 50 L 22 42 L 26 34 L 30 28 L 36 22 L 42 16 L 48 10 L 54 6 Z";

interface IndiaMapProps {
  className?: string;
}

export function IndiaMap({ className }: IndiaMapProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const nodeById = new Map(cityNodes.map((n) => [n.id, n]));
  const activeNode = activeId ? nodeById.get(activeId) : undefined;
  const activeDetail = activeId ? nodeDetails[activeId] : undefined;

  return (
    <div data-ocid="india_map" className={`relative w-full ${className ?? ""}`}>
      <svg
        viewBox="0 0 100 100"
        className="h-auto w-full"
        role="img"
        aria-label="Interactive map of India's domestic airfare network"
      >
        <defs>
          <linearGradient id="india-fill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(var(--primary) / 0.16)" />
            <stop offset="100%" stopColor="oklch(var(--accent) / 0.08)" />
          </linearGradient>
          <linearGradient id="india-stroke" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(var(--primary) / 0.9)" />
            <stop offset="100%" stopColor="oklch(var(--accent) / 0.9)" />
          </linearGradient>
        </defs>

        {/* India landmass */}
        <path
          d={INDIA_OUTLINE}
          fill="url(#india-fill)"
          stroke="url(#india-stroke)"
          strokeWidth="0.6"
          strokeLinejoin="round"
          className="drop-shadow-[0_0_12px_oklch(var(--primary)/0.25)]"
        />

        {/* Connecting flight paths */}
        {connections.map(([fromId, toId]) => {
          const from = nodeById.get(fromId);
          const to = nodeById.get(toId);
          if (!from || !to) return null;
          const active = activeId === fromId || activeId === toId;
          return (
            <g key={`${fromId}-${toId}`}>
              <line
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke="oklch(var(--primary) / 0.35)"
                strokeWidth="0.5"
                strokeDasharray="2 2"
                className="animate-flight-dash"
              />
              {active ? (
                <line
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke="oklch(var(--primary) / 0.9)"
                  strokeWidth="0.9"
                  strokeLinecap="round"
                />
              ) : null}
            </g>
          );
        })}

        {/* City nodes */}
        {cityNodes.map((node) => {
          const detail = nodeDetails[node.id];
          const active = activeId === node.id;
          const radius = 1.4 + (node.weight / 100) * 1.6;
          return (
            <g
              key={node.id}
              data-ocid="map_marker"
              onMouseEnter={() => setActiveId(node.id)}
              onMouseLeave={() => setActiveId(null)}
              onFocus={() => setActiveId(node.id)}
              onBlur={() => setActiveId(null)}
              className="cursor-pointer outline-none"
              tabIndex={0}
              aria-label={`${node.name} (${node.code}), index ${detail.index}, ${detail.trackedRoutes} tracked routes`}
            >
              <circle
                cx={node.x}
                cy={node.y}
                r={radius + 2.2}
                fill="oklch(var(--primary) / 0.18)"
                className="animate-pulse-glow"
              />
              <circle
                cx={node.x}
                cy={node.y}
                r={radius}
                fill={active ? "oklch(var(--primary))" : "oklch(var(--card))"}
                stroke="oklch(var(--primary))"
                strokeWidth="0.7"
              />
              <text
                x={node.x}
                y={node.y - radius - 2.4}
                textAnchor="middle"
                fontSize="3.4"
                fontWeight="700"
                fill="oklch(var(--foreground))"
                className="font-mono"
              >
                {node.code}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Hover tooltip */}
      {activeNode && activeDetail ? (
        <div
          data-ocid="map_tooltip"
          className="glass-strong pointer-events-none absolute z-10 w-52 -translate-x-1/2 rounded-xl p-3 shadow-elevated"
          style={{
            left: `${activeNode.x}%`,
            top: `${Math.max(6, activeNode.y - 4)}%`,
          }}
        >
          <div className="flex items-center justify-between gap-2">
            <p className="font-display text-sm font-semibold tracking-tight">
              {activeNode.name}
            </p>
            <span className="text-muted-foreground font-mono text-xs">
              {activeNode.code}
            </span>
          </div>
          <p className="text-muted-foreground text-xs">
            Airport · {activeNode.code}
          </p>
          <div className="mt-2.5 space-y-1.5 border-t border-border/60 pt-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Index</span>
              <span className="text-primary font-mono font-semibold">
                {activeDetail.index.toFixed(1)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Tracked routes</span>
              <span className="font-mono font-semibold">
                {activeDetail.trackedRoutes}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Last updated</span>
              <span className="font-mono font-semibold">
                {activeDetail.lastUpdated}
              </span>
            </div>
          </div>
        </div>
      ) : null}

      {/* Legend */}
      <div className="text-muted-foreground mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
        <span className="flex items-center gap-1.5">
          <span className="bg-primary size-2 rounded-full" />
          Hub city
        </span>
        <span className="flex items-center gap-1.5">
          <span className="border-primary/50 h-0 w-4 border-t border-dashed" />
          Tracked route
        </span>
        <span className="flex items-center gap-1.5">
          <Plane className="text-primary size-3.5" />
          Live fare feed
        </span>
      </div>
    </div>
  );
}
