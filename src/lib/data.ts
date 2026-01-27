/**
 * Typed data access and helper functions (canonical data module).
 *
 * This file exposes:
 * - `benchmarks`, `models`, `threatModels` as typed arrays loaded from /data
 * - lookup helpers: `getBenchmarkById`, `getModelById`, `getThreatModelById`
 *
 * Capabilities have been removed from the data model. Threat models reference
 * benchmark ids directly (see `ThreatModel.benchmarks` in types). Risk
 * computations and capability-derived helpers are intentionally removed to
 * keep the data layer minimal and focused on benchmarks.
 */

import threatModelsJson from "../../data/threat_models.json";
import benchmarksJson from "../../data/benchmarks.json";
import benchmarksMetaJson from "../../data/benchmarks_meta.json";
import modelsJson from "../../data/models.json";
import type { Benchmark, ThreatModel, Model } from "./types";

/* ------------------------------ Utilities ------------------------------- */

/** FNV-1a 32-bit hash for strings */
function hashStringFnv1a(value: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

/** Small stable palette used when benchmark entries don't include a color */
const BENCHMARK_COLOR_PALETTE = [
  "#2563eb", // blue
  "#e11d48", // pink/red
  "#10b981", // green
  "#7c3aed", // purple
  "#f97316", // orange
  "#06b6d4", // cyan
  "#ef4444", // red
  "#f59e0b", // amber
  "#3b82f6", // light blue
  "#14b8a6", // teal
];

function pickColorForId(id: string): string {
  if (!id) return BENCHMARK_COLOR_PALETTE[0];
  const h = hashStringFnv1a(id);
  return BENCHMARK_COLOR_PALETTE[h % BENCHMARK_COLOR_PALETTE.length];
}

/* ------------------------------ Raw imports ----------------------------- */

const rawBenchmarks: any[] = benchmarksJson as any[];
const benchmarksMeta: any[] = benchmarksMetaJson as any[];
export const threatModels: ThreatModel[] = threatModelsJson as ThreatModel[];
export const models: Model[] = modelsJson as Model[];

/* --------------------------- Benchmark shaping -------------------------- */

/**
 * Per-benchmark transformers.
 * Each transformer receives the full array of raw numeric score values and
 * must return an array of normalized numbers in [0,1] of the same length.
 *
 * Add or adjust transforms here if you add benchmarks with other score scales.
 */
const transformers: Record<string, (rawScores: unknown[]) => number[]> = {
  // Example: convert permille (0-1000) -> fraction (0-1)
  frontiermatch: (rawScores) => {
    const nums = (rawScores ?? []).map((v) => (typeof v === "number" ? v : 0));
    return nums.map((n) => Math.max(0, Math.min(1, n / 1000)));
  },

  // forecast_bench: inverse min-max normalization (lower is better)
  forecast_bench: (rawScores) => {
    const nums = (rawScores ?? []).map((v) => (typeof v === "number" ? v : 0));
    if (nums.length === 0) return [];
    const min = 0;
    const max = Math.max(...nums, 0);
    if (max === min) return nums.map(() => 1);
    return nums.map((n) => {
      const v = 1 - (n - min) / (max - min);
      return Math.max(0, Math.min(1, v));
    });
  },

  // long_tasks (METR): minutes per task. Normalize against 8-hour workday (480 minutes)
  // to make early progress more visible while still showing room for growth.
  long_tasks: (rawScores) => {
    const nums = (rawScores ?? []).map((v) => (typeof v === "number" ? v : 0));
    const topMinutes = 40 * 60; // 480 minutes = 8-hour workday
    // const topMinutes = 24 * 60; // 480 minutes = 8-hour workday
    return nums.map((n) => Math.max(0, Math.min(1, n / topMinutes)));
  },
};

export const benchmarks: Benchmark[] = rawBenchmarks
  .map((b: any) => {
    // Find matching metadata
    const meta = benchmarksMeta.find((m: any) => m.id === b.id);

    const transformer = transformers[b.id];

    const normalizedScores = (() => {
      const rawScoresArray = (b.scores ?? []).map((s: any) => s?.score);
      if (typeof transformer === "function") {
        const transformed = transformer(rawScoresArray);
        return (b.scores ?? []).map((s: any, i: number) => ({
          ...s,
          score: transformed && i < transformed.length ? transformed[i] : null,
        }));
      } else {
        return (b.scores ?? []).map((s: any) => ({ ...s, score: s?.score }));
      }
    })();

    return {
      id: b.id,
      name: meta?.name ?? b.name,
      description: meta?.description ?? b.description,
      capabilityName: meta?.capabilityName ?? b.capabilityName ?? b.name,
      capabilityDefinition: meta?.capabilityDefinition,
      motivation: meta?.motivation,
      color: meta?.color ?? b.color ?? pickColorForId(b.id),
      scores: normalizedScores,
      humanBaseline: meta?.humanBaseline ?? b.humanBaseline ?? null,
      expertBaseline: meta?.expertBaseline ?? b.expertBaseline ?? null,
      url: meta?.url ?? b.url ?? null,
      category: meta?.category ?? b.category ?? null,
      projectionType: meta?.projectionType ?? b.projectionType ?? "s-curve",
    } as Benchmark;
  })
  .filter(Boolean) as Benchmark[];

/* ------------------------------ Lookups -------------------------------- */

export function getBenchmarkById(id: string): Benchmark | undefined {
  return benchmarks.find((b) => b.id === id);
}

export function getModelById(id: string): Model | undefined {
  return models.find((m) => m.id === id);
}

export function getThreatModelById(id: string): ThreatModel | undefined {
  return threatModels.find((t) => t.id === id);
}

/* ------------------------ Benchmark-derived helpers --------------------- */

/**
 * Derive a numeric capability level (0-100) from a list of benchmark ids.
 *
 * Strategy:
 * - For each benchmark id, find the most recent numeric score available.
 *   We determine "most recent" by mapping benchmark scores' modelId to model
 *   release dates and picking the score whose model has the latest releaseDate.
 * - Convert normalized values in [0,1] to percentages (0-100). If a score looks
 *   already in percent (>1) we use it directly.
 * - Average the numeric scores across all benchmarks to produce the capability level.
 *
 * Returns 0 if there are no valid scores.
 */
// computeCapabilityLevelFromBenchmarks removed.
// Capability-level derivation from benchmarks is no longer performed in the
// data layer. Keep benchmark lookups and charting responsibilities simple; any
// higher-level risk or capability computations should be done outside this file
// if needed.

/* ------------------------- Threat risk calculation ---------------------- */

/**
 * Calculate a simple normalized risk score (0-100) for a threat model based
 * on the current benchmark-derived capability levels and required capability thresholds.
 *
 * Scoring approach:
 * - Each required capability contributes a value in [0,1] based on how far
 *   currentLevel is above the minimum threshold (with a small buffer).
 * - Contributions are weighted by importance: necessary=3, important=2, helpful=1.
 * - Final score is the weighted average scaled to 0-100 and clamped to 100.
 */
// calculateThreatRisk removed.
// The project no longer computes a consolidated threat risk in the data layer.
// If you need a risk metric, compute it from the UI or a separate module that
// consumes the benchmark scores and threat definitions.
