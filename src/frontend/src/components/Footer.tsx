import { Activity } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      data-ocid="footer"
      className="border-border/60 bg-card/60 border-t backdrop-blur-xl"
    >
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <span className="bg-gradient-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg shadow-subtle">
                <Activity className="size-4" />
              </span>
              <span className="font-display text-base font-bold tracking-tight">
                <span className="text-gradient">FAREPULSE</span>
              </span>
            </div>
            <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
              India&apos;s Airfare Pulse, in Real Time.
            </p>
          </div>

          <div className="text-muted-foreground text-sm">
            <p className="font-display text-foreground mb-2 text-sm font-semibold tracking-wide uppercase">
              Smart India Hackathon 2026
            </p>
            <p>PS 26056 • Logic Loops</p>
          </div>
        </div>

        <div className="border-border/60 text-muted-foreground mt-8 flex flex-col gap-2 border-t pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} FAREPULSE. All rights reserved.</p>
          <p>
            Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== "undefined" ? window.location.hostname : "",
              )}`}
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:text-primary/80 transition-smooth"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
