import { Database, Filter, Gauge, type LucideIcon, Send } from "lucide-react";

import { GlassCard } from "./GlassCard";
import { SectionHeading } from "./SectionHeading";

interface Stage {
  id: string;
  step: string;
  title: string;
  icon: LucideIcon;
  description: string;
  detail: string[];
}

const stages: Stage[] = [
  {
    id: "collect",
    step: "01",
    title: "COLLECT",
    icon: Database,
    description: "Permissioned airline & OTA observations",
    detail: ["route", "date", "carrier", "timestamp"],
  },
  {
    id: "clean",
    step: "02",
    title: "CLEAN",
    icon: Filter,
    description: "Normalize base fare + taxes, dedupe, validate",
    detail: ["normalize", "deduplicate", "validate", "flag outliers"],
  },
  {
    id: "index",
    step: "03",
    title: "INDEX",
    icon: Gauge,
    description: "Route & booking-window aggregation",
    detail: ["route aggregation", "booking window", "Base-100 weighted index"],
  },
  {
    id: "deliver",
    step: "04",
    title: "DELIVER",
    icon: Send,
    description: "Surface the index everywhere",
    detail: ["dashboard", "analytics", "API"],
  },
];

export function Pipeline() {
  return (
    <section data-ocid="pipeline_section" className="scroll-mt-24">
      <SectionHeading
        title="The FAREPULSE Pipeline"
        description="Four stages turn raw observations into a trusted, auditable price index."
      />

      <div className="relative">
        {/* Connecting line */}
        <div
          aria-hidden
          className="bg-gradient-primary absolute top-10 right-0 left-0 hidden h-px opacity-40 lg:block"
        />
        <div
          aria-hidden
          className="bg-gradient-primary absolute top-10 left-0 hidden h-px w-1/4 animate-pulse-glow lg:block"
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stages.map((stage, i) => {
            const Icon = stage.icon;
            return (
              <GlassCard
                key={stage.id}
                data-ocid={`pipeline.stage.${i + 1}`}
                className="relative p-5"
              >
                <div className="flex items-center justify-between">
                  <div className="bg-gradient-primary text-primary-foreground flex size-12 items-center justify-center rounded-xl shadow-subtle">
                    <Icon className="size-6" />
                  </div>
                  <span className="font-mono text-muted-foreground text-xs tracking-widest">
                    {stage.step}
                  </span>
                </div>

                <h3 className="font-display text-gradient mt-4 text-lg font-bold tracking-tight">
                  {stage.title}
                </h3>
                <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                  {stage.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {stage.detail.map((tag) => (
                    <span
                      key={tag}
                      className="border-border/60 bg-muted/40 text-muted-foreground rounded-md border px-2 py-0.5 text-[11px] font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
