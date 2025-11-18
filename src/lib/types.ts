/**
 * Core data type definitions for TakeOverBench (simplified).
 *
 * This file defines the minimal, simplified types used across the app.
 * Threat models no longer reference capabilities/indicators/mitigations/references
 * or category/risk/time-horizon metadata. Instead each threat model directly
 * lists the benchmark IDs that are relevant to that threat.
 */

/* ---- Models ---- */
export interface Model {
  id: string;
  name: string;
  releaseDate: string; // ISO date (YYYY-MM-DD) preferred
  description: string;
  organization: string;
}

/* ---- Benchmark types ---- */
export interface BenchmarkScore {
  modelId: string;
  score: number;
  stdError: number | null;
  date?: string; // optional ISO date when the score was recorded
}

export type BenchmarkCategory =
  | "reasoning"
  | "coding"
  | "mathematics"
  | "science"
  | "multimodal"
  | "agentic";

export type ProjectionType = "s-curve" | "exponential" | "none";

export interface Benchmark {
  id: string;
  name: string;
  description: string;
  capabilityName: string; // human-readable capability name (e.g., "cybersecurity" for "CyBench")
  color: string; // hex or CSS color string used for chart/visualization
  scores: BenchmarkScore[];
  humanBaseline: number | null;
  expertBaseline: number | null;
  url: string | null;
  // category/etc. may be present in data but are optional in types
  category?: BenchmarkCategory | string;
  projectionType?: ProjectionType; // how to project future trends: s-curve for saturation, exponential for unbounded growth
}

/* ---- Simplified threat model ----
 *
 * A ThreatModel is now a small document describing the threat and listing the
 * benchmark ids that are relevant to assessing that threat. All other
 * capabilities/indicators/mitigations/references metadata have been removed
 * from the canonical type so the app can be simpler and rely on benchmarks.
 */
export interface ThreatModel {
  id: string;
  name: string;
  shortDescription?: string;
  longDescription?: string;
  // Direct list of benchmark ids the threat depends on or is measured by.
  // Clients should treat this array as the authoritative list of benchmarks to
  // show for the threat (e.g., charts, lists).
  benchmarks: string[];
}

/* ---- Risk / assessment (optional helper type) ----
 *
 * Keep a lightweight RiskAssessment shape if parts of the app expect it.
 * This is intentionally minimal and independent from the ThreatModel shape.
 */
export interface RiskAssessment {
  threatModelId: string;
  currentRisk: number; // 0-100
  // optional projected numbers if desired later
  projectedRisk2025?: number;
  projectedRisk2030?: number;
  // any bottlenecks can be expressed as a list of benchmark ids (rather than capability ids)
  bottleneckBenchmarks?: string[];
}
