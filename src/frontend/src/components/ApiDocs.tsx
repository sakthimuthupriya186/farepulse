import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Check,
  Copy,
  FileJson,
  type Globe,
  Plane,
  Route,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { GlassCard } from "./GlassCard";
import { SectionHeading } from "./SectionHeading";

type HttpMethod = "GET";

interface EndpointSample {
  request: string;
  response: string;
}

interface Endpoint {
  id: string;
  method: HttpMethod;
  path: string;
  title: string;
  description: string;
  icon: typeof Globe;
  sample: EndpointSample;
}

const endpoints: Endpoint[] = [
  {
    id: "index",
    method: "GET",
    path: "/api/index",
    title: "Base-100 Airfare Price Index",
    description:
      "Returns the current Base-100 Airfare Price Index value, its change over the selected range, and the underlying time series of index points.",
    icon: TrendingUp,
    sample: {
      request: `GET /api/index?range=7D&base=100
Accept: application/json`,
      response: `{
  "range": "7D",
  "base": 100,
  "current": 112.4,
  "change": 5.3,
  "changePct": 4.95,
  "series": [
    {
      "timestamp": "2026-09-02T09:30:00.000Z",
      "index": 110.2
    },
    {
      "timestamp": "2026-09-02T10:30:00.000Z",
      "index": 111.1
    },
    {
      "timestamp": "2026-09-02T11:30:00.000Z",
      "index": 112.4
    }
  ]
}`,
    },
  },
  {
    id: "routes",
    method: "GET",
    path: "/api/routes",
    title: "Route Fare Snapshot",
    description:
      "Returns the latest average fare, price delta, and flight count for each tracked city-pair route.",
    icon: Route,
    sample: {
      request: `GET /api/routes?limit=10&sort=changePct
Accept: application/json`,
      response: `{
  "count": 6,
  "routes": [
    {
      "route": "DEL → BOM",
      "origin": "DEL",
      "destination": "BOM",
      "carrier": "IndiGo",
      "fare": 5420,
      "changePct": 1.5,
      "flights": 32,
      "timestamp": "2026-09-02T11:30:00.000Z"
    },
    {
      "route": "MAA → BLR",
      "origin": "MAA",
      "destination": "BLR",
      "carrier": "SpiceJet",
      "fare": 3950,
      "changePct": 2.1,
      "flights": 24,
      "timestamp": "2026-09-02T11:30:00.000Z"
    }
  ]
}`,
    },
  },
  {
    id: "airlines",
    method: "GET",
    path: "/api/airlines",
    title: "Airline Market Metrics",
    description:
      "Returns per-airline market share, average fare, on-time performance, and fleet size for the tracked carriers.",
    icon: Plane,
    sample: {
      request: `GET /api/airlines?sort=marketShare
Accept: application/json`,
      response: `{
  "count": 4,
  "airlines": [
    {
      "carrier": "IndiGo",
      "code": "6E",
      "marketShare": 61.4,
      "avgFare": 4860,
      "onTimePct": 82.1,
      "fleet": 380,
      "timestamp": "2026-09-02T11:30:00.000Z"
    },
    {
      "carrier": "Air India",
      "code": "AI",
      "marketShare": 14.8,
      "avgFare": 6120,
      "onTimePct": 74.6,
      "fleet": 130,
      "timestamp": "2026-09-02T11:30:00.000Z"
    }
  ]
}`,
    },
  },
  {
    id: "trends",
    method: "GET",
    path: "/api/trends",
    title: "Fare Trend Series",
    description:
      "Returns historical fare trend points for a route or across the market, useful for charting and anomaly detection.",
    icon: ArrowDownToLine,
    sample: {
      request: `GET /api/trends?route=DEL-BOM&range=30D
Accept: application/json`,
      response: `{
  "route": "DEL → BOM",
  "range": "30D",
  "points": [
    {
      "timestamp": "2026-08-03T00:00:00.000Z",
      "index": 104.0,
      "fare": 5210
    },
    {
      "timestamp": "2026-08-10T00:00:00.000Z",
      "index": 108.0,
      "fare": 5340
    },
    {
      "timestamp": "2026-08-17T00:00:00.000Z",
      "index": 112.0,
      "fare": 5420
    }
  ]
}`,
    },
  },
];

function CodeBlock({
  label,
  code,
  icon: Icon,
}: {
  label: string;
  code: string;
  icon: typeof Globe;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-border/70 bg-background/60">
      <div className="flex items-center justify-between gap-3 border-b border-border/70 px-4 py-2">
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <Icon className="size-3.5" />
          <span>{label}</span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          data-ocid="copy_button"
          aria-label={`Copy ${label}`}
          className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition-smooth focus-visible:outline-2 focus-visible:outline-ring"
        >
          {copied ? (
            <>
              <Check className="size-3.5 text-success" />
              <span className="text-success">Copied</span>
            </>
          ) : (
            <>
              <Copy className="size-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="font-mono overflow-x-auto p-4 text-[13px] leading-relaxed text-foreground/90">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function EndpointCard({ endpoint }: { endpoint: Endpoint }) {
  const Icon = endpoint.icon;
  return (
    <GlassCard
      data-ocid={`endpoint.${endpoint.id}`}
      className="flex flex-col gap-5 p-6"
    >
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <span
            data-ocid={`endpoint.${endpoint.id}.method`}
            className="bg-gradient-primary text-primary-foreground rounded-md px-2.5 py-1 font-mono text-xs font-bold tracking-wide"
          >
            {endpoint.method}
          </span>
          <code className="font-mono text-sm font-semibold text-foreground">
            {endpoint.path}
          </code>
        </div>
        <div className="flex items-start gap-3">
          <div className="bg-primary/10 text-primary mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg">
            <Icon className="size-[18px]" />
          </div>
          <div className="min-w-0">
            <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">
              {endpoint.title}
            </h3>
            <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
              {endpoint.description}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <CodeBlock
          label="Request"
          code={endpoint.sample.request}
          icon={ArrowUpFromLine}
        />
        <CodeBlock
          label="Response"
          code={endpoint.sample.response}
          icon={FileJson}
        />
      </div>
    </GlassCard>
  );
}

export function ApiDocs() {
  return (
    <div className="flex flex-col gap-6">
      <SectionHeading
        title="Endpoints"
        description="Four read-only endpoints expose the FAREPULSE index, route, airline, and trend data. All responses are JSON."
      />
      <div className="grid gap-6">
        {endpoints.map((endpoint) => (
          <EndpointCard key={endpoint.id} endpoint={endpoint} />
        ))}
      </div>
    </div>
  );
}
