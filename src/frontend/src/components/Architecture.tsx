import {
  Boxes,
  Cable,
  Cloud,
  Database,
  Filter,
  Gauge,
  Globe,
  Layers,
  type LucideIcon,
} from "lucide-react";

import { GlassCard } from "./GlassCard";
import { SectionHeading } from "./SectionHeading";

interface Layer {
  id: string;
  title: string;
  icon: LucideIcon;
  description: string;
  stack: string[];
}

const layers: Layer[] = [
  {
    id: "sources",
    title: "Sources",
    icon: Globe,
    description: "Permissioned airline & OTA fare feeds, GDS snapshots.",
    stack: ["Airlines", "OTAs", "GDS"],
  },
  {
    id: "connectors",
    title: "Connectors",
    icon: Cable,
    description: "Typed adapters that normalize each feed's schema.",
    stack: ["Python", "Pandas"],
  },
  {
    id: "collection",
    title: "Collection Layer",
    icon: Boxes,
    description: "Scheduled ingestion with retries and backoff.",
    stack: ["Celery", "Redis"],
  },
  {
    id: "normalize",
    title: "Normalize + Validate",
    icon: Filter,
    description: "Clean, dedupe, validate and flag outliers.",
    stack: ["Pandas", "Validation"],
  },
  {
    id: "storage",
    title: "PostgreSQL / Cache",
    icon: Database,
    description: "Relational store with hot-path caching.",
    stack: ["PostgreSQL", "Redis"],
  },
  {
    id: "index",
    title: "Index Engine",
    icon: Gauge,
    description: "Route & booking-window aggregation, Base-100 index.",
    stack: ["FastAPI", "Pandas"],
  },
  {
    id: "deliver",
    title: "Dashboard / API",
    icon: Cloud,
    description: "Serve the index to every surface.",
    stack: ["React", "FastAPI"],
  },
];

export function Architecture() {
  return (
    <section data-ocid="architecture_section" className="scroll-mt-24">
      <SectionHeading
        title="Tech Architecture"
        description="A modular, API-ready stack built to scale from prototype to production."
      />

      <GlassCard strong className="p-5 sm:p-6">
        <div className="flex flex-col gap-3">
          {layers.map((layer, i) => {
            const Icon = layer.icon;
            const isLast = i === layers.length - 1;
            return (
              <div key={layer.id} className="flex flex-col gap-3">
                <div
                  data-ocid={`architecture.layer.${i + 1}`}
                  className="flex flex-col gap-3 rounded-xl border border-border/60 bg-background/40 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="bg-gradient-primary text-primary-foreground flex size-10 shrink-0 items-center justify-center rounded-lg shadow-subtle">
                      <Icon className="size-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-display text-sm font-semibold tracking-tight">
                        {layer.title}
                      </h3>
                      <p className="text-muted-foreground text-xs leading-relaxed">
                        {layer.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-1.5">
                    {layer.stack.map((tech) => (
                      <span
                        key={tech}
                        className="border-primary/25 bg-primary/10 text-primary rounded-md border px-2 py-0.5 text-[11px] font-semibold"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                {!isLast ? (
                  <div className="flex items-center gap-2 pl-5">
                    <div className="bg-gradient-primary h-5 w-px opacity-40" />
                    <span className="text-muted-foreground/60 text-[10px] tracking-widest uppercase">
                      ↓
                    </span>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border/60 pt-4">
          <Layers className="text-primary size-4" />
          <span className="text-muted-foreground text-xs">
            Deployed with{" "}
            <span className="text-foreground font-medium">Docker</span> +{" "}
            <span className="text-foreground font-medium">Cloud</span> for
            reproducible, horizontally scalable ingestion.
          </span>
        </div>
      </GlassCard>
    </section>
  );
}
