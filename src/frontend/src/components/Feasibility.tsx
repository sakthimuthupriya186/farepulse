import {
  BadgeCheck,
  type LucideIcon,
  Rocket,
  Scale,
  ShieldCheck,
} from "lucide-react";

import { GlassCard } from "./GlassCard";
import { SectionHeading } from "./SectionHeading";

interface Pillar {
  id: string;
  title: string;
  icon: LucideIcon;
  description: string;
}

const pillars: Pillar[] = [
  {
    id: "feasible",
    title: "Feasible Now",
    icon: Rocket,
    description:
      "Built on permissioned feeds and standard tooling — no exotic infrastructure required to stand up a working index today.",
  },
  {
    id: "scalable",
    title: "Scalable",
    icon: Scale,
    description:
      "Modular collection and index layers scale horizontally as more routes, carriers and booking windows are added.",
  },
  {
    id: "quality",
    title: "Data Quality",
    icon: BadgeCheck,
    description:
      "Every observation is normalized, deduplicated and validated before it can influence the index.",
  },
  {
    id: "auditable",
    title: "Auditability",
    icon: ShieldCheck,
    description:
      "Source, timestamp and weighting are recorded per observation so any index move can be traced to its inputs.",
  },
];

export function Feasibility() {
  return (
    <section data-ocid="feasibility_section" className="scroll-mt-24">
      <SectionHeading
        title="Feasibility & Trust"
        description="Why FAREPULSE is buildable, honest and defensible."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {pillars.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <GlassCard key={pillar.id} className="p-5">
              <div className="bg-gradient-primary text-primary-foreground flex size-11 items-center justify-center rounded-xl shadow-subtle">
                <Icon className="size-5" />
              </div>
              <h3 className="font-display mt-4 text-base font-semibold tracking-tight">
                {pillar.title}
              </h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                {pillar.description}
              </p>
            </GlassCard>
          );
        })}
      </div>

      <GlassCard
        glow
        data-ocid="feasibility_highlight"
        className="mt-4 flex flex-col items-start gap-3 p-6 sm:flex-row sm:items-center"
      >
        <div className="bg-gradient-primary text-primary-foreground flex size-12 shrink-0 items-center justify-center rounded-xl shadow-subtle">
          <ShieldCheck className="size-6" />
        </div>
        <div>
          <p className="font-display text-gradient text-lg font-bold tracking-tight">
            Never trade source compliance for data volume.
          </p>
          <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
            FAREPULSE only ingests feeds we are explicitly permitted to use.
            Coverage grows through more permissioned partners — never by
            scraping or bypassing a source's terms.
          </p>
        </div>
      </GlassCard>
    </section>
  );
}
