/**
 * Typed data access and helper functions (canonical data module).
 *
 * This file imports JSON data from the local `src/lib/data` folder (copied into
 * the source tree) and narrows them to the appropriate TypeScript types exported
 * from `./types`.
 *
 * Other modules should import from `$lib/data` (this file).
 */

import capabilitiesJson from "../../data/capabilities.json";
import threatModelsJson from "../../data/threat_models.json";
import benchmarksJson from "../../data/benchmarks.json";
import modelsJson from "../../data/models.json";
import type { Benchmark, Capability, ThreatModel, Model } from "./types";

/**
 * Narrow raw JSON imports to typed constants.
 * Using `as Type[]` ensures downstream code gets proper typing while keeping
 * the JSON files as the single source of truth.
 */
export const capabilities: Capability[] = capabilitiesJson as Capability[];
export const threatModels: ThreatModel[] = threatModelsJson as ThreatModel[];

/**
 * Deterministically generate a color for a benchmark id using a fixed palette.
 * - We use a small palette and a stable hash (FNV-1a) of the benchmark id to
 *   pick a palette color when a benchmark doesn't already specify one.
 * - This keeps colors stable across runs and easy to control by changing the palette.
 */
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

/** FNV-1a 32-bit hash for strings */
function hashStringFnv1a(value: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

/** Pick a color from the palette using the id's hash */
function pickColorForId(id: string): string {
  if (!id) return BENCHMARK_COLOR_PALETTE[0];
  const h = hashStringFnv1a(id);
  return BENCHMARK_COLOR_PALETTE[h % BENCHMARK_COLOR_PALETTE.length];
}

/**
 * Export benchmarks ensuring every benchmark has a `color`.
 *
 * Transformations are applied only for explicitly listed benchmark IDs via
 * a `transformers` map. If a benchmark id is not present in that map, its
 * scores are left unchanged (no default normalization).
 *
 * We cast the raw JSON to `any` first so we can safely map and transform
 * entries that don't exactly match the Benchmark type shape, then assert
 * the final result as `Benchmark[]`.
 */
const rawBenchmarks: any[] = benchmarksJson as any[];

/**
 * Per-benchmark transformers.
 * Each transformer receives the full array of raw numeric score values and
 * must return an array of normalized numbers in [0,1] of the same length.
 * Only benchmarks listed here will have their scores transformed.
 */
const transformers: Record<string, (rawScores: unknown[]) => number[]> = {
  // Example: convert permille (0-1000) -> fraction (0-1)
  frontiermatch: (rawScores) => {
    const nums = (rawScores ?? []).map((v) => (typeof v === "number" ? v : 0));
    const normalized = nums.map((n) => Math.max(0, Math.min(1, n / 1000)));
    return normalized;
  },

  // forecast_bench: perform min-max normalization across the benchmark's scores.
  // map each raw -> (raw - min) / (max - min). If max == min, map to 1.0.
  forecast_bench: (rawScores) => {
    const nums = (rawScores ?? []).map((v) => (typeof v === "number" ? v : 0));
    const min = Math.min(...nums);
    const max = Math.max(...nums);
    if (max === min) {
      return nums.map(() => 1);
    }
    return nums.map((n) => Math.max(0, Math.min(1, (n - min) / (max - min))));
  },

  // long_tasks (METR): minutes per task. Normalize against a fixed 1-day cap
  // so that raw minutes are mapped to a fraction of one day:
  // normalized = clamp(raw / (24*60), 0, 1)
  long_tasks: (rawScores) => {
    const nums = (rawScores ?? []).map((v) => (typeof v === "number" ? v : 0));
    const topMinutes = 8 * 60; // One workday
    return nums.map((n) => Math.max(0, Math.min(1, n / topMinutes)));
  },

  // Add further explicit transforms here as needed:
  // "other-benchmark-id": (rawScores) => { /* return array of normalized numbers */ },
};

export const benchmarks: Benchmark[] = rawBenchmarks
  .map((b: any) => {
    // Determine if this benchmark has a transformer.
    const id: string = b.id;
    const transformer = transformers[id];

    // Apply transformer only when explicitly present; otherwise keep raw scores.
    // For benchmarks with an entry in `transformers` the transformer receives the
    // full array of raw score values and must return an array of normalized values.
    const normalizedScores = (() => {
      const rawScoresArray = (b.scores ?? []).map((s: any) => s?.score);
      const transformerById = transformers[b.id];
      if (typeof transformerById === "function") {
        const transformed = transformerById(rawScoresArray);
        // Map back into score objects, preserving other fields and using transformed values.
        return (b.scores ?? []).map((s: any, i: number) => ({
          ...s,
          score: transformed && i < transformed.length ? transformed[i] : null,
        }));
      } else {
        // Leave scores untouched if no transformer is defined for this benchmark.
        return (b.scores ?? []).map((s: any) => ({ ...s, score: s?.score }));
      }
    })();

    // Ensure returned object includes required Benchmark fields
    return {
      id: b.id,
      name: b.name,
      description: b.description,
      category: b.category ?? "reasoning",
      difficultyLevel: b.difficultyLevel ?? "intermediate",
      color: b.color ?? pickColorForId(b.id),
      scores: normalizedScores,
      humanBaseline: b.humanBaseline,
      expertBaseline: b.expertBaseline,
      url: b.url,
    } as Benchmark;
  })
  .filter(Boolean) as Benchmark[];

export const models: Model[] = modelsJson as Model[];

/**
 * Look up a threat model by id.
 */
export function getThreatModelById(id: string): ThreatModel | undefined {
  return threatModels.find((tm) => tm.id === id);
}

/**
 * Look up a capability by id.
 */
export function getCapabilityById(id: string): Capability | undefined {
  return capabilities.find((c) => c.id === id);
}

/**
 * Look up a benchmark by id.
 */
export function getBenchmarkById(id: string): Benchmark | undefined {
  return benchmarks.find((b) => b.id === id);
}

/**
 * Look up a model by id.
 */
export function getModelById(id: string): Model | undefined {
  return models.find((m) => m.id === id);
}

/**
 * Calculate a simple normalized risk score (0-100) for a threat model based
 * on the current capability levels and required capability thresholds.
 *
 * Scoring approach:
 * - Each required capability contributes a value in [0,1] based on how far
 *   currentLevel is above the minimum threshold (with a small buffer).
 * - Contributions are weighted by importance: necessary=3, important=2, helpful=1.
 * - Final score is the weighted average scaled to 0-100 and clamped to 100.
 */
export function calculateThreatRisk(threatModel: ThreatModel): number {
  const requiredCaps = threatModel.requiredCapabilities ?? [];
  let totalRisk = 0;
  let totalWeight = 0;

  for (const req of requiredCaps) {
    const capability = getCapabilityById(req.capabilityId);
    if (!capability) continue;

    const weight =
      req.importance === "necessary"
        ? 3
        : req.importance === "important"
          ? 2
          : 1;

    // Risk contribution increases as currentLevel approaches/exceeds minimumLevel.
    // Add a small buffer so near-threshold capabilities contribute somewhat.
    const riskContribution = Math.max(
      0,
      (capability.currentLevel - req.minimumLevel + 20) / 100,
    );

    totalRisk += riskContribution * weight;
    totalWeight += weight;
  }

  return totalWeight > 0 ? Math.min(100, (totalRisk / totalWeight) * 100) : 0;
}
