import { createRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  FileSearch,
  type LucideIcon,
  Scale,
  ShieldCheck,
} from "lucide-react";

import { Architecture } from "@/components/Architecture";
import { DemoDataBanner } from "@/components/DemoDataBanner";
import { Feasibility } from "@/components/Feasibility";
import { GlassCard } from "@/components/GlassCard";
import { Impact } from "@/components/Impact";
import { PageHeader } from "@/components/PageHeader";
import { Pipeline } from "@/components/Pipeline";
import { SectionHeading } from "@/components/SectionHeading";
import { rootRoute } from "./__root";

export const methodologyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/methodology",
  component: MethodologyPage,
});

const chain = [
  "Data Collection",
  "Cleaning",
  "Normalization",
  "Deduplication",
  "Validation",
  "Outlier Detection",
  "Route Aggregation",
  "Booking Window Aggregation",
  "Base-100 Weighted Index",
  "Dashboard / API",
];

interface Disclosure {
  id: string;
  title: string;
  icon: LucideIcon;
  points: string[];
}

const disclosures: Disclosure[] = [
  {
    id: "coverage",
    title: "Coverage",
    icon: FileSearch,
    points: [
      "Index covers major domestic trunk routes across India.",
      "Each route is reported at the carrier and booking-window level.",
      "Coverage grows as more permissioned feeds come online.",
    ],
  },
  {
    id: "exclusions",
    title: "Exclusions",
    icon: ShieldCheck,
    points: [
      "Promotional, error and non-public fares are excluded.",
      "Charter and non-scheduled operations are not indexed.",
      "Routes without sufficient observations are withheld.",
    ],
  },
  {
    id: "weighting",
    title: "Weighting",
    icon: Scale,
    points: [
      "Routes are weighted by observed passenger volume.",
      "Booking windows are weighted by share of bookings.",
      "The Base-100 index is re-based at the start of each range.",
    ],
  },
  {
    id: "permissions",
    title: "Source Permissions",
    icon: CheckCircle2,
    points: [
      "Only explicitly permissioned feeds are ingested.",
      "Every observation records its source and timestamp.",
      "No scraping — compliance is never traded for volume.",
    ],
  },
];

function MethodologyPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Methodology"
        title="How FAREPULSE Works"
        description="The data sources, normalization, and index construction behind every number — documented end to end."
      />

      <DemoDataBanner />

      <div className="mt-10 space-y-14">
        <Pipeline />

        <Architecture />

        {/* Methodology chain */}
        <section data-ocid="chain_section" className="scroll-mt-24">
          <SectionHeading
            title="The Full Chain"
            description="Ten steps turn raw observations into a trusted index."
          />
          <GlassCard strong className="p-5 sm:p-6">
            <ol className="flex flex-col gap-2">
              {chain.map((step, i) => (
                <li key={step} className="flex items-center gap-3">
                  <span className="font-mono text-primary w-6 shrink-0 text-right text-xs font-bold">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-foreground min-w-0 flex-1 text-sm font-medium">
                    {step}
                  </span>
                  {i < chain.length - 1 ? (
                    <ArrowRight className="text-muted-foreground/50 size-4 shrink-0" />
                  ) : null}
                </li>
              ))}
            </ol>
          </GlassCard>
        </section>

        {/* Transparency disclosures */}
        <section data-ocid="disclosures_section" className="scroll-mt-24">
          <SectionHeading
            title="Transparency & Auditability"
            description="What the index covers, what it excludes, how it is weighted, and how sources are permissioned."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {disclosures.map((disclosure) => {
              const Icon = disclosure.icon;
              return (
                <GlassCard key={disclosure.id} className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-primary text-primary-foreground flex size-10 shrink-0 items-center justify-center rounded-xl shadow-subtle">
                      <Icon className="size-5" />
                    </div>
                    <h3 className="font-display text-base font-semibold tracking-tight">
                      {disclosure.title}
                    </h3>
                  </div>
                  <ul className="mt-3 space-y-2">
                    {disclosure.points.map((point) => (
                      <li
                        key={point}
                        className="text-muted-foreground flex items-start gap-2 text-sm leading-relaxed"
                      >
                        <span className="bg-primary/20 text-primary mt-1.5 size-1.5 shrink-0 rounded-full" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              );
            })}
          </div>
        </section>

        <Feasibility />

        <Impact />
      </div>
    </div>
  );
}
