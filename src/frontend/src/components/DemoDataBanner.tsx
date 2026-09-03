import { Info } from "lucide-react";

import { demoDisclaimer } from "@/lib/mockData";

export function DemoDataBanner() {
  return (
    <div
      data-ocid="demo_data_banner"
      className="border-primary/30 bg-primary/5 text-primary flex items-center gap-2.5 rounded-xl border px-4 py-2.5 text-sm font-medium"
    >
      <Info className="size-4 shrink-0" />
      <span>{demoDisclaimer}</span>
    </div>
  );
}
