export type IndexRange = "24H" | "7D" | "30D" | "3M" | "1Y";

export interface IndexPoint {
  /** ISO timestamp for the sample */
  timestamp: string;
  /** Base-100 index value */
  value: number;
}

export interface IndexSeries {
  range: IndexRange;
  /** Current (latest) index value */
  current: number;
  /** Absolute change vs. the start of the range */
  change: number;
  /** Percentage change vs. the start of the range */
  changePct: number;
  points: IndexPoint[];
}

export interface RouteFare {
  id: string;
  origin: string;
  originCity: string;
  destination: string;
  destinationCity: string;
  /** Average one-way fare in INR */
  price: number;
  /** Percentage change vs. previous period */
  changePct: number;
  /** Number of daily flights observed */
  flights: number;
  /** Trend sparkline values (indexed) */
  trend: number[];
}

export interface Airline {
  id: string;
  name: string;
  code: string;
  /** Market share percentage */
  marketShare: number;
  /** Average fare across its network */
  avgFare: number;
  /** On-time performance percentage */
  onTimePct: number;
  /** Fare change vs. previous period */
  changePct: number;
  /** Fleet size */
  fleet: number;
}

export interface ObservationRow {
  id: string;
  timestamp: string;
  route: string;
  airline: string;
  cabin: "Economy" | "Business" | "Premium Economy";
  fare: number;
  seats: number;
  source: string;
}

export interface DataQualityMetric {
  id: string;
  label: string;
  value: number;
  /** 0-100 */
  pct: number;
  status: "healthy" | "warning" | "critical";
  detail: string;
}

export interface CityNode {
  id: string;
  name: string;
  code: string;
  /** Normalized x coordinate 0-100 for the map */
  x: number;
  /** Normalized y coordinate 0-100 for the map */
  y: number;
  /** Relative traffic weight */
  weight: number;
}
