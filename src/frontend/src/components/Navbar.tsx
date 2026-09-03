import { Link } from "@tanstack/react-router";
import { Activity, Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";

export interface NavItem {
  label: string;
  to: string;
}

export const navItems: NavItem[] = [
  { label: "Home", to: "/" },
  { label: "Live Index", to: "/live-index" },
  { label: "Routes", to: "/routes" },
  { label: "Airlines", to: "/airlines" },
  { label: "Analytics", to: "/analytics" },
  { label: "Methodology", to: "/methodology" },
  { label: "Data Quality", to: "/data-quality" },
  { label: "API", to: "/api" },
  { label: "About", to: "/about" },
];

interface NavbarProps {
  onOpenSidebar: () => void;
}

export function Navbar({ onOpenSidebar }: NavbarProps) {
  return (
    <header
      data-ocid="navbar"
      className="bg-card/80 border-border/60 sticky top-0 z-40 border-b backdrop-blur-xl"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            data-ocid="brand_link"
            className="flex items-center gap-2.5"
          >
            <span className="bg-gradient-primary text-primary-foreground flex size-9 items-center justify-center rounded-xl shadow-subtle">
              <Activity className="size-5" />
            </span>
            <span className="font-display text-lg font-bold tracking-tight">
              <span className="text-gradient">FAREPULSE</span>
            </span>
          </Link>
          <span className="border-primary/40 text-primary hidden items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold tracking-widest uppercase sm:inline-flex">
            <span className="bg-primary size-1.5 animate-pulse-glow rounded-full" />
            Live
          </span>
        </div>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              data-ocid="nav_link"
              activeOptions={{ exact: item.to === "/" }}
              className="text-muted-foreground hover:text-foreground hover:bg-accent/60 rounded-lg px-3 py-2 text-sm font-medium transition-smooth [&.active]:text-foreground [&.active]:bg-accent/60"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <Button
            data-ocid="open_sidebar_button"
            variant="ghost"
            size="icon"
            aria-label="Open navigation menu"
            className="lg:hidden"
            onClick={onOpenSidebar}
          >
            <Menu className="size-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
