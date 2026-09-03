import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <header data-ocid="page_header" className={cn("mb-8", className)}>
      {eyebrow ? (
        <p className="text-primary mb-2 text-xs font-semibold tracking-[0.2em] uppercase">
          {eyebrow}
        </p>
      ) : null}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {title}
          </h1>
          {description ? (
            <p className="text-muted-foreground mt-3 max-w-2xl text-base leading-relaxed">
              {description}
            </p>
          ) : null}
        </div>
        {actions ? (
          <div className="flex shrink-0 items-center gap-3">{actions}</div>
        ) : null}
      </div>
    </header>
  );
}
