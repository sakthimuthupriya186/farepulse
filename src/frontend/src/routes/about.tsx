import { createRoute } from "@tanstack/react-router";
import {
  Activity,
  BarChart3,
  Compass,
  Eye,
  Gauge,
  Globe2,
  Radar,
  Rocket,
  ShieldCheck,
  Target,
  Users,
} from "lucide-react";

import { DemoDataBanner } from "@/components/DemoDataBanner";
import { GlassCard } from "@/components/GlassCard";
import { PageHeader } from "@/components/PageHeader";
import { SectionHeading } from "@/components/SectionHeading";
import { StatCard } from "@/components/StatCard";
import { rootRoute } from "./__root";

const pillars = [
  {
    icon: Radar,
    title: "Transparent",
    description:
      "Every index value is traceable to the underlying fare observations, with sources, timestamps, and normalization steps published openly.",
  },
  {
    icon: Gauge,
    title: "High-Frequency",
    description:
      "Fares are sampled continuously from permissioned airline and OTA feeds, so the index reflects how prices actually move hour by hour.",
  },
  {
    icon: BarChart3,
    title: "Base-100 Index",
    description:
      "A weighted geometric mean of route-level fare indices, re-based to 100 at the start of each range for stable, apples-to-apples comparison.",
  },
];

const valueProps = [
  {
    icon: Compass,
    title: "For Travellers",
    description:
      "See whether fares are trending up or down before you book, and time your purchase with confidence instead of guessing.",
  },
  {
    icon: Activity,
    title: "For Analysts",
    description:
      "Access clean, normalized fare series and route-level deltas to model demand, seasonality, and competitive dynamics.",
  },
  {
    icon: Globe2,
    title: "For Policymakers",
    description:
      "Gain an independent, data-driven view of domestic airfare movements to inform consumer-protection and market oversight decisions.",
  },
];

const team = [
  {
    role: "Product & Strategy",
    name: "Logic Loops",
    description:
      "A multidisciplinary team of engineers, designers, and data analysts building India's airfare intelligence layer.",
  },
  {
    role: "Engineering",
    name: "Full-Stack & Data",
    description:
      "React + TypeScript frontend, Motoko canister backend, and a modular, API-ready data pipeline built for the hackathon.",
  },
  {
    role: "Design",
    name: "Flight Deck Aesthetic",
    description:
      "A futuristic aviation command-center interface — glassmorphism, cyan/blue gradients, and premium typography.",
  },
];

const stats = [
  { label: "Routes Tracked", value: "6+", icon: Globe2 },
  { label: "Airlines Covered", value: "4", icon: Users },
  { label: "Feed Freshness", value: "<4m", icon: Activity },
  { label: "Index Base", value: "100", icon: Gauge },
];

