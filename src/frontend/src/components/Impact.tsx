import {
  Building2,
  FlaskConical,
  type LucideIcon,
  Plane,
  Users,
} from "lucide-react";

import { GlassCard } from "./GlassCard";
import { SectionHeading } from "./SectionHeading";

interface Audience {
  id: string;
  title: string;
  icon: LucideIcon;
  description: string;
}

const audiences: Audience[] = [
  {
    id: "government",
    title: "Government / MoSPI",
    icon: Building2,
    description:
      "A transparent, auditable airfare price index to inform policy, inflation tracking and consumer protection.",
  },
  {
    id: "researchers",
    title: "Researchers",
    icon: FlaskConical,
    description:
      "Route-level, booking-window-aware fare data with a documented methodology for reproducible analysis.",
  },
  {
    id: "industry",
    title: "Travel Industry",
    icon: Plane,
    description:
      "Benchmark pricing, spot demand shifts and plan capacity with a consistent, comparable index.",
  },
  {
    id: "travellers",
    title: "Travellers",
    icon: Users,
    description:
      "A clear, current view of fare trends to time purchases and understand what is driving prices.",
  },
];

const highlights = [
  "Higher Frequency",
  "Route-Level Visibility",
  "Transparent Methodology",
  "Auditable Data",
  "API-Ready Outputs",
];

export function Impact() {
  return (
    <section data-ocid="impact_section" className="scroll-mt-24">
      <SectionHeading
        title="Impact"
        description="Who benefits from a transparent, high-frequency airfare index."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {audiences.map((audience) => {
          const Icon = audience.icon;
          return (
            <GlassCard key={audience.id} className="p-5">
              <div className="bg-gradient-primary text-primary-foreground flex size-11 items-center justify-center rounded-xl shadow-subtle">
                <Icon className="size-5" />
              </div>
              <h3 className="font-display mt-4 text-base font-semibold tracking-tight">
                {audience.title}
              </h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                {audience.description}
              </p>
            </GlassCard>
          );
        })}
      </div>

      <GlassCard strong className="mt-4 p-5 sm:p-6">
        <p className="text-muted-foreground text-xs font-semibold tracking-[0.2em] uppercase">
          What FAREPULSE delivers
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {highlights.map((highlight) => (
            <span
              key={highlight}
              className="border-primary/25 bg-primary/10 text-primary rounded-full border px-3 py-1 text-sm font-semibold"
            >
              {highlight}
            </span>
          ))}
        </div>
      </GlassCard>
    </section>
  );
}
