import { Link } from "@tanstack/react-router";
import { ArrowRight, BarChart3, BookOpen } from "lucide-react";

import { Button } from "@/components/ui/button";
import { IndiaMap } from "./IndiaMap";

export function HomeHero() {
  return (
    <section
      data-ocid="hero"
      className="relative overflow-hidden border-b border-border/50"
    >
      {/* Ambient glow orbs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -left-24 size-96 rounded-full bg-primary/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-1/3 size-96 rounded-full bg-accent/20 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:px-8 lg:py-20">
        <div className="animate-fade-up">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-primary">
            <span className="bg-primary size-1.5 animate-pulse-glow rounded-full" />
            SIH 2026 · Problem Statement 26056
          </div>

          <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            India&apos;s Airfare Pulse,{" "}
            <span className="text-gradient">in Real Time.</span>
          </h1>

          <p className="text-muted-foreground mt-5 max-w-xl text-base leading-relaxed sm:text-lg">
            FAREPULSE converts permissioned airline and OTA fare observations
            into a transparent, Base-100 Airfare Price Index for India — giving
            travellers, analysts, and policymakers a single trusted view of how
            domestic fares move.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" data-ocid="primary_button">
              <Link to="/live-index">
                Explore Live Index
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              data-ocid="secondary_button"
            >
              <Link to="/methodology">
                <BookOpen className="size-4" />
                View Methodology
              </Link>
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <BarChart3 className="size-3.5 text-primary" />
              Base-100 index across 8 metros
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="bg-primary size-1.5 rounded-full" />
              Built from realistic sample observations
            </span>
          </div>
        </div>

        <div className="animate-fade-up [animation-delay:150ms]">
          <div className="glass-strong rounded-2xl p-4 shadow-elevated sm:p-6">
            <div className="mb-3 flex items-center justify-between">
              <p className="font-display text-sm font-semibold tracking-tight">
                Domestic Route Network
              </p>
              <span className="border-primary/40 text-primary rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-widest uppercase">
                Demo
              </span>
            </div>
            <IndiaMap />
          </div>
        </div>
      </div>
    </section>
  );
}
