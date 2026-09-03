import { Link } from "@tanstack/react-router";
import { Activity } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { navItems } from "./Navbar";

interface MobileSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileSidebar({ open, onOpenChange }: MobileSidebarProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="bg-card/95 w-72 backdrop-blur-xl">
        <SheetHeader className="border-border/60 border-b pb-4">
          <SheetTitle className="flex items-center gap-2.5">
            <span className="bg-gradient-primary text-primary-foreground flex size-9 items-center justify-center rounded-xl shadow-subtle">
              <Activity className="size-5" />
            </span>
            <span className="font-display text-lg font-bold tracking-tight">
              <span className="text-gradient">FAREPULSE</span>
            </span>
          </SheetTitle>
        </SheetHeader>

        <nav className="flex flex-col gap-1 px-2" aria-label="Mobile">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              data-ocid="mobile_nav_link"
              activeOptions={{ exact: item.to === "/" }}
              onClick={() => onOpenChange(false)}
              className="text-muted-foreground hover:text-foreground hover:bg-accent/60 rounded-lg px-3 py-2.5 text-sm font-medium transition-smooth [&.active]:text-foreground [&.active]:bg-accent/60"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
