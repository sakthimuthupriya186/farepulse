import { createRoute } from "@tanstack/react-router";
import { MapPin, Plane, Radar, Route, Timer } from "lucide-react";

import { DemoDataBanner } from "@/components/DemoDataBanner";
import { GlassCard } from "@/components/GlassCard";
import { IndiaMap } from "@/components/IndiaMap";
import { PageHeader } from "@/components/PageHeader";
import { SectionHeading } from "@/components/SectionHeading";
import { StatCard } from "@/components/StatCard";
import { cityNodes } from "@/lib/mockData";
import { rootRoute } from "./__root";

export const mapRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/map",
  component: MapPage,
});

const hubs = [
  { code: "DEL", name: "Delhi", routes: 42, index: 112.4 },
  { code: "BOM", name: "Mumbai", routes: 38, index: 108.9 },
  { code: "BLR", name: "Bengaluru", routes: 31, index: 104.2 },
  { code: "MAA", name: "Chennai", routes: 27, index: 106.7 },
  { code: "HYD", name: "Hyderabad", routes: 22, index: 101.5 },
  { code: "CCU", name: "Kolkata", routes: 18, index: 99.8 },
];

function MapPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Network Map"
        title="India Airfare Map"
        description="Explore the domestic airfare network across India's busiest hubs. Hover any city node to inspect its airport, price index, tracked routes, and last update time."
      />

      <DemoDataBanner />

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Hub Cities"
          value={String(cityNodes.length)}
          delta="Across the domestic network"
          icon={MapPin}
        />
        <StatCard
          label="Routes Tracked"
          value="120+"
          delta="City-pair fare samples"
          icon={Route}
        />
        <StatCard
          label="Feed Freshness"
          value="< 4 min"
          delta="Median observation age"
          icon={Timer}
        />
        <StatCard
          label="Coverage"
          value="87.6%"
          delta="Active city-pairs sampled"
          icon={Radar}
        />
      </div>

      <div className="mt-8">
        <SectionHeading
          title="Interactive Route Network"
          description="Hover a node to see its airport, index, tracked routes, and last updated time."
        />
        <GlassCard strong className="p-4 sm:p-6">
          <IndiaMap />
        </GlassCard>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <GlassCard className="p-6 lg:col-span-2">
          <SectionHeading
            title="How the map works"
            description="A live view of India's connected airfare network."
          />
          <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              Each glowing node represents a major domestic hub. Node size
              reflects relative traffic weight, and the dashed lines trace the
              city-pairs FAREPULSE actively tracks for fare movement.
            </p>
            <p>
              The index shown per node is the local Base-100 fare benchmark for
              that city — a snapshot of how average fares into and out of the
              hub are trending relative to the national baseline.
            </p>
            <p>
              Route coverage is refreshed continuously from GDS snapshots and
              web fare feeds. Hover any node to pull up its live airport
              details, tracked route count, and the last time its fare sample
              was refreshed.
            </p>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <SectionHeading title="Top hubs" description="By tracked routes" />
          <ul className="space-y-3">
            {hubs.map((hub, i) => (
              <li
                key={hub.code}
                data-ocid={`hub.item.${i + 1}`}
                className="flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <span className="bg-accent/10 text-primary flex size-8 items-center justify-center rounded-lg text-xs font-bold">
                    {hub.code}
                  </span>
                  <div>
                    <p className="text-sm font-medium">{hub.name}</p>
                    <p className="text-muted-foreground text-xs">
                      {hub.routes} routes
                    </p>
                  </div>
                </div>
                <span className="text-primary font-mono text-sm font-semibold">
                  {hub.index.toFixed(1)}
                </span>
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>

      <div className="mt-8">
        <GlassCard className="p-6">
          <div className="flex items-start gap-3">
            <span className="bg-gradient-primary text-primary-foreground flex size-9 shrink-0 items-center justify-center rounded-xl shadow-subtle">
              <Plane className="size-5" />
            </span>
            <div>
              <h3 className="font-display text-base font-semibold tracking-tight">
                Ready for live feeds
              </h3>
              <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                The map is wired to the demo data layer and is API-ready. Swap
                the per-node index, route counts, and timestamps for
                permissioned live fare feeds to go from prototype to production
                without reworking the interface.
              </p>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
