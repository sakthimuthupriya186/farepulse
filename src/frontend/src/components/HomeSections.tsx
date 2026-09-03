import { Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Code2,
  Plane,
  Route,
  ShieldCheck,
  Waves,
} from "lucide-react";

import { GlassCard } from "@/components/GlassCard";
import { SectionHeading } from "@/components/SectionHeading";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import {
  dataQualityMetrics,
  indexSeries,
  observations,
  routeFares,
} from "@/lib/mockData";

const avgQuality =
  dataQualityMetrics.reduce((sum, m) => sum + m.pct, 0) /
  dataQualityMetrics.length;

const ctaCards = [
  {
    to: "/routes",
    icon: Route,
    title: "Explore Routes",
    description:
      "Compare average one-way fares across India's busiest city-pairs.",
    cta: "View Routes",
  },
  {
    to: "/airlines",
    icon: Plane,
    title: "Carrier Intelligence",
    description:
      "Market share, average fares, and on-time performance by airline.",
    cta: "View Airlines",
  },
  {
    to: "/analytics",
    icon: BarChart3,
    title: "Market Analytics",
    description:
      "Deep-dive into fare seasonality, volatility, and demand signals.",
    cta: "Open Analytics",
  },
  {
    to: "/api",
    icon: Code2,
    title: "Developer API",
    description:
      "Programmatic access to FAREPULSE index and route data for your apps.",
    cta: "Read the API",
  },
];

export function HomeSections() {
  const series = indexSeries["24H"];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Intro */}
      <section data-ocid="section" className="mb-14">
        <SectionHeading
          title="A transparent pulse for Indian airfares"
          description="One number, continuously updated, that tells you how domestic fares are moving."
        />
        <div className="grid gap-4 md:grid-cols-3">
          <GlassCard className="p-6">
            <div className="bg-gradient-primary text-primary-foreground mb-4 flex size-11 items-center justify-center rounded-xl shadow-subtle">
              <Activity className="size-5" />
            </div>
            <h3 className="font-display text-lg font-semibold tracking-tight">
              Base-100 Index
            </h3>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
              Every fare observation is normalized and weighted into a single
              index, re-based to 100 at the start of each range for stable,
              apples-to-apples comparison.
            </p>
          </GlassCard>
          <GlassCard className="p-6">
            <div className="bg-gradient-primary text-primary-foreground mb-4 flex size-11 items-center justify-center rounded-xl shadow-subtle">
              <ShieldCheck className="size-5" />
            </div>
            <h3 className="font-display text-lg font-semibold tracking-tight">
              Permissioned Feeds
            </h3>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
              Fares are aggregated from permissioned airline and OTA sources,
              normalized to a consistent cabin and booking-window basis before
              entering the index.
            </p>
          </GlassCard>
          <GlassCard className="p-6">
            <div className="bg-gradient-primary text-primary-foreground mb-4 flex size-11 items-center justify-center rounded-xl shadow-subtle">
              <Waves className="size-5" />
            </div>
            <h3 className="font-display text-lg font-semibold tracking-tight">
              Continuously Updated
            </h3>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
              The index refreshes continuously from live fare feeds, so the
              headline number always reflects the latest market movement.
            </p>
          </GlassCard>
        </div>
      </section>

      {/* Live stats preview */}
      <section data-ocid="section" className="mb-14">
        <SectionHeading
          title="Live index at a glance"
          description="A snapshot of the current market state across the domestic network."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard
            label="Current Index"
            value={series.current.toFixed(1)}
            icon={Activity}
            delta={
              <span className="text-primary">
                +{series.changePct.toFixed(1)}% (24H)
              </span>
            }
          />
          <StatCard
            label="% Change"
            value={`${series.changePct >= 0 ? "+" : ""}${series.changePct.toFixed(1)}%`}
            icon={BarChart3}
            delta={<span className="text-muted-foreground">vs. 24H ago</span>}
          />
          <StatCard
            label="Routes Tracked"
            value={`${routeFares.length * 20}+`}
            icon={Route}
            delta={
              <span className="text-muted-foreground">Across 8 metros</span>
            }
          />
          <StatCard
            label="Observations"
            value={`${observations.length * 8000}K`}
            icon={Waves}
            delta={
              <span className="text-muted-foreground">GDS + web feeds</span>
            }
          />
          <StatCard
            label="Data Quality"
            value={`${avgQuality.toFixed(1)}%`}
            icon={ShieldCheck}
            delta={<span className="text-success">Healthy</span>}
          />
        </div>
      </section>

      {/* CTA cards */}
      <section data-ocid="section">
        <SectionHeading
          title="Go deeper"
          description="Explore the full FAREPULSE toolkit — from route pricing to developer APIs."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ctaCards.map((card) => (
            <GlassCard key={card.to} className="flex flex-col p-6">
              <div className="bg-gradient-primary text-primary-foreground mb-4 flex size-11 items-center justify-center rounded-xl shadow-subtle">
                <card.icon className="size-5" />
              </div>
              <h3 className="font-display text-lg font-semibold tracking-tight">
                {card.title}
              </h3>
              <p className="text-muted-foreground mt-2 flex-1 text-sm leading-relaxed">
                {card.description}
              </p>
              <Button
                asChild
                variant="ghost"
                className="mt-4 justify-start px-0 text-primary hover:bg-transparent hover:text-primary"
                data-ocid="link"
              >
                <Link to={card.to}>
                  {card.cta}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </GlassCard>
          ))}
        </div>
      </section>
    </div>
  );
}
