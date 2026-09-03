import type {
  Airline,
  CityNode,
  DataQualityMetric,
  IndexPoint,
  IndexRange,
  IndexSeries,
  ObservationRow,
  RouteFare,
} from "./types";

/**
 * FAREPULSE demo data layer.
 *
 * All values below are realistic mock/demo data for the hackathon prototype.
 * They are NOT live feeds. Replace with permissioned live fare feeds before
 * production use.
 */

const HOUR_MS = 3_600_000;
const DAY_MS = 24 * HOUR_MS;

function buildSeries(
  range: IndexRange,
  startValue: number,
  volatility: number,
  drift: number,
  samples: number,
  stepMs: number,
): IndexSeries {
  const points: IndexPoint[] = [];
  const now = Date.now();
  let value = startValue;
  for (let i = samples - 1; i >= 0; i--) {
    const t = now - i * stepMs;
    const wave = Math.sin(i / 6) * volatility;
    const noise = (Math.random() - 0.5) * volatility;
    value = startValue + drift * (samples - i) + wave + noise;
    points.push({ timestamp: new Date(t).toISOString(), value: round(value) });
  }
  const first = points[0].value;
  const last = points[points.length - 1].value;
  return {
    range,
    current: last,
    change: round(last - first),
    changePct: round(((last - first) / first) * 100),
    points,
  };
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}

export const indexSeries: Record<IndexRange, IndexSeries> = {
  "24H": buildSeries("24H", 109.4, 0.9, 0.12, 48, HOUR_MS / 2),
  "7D": buildSeries("7D", 107.1, 1.4, 0.5, 28, 6 * HOUR_MS),
  "30D": buildSeries("30D", 104.2, 2.2, 1.8, 30, DAY_MS),
  "3M": buildSeries("3M", 100.0, 3.4, 4.1, 90, DAY_MS),
  "1Y": buildSeries("1Y", 96.5, 5.2, 8.9, 52, 7 * DAY_MS),
};

export const indexRanges: IndexRange[] = ["24H", "7D", "30D", "3M", "1Y"];

export const routeFares: RouteFare[] = [
  {
    id: "del-bom",
    origin: "DEL",
    originCity: "Delhi",
    destination: "BOM",
    destinationCity: "Mumbai",
    price: 5420,
    changePct: 1.5,
    flights: 32,
    trend: [104, 106, 105, 108, 110, 109, 112, 114, 113, 115],
  },
  {
    id: "blr-bom",
    origin: "BLR",
    originCity: "Bengaluru",
    destination: "BOM",
    destinationCity: "Mumbai",
    price: 4890,
    changePct: -0.7,
    flights: 28,
    trend: [112, 111, 110, 109, 108, 107, 106, 105, 104, 103],
  },
  {
    id: "bom-del",
    origin: "BOM",
    originCity: "Mumbai",
    destination: "DEL",
    destinationCity: "Delhi",
    price: 5560,
    changePct: 0.6,
    flights: 30,
    trend: [102, 103, 102, 104, 103, 105, 104, 105, 106, 107],
  },
  {
    id: "maa-blr",
    origin: "MAA",
    originCity: "Chennai",
    destination: "BLR",
    destinationCity: "Bengaluru",
    price: 3950,
    changePct: 2.1,
    flights: 24,
    trend: [98, 99, 101, 100, 102, 104, 103, 105, 106, 108],
  },
  {
    id: "maa-del",
    origin: "MAA",
    originCity: "Chennai",
    destination: "DEL",
    destinationCity: "Delhi",
    price: 5780,
    changePct: 0.9,
    flights: 21,
    trend: [101, 102, 101, 103, 104, 103, 105, 104, 105, 106],
  },
  {
    id: "hyd-maa",
    origin: "HYD",
    originCity: "Hyderabad",
    destination: "MAA",
    destinationCity: "Chennai",
    price: 4120,
    changePct: -1.2,
    flights: 19,
    trend: [107, 106, 105, 104, 103, 102, 101, 100, 99, 98],
  },
];