export const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="About"
        title="About FAREPULSE"
        description="India's Airfare Pulse, in Real Time — a transparent, high-frequency Base-100 Airfare Price Index built from permissioned airline and OTA fare observations."
      />

      <div className="mb-8">
        <DemoDataBanner />
      </div>

      {/* What it is */}
      <section className="mb-12">
        <SectionHeading
          title="What is FAREPULSE?"
          description="A mission to make India's domestic airfare market legible."
        />
        <div className="grid gap-4 lg:grid-cols-3">
          <GlassCard strong glow className="p-6 lg:col-span-2">
            <div className="flex items-start gap-4">
              <div className="bg-gradient-primary text-primary-foreground flex size-11 shrink-0 items-center justify-center rounded-xl shadow-subtle">
                <Rocket className="size-5" />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold tracking-tight">
                  The Airfare Price Index for India
                </h3>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  FAREPULSE is a transparent, high-frequency Base-100 Airfare
                  Price Index for India, built from permissioned airline and OTA
                  fare observations. Instead of a single headline number, it
                  surfaces how domestic fares move across routes, airlines, and
                  time — giving travellers, analysts, and policymakers a clear,
                  independent view of the market.
                </p>
                <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                  Every observation is normalized to a consistent cabin and
                  booking-window basis, then aggregated into a weighted
                  geometric mean. The result is a stable, comparable index that
                  updates continuously as new fare data arrives.
                </p>
              </div>
            </div>
          </GlassCard>

          <div className="grid gap-4">
            {stats.map((stat) => (
              <StatCard
                key={stat.label}
                label={stat.label}
                value={stat.value}
                icon={stat.icon}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="mb-12">
        <SectionHeading
          title="Built on Three Pillars"
          description="The principles that shape every number we publish."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {pillars.map((pillar) => (
            <GlassCard key={pillar.title} className="p-6">
              <div className="bg-gradient-primary text-primary-foreground flex size-11 items-center justify-center rounded-xl shadow-subtle">
                <pillar.icon className="size-5" />
              </div>
              <h3 className="font-display mt-4 text-lg font-semibold tracking-tight">
                {pillar.title}
              </h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                {pillar.description}
              </p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Value proposition */}
      <section className="mb-12">
        <SectionHeading
          title="Who It's For"
          description="One index, many ways to use it."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {valueProps.map((prop) => (
            <GlassCard key={prop.title} className="p-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-primary text-primary-foreground flex size-10 shrink-0 items-center justify-center rounded-xl shadow-subtle">
                  <prop.icon className="size-5" />
                </div>
                <h3 className="font-display text-base font-semibold tracking-tight">
                  {prop.title}
                </h3>
              </div>
              <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                {prop.description}
              </p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="mb-12">
        <SectionHeading title="Our Mission" description="Why we built this." />
        <GlassCard className="p-6">
          <div className="flex items-start gap-4">
            <div className="bg-gradient-primary text-primary-foreground flex size-11 shrink-0 items-center justify-center rounded-xl shadow-subtle">
              <Target className="size-5" />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold tracking-tight">
                Bring transparency to India's airfare market
              </h3>
              <p className="text-muted-foreground mt-2 max-w-3xl text-sm leading-relaxed">
                Airfares in India are notoriously opaque — prices shift by the
                hour and vary wildly by route, airline, and booking window.
                FAREPULSE exists to change that. By aggregating permissioned
                fare observations into a transparent, continuously updated
                index, we give everyone a shared, data-driven picture of how
                prices move. Our mission is to make that picture the default way
                India understands its domestic airfare market.
              </p>
            </div>
          </div>
        </GlassCard>
      </section>

      {/* Team + context */}
      <section className="mb-12">
        <SectionHeading
          title="The Team"
          description="Built by Logic Loops for the Smart India Hackathon 2026."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {team.map((member) => (
            <GlassCard key={member.role} className="p-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-primary text-primary-foreground flex size-10 shrink-0 items-center justify-center rounded-xl shadow-subtle">
                  <Users className="size-5" />
                </div>
                <div>
                  <p className="text-primary text-xs font-semibold tracking-wide uppercase">
                    {member.role}
                  </p>
                  <h3 className="font-display text-base font-semibold tracking-tight">
                    {member.name}
                  </h3>
                </div>
              </div>
              <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                {member.description}
              </p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Hackathon context */}
      <section>
        <SectionHeading
          title="Smart India Hackathon 2026"
          description="Problem Statement 26056 • Team Logic Loops"
        />
        <GlassCard className="p-6">
          <div className="flex items-start gap-4">
            <div className="bg-gradient-primary text-primary-foreground flex size-11 shrink-0 items-center justify-center rounded-xl shadow-subtle">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold tracking-tight">
                A hackathon prototype with production intent
              </h3>
              <p className="text-muted-foreground mt-2 max-w-3xl text-sm leading-relaxed">
                FAREPULSE is our submission for Smart India Hackathon 2026,
                Problem Statement 26056, built by team Logic Loops. The
                prototype demonstrates the full vision — a transparent,
                high-frequency airfare index — with realistic demo data. The
                architecture is modular and API-ready, designed to plug into
                permissioned live fare feeds for production deployment.
              </p>
              <div className="mt-4">
                <DemoDataBanner />
              </div>
            </div>
          </div>
        </GlassCard>
      </section>
    </div>
  );
}
