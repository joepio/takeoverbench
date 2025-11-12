import capabilities from "../../data/capabilities.json";
import threatModels from "../../data/threat_models.json";
import benchmarks from "../../data/benchmarks.json";
import type { Benchmark, Capability, ThreatModel } from "./types";

export function getThreatModelById(id: string): ThreatModel | undefined {
  return threatModels.find((tm) => tm.id === id);
}

export function getCapabilityById(id: string): Capability | undefined {
  return capabilities.find((c) => c.id === id);
}

export function getBenchmarkById(id: string): Benchmark | undefined {
  return benchmarks.find((b) => b.id === id);
}

export function calculateThreatRisk(threatModel: ThreatModel): number {
  const requiredCaps = threatModel.requiredCapabilities;
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
    const riskContribution = Math.max(
      0,
      (capability.currentLevel - req.minimumLevel + 20) / 100,
    );

    totalRisk += riskContribution * weight;
    totalWeight += weight;
  }

  return totalWeight > 0 ? Math.min(100, (totalRisk / totalWeight) * 100) : 0;
}
