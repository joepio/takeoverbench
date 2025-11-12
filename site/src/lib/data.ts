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
export const benchmarks: Benchmark[] = benchmarksJson as Benchmark[];
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