export const airlines: Airline[] = [
  {
    id: "6e",
    name: "IndiGo",
    code: "6E",
    marketShare: 61.4,
    avgFare: 4860,
    onTimePct: 82.1,
    changePct: 1.2,
    fleet: 380,
  },
  {
    id: "ai",
    name: "Air India",
    code: "AI",
    marketShare: 14.8,
    avgFare: 6120,
    onTimePct: 74.6,
    changePct: 2.4,
    fleet: 130,
  },
  {
    id: "qp",
    name: "Akasa Air",
    code: "QP",
    marketShare: 4.9,
    avgFare: 4580,
    onTimePct: 88.3,
    changePct: -0.8,
    fleet: 26,
  },
  {
    id: "sg",
    name: "SpiceJet",
    code: "SG",
    marketShare: 5.6,
    avgFare: 5210,
    onTimePct: 69.2,
    changePct: 3.1,
    fleet: 64,
  },
];

export const observations: ObservationRow[] = [
  {
    id: "obs-1",
    timestamp: new Date(Date.now() - 12 * 60000).toISOString(),
    route: "DEL → BOM",
    airline: "IndiGo",
    cabin: "Economy",
    fare: 5420,
    seats: 12,
    source: "GDS Snapshot",
  },
  {
    id: "obs-2",
    timestamp: new Date(Date.now() - 34 * 60000).toISOString(),
    route: "BOM → BLR",
    airline: "Air India",
    cabin: "Economy",
    fare: 4890,
    seats: 8,
    source: "GDS Snapshot",
  },
  {
    id: "obs-3",
    timestamp: new Date(Date.now() - 51 * 60000).toISOString(),
    route: "DEL → CCU",
    airline: "Akasa Air",
    cabin: "Economy",
    fare: 6100,
    seats: 21,
    source: "Web Fare Feed",
  },
  {
    id: "obs-4",
    timestamp: new Date(Date.now() - 78 * 60000).toISOString(),
    route: "MAA → BLR",
    airline: "SpiceJet",
    cabin: "Economy",
    fare: 3950,
    seats: 5,
    source: "GDS Snapshot",
  },
  {
    id: "obs-5",
    timestamp: new Date(Date.now() - 102 * 60000).toISOString(),
    route: "MAA → DEL",
    airline: "IndiGo",
    cabin: "Business",
    fare: 12480,
    seats: 3,
    source: "Web Fare Feed",
  },
  {
    id: "obs-6",
    timestamp: new Date(Date.now() - 145 * 60000).toISOString(),
    route: "HYD → MAA",
    airline: "Air India",
    cabin: "Economy",
    fare: 4120,
    seats: 16,
    source: "GDS Snapshot",
  },
];

export const dataQualityMetrics: DataQualityMetric[] = [
  {
    id: "dq-1",
    label: "Valid Observations",
    value: 98.4,
    pct: 98.4,
    status: "healthy",
    detail: "98.4% of captured fare observations passed all validation checks",
  },
  {
    id: "dq-2",
    label: "Duplicates",
    value: 96.2,
    pct: 96.2,
    status: "healthy",
    detail: "96.2% of duplicate fare records detected and de-duplicated",
  },
  {
    id: "dq-3",
    label: "Outliers",
    value: 99.2,
    pct: 99.2,
    status: "healthy",
    detail: "99.2% of anomalous fare spikes auto-flagged and excluded",
  },
  {
    id: "dq-4",
    label: "Missing Observations",
    value: 87.6,
    pct: 87.6,
    status: "warning",
    detail:
      "87.6% of expected observations captured; gaps remain on low-frequency routes",
  },
  {
    id: "dq-5",
    label: "Excluded Records",
    value: 72.3,
    pct: 72.3,
    status: "critical",
    detail:
      "72.3% of excluded records reviewed; one feed still emitting malformed rows",
  },
];

export const cityNodes: CityNode[] = [
  { id: "del", name: "Delhi", code: "DEL", x: 62, y: 22, weight: 100 },
  { id: "bom", name: "Mumbai", code: "BOM", x: 38, y: 52, weight: 92 },
  { id: "blr", name: "Bengaluru", code: "BLR", x: 52, y: 78, weight: 84 },
  { id: "maa", name: "Chennai", code: "MAA", x: 62, y: 74, weight: 78 },
  { id: "hyd", name: "Hyderabad", code: "HYD", x: 46, y: 60, weight: 66 },
  { id: "ccu", name: "Kolkata", code: "CCU", x: 82, y: 34, weight: 58 },
  { id: "pnq", name: "Pune", code: "PNQ", x: 34, y: 58, weight: 52 },
  { id: "cok", name: "Kochi", code: "COK", x: 48, y: 88, weight: 46 },
];

export const demoDisclaimer =
  "Demo Data – Replace with permissioned live fare feeds.";
