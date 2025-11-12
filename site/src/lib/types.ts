// Core data type definitions for TakeOverBench
// Shared types used across the site.

export interface Model {
  id: string;
  name: string;
  releaseDate: string; // ISO date (YYYY-MM-DD) preferred
  description: string;
  organization: string;
}

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

export interface Benchmark {
  id: string;
  name: string;
  description: string;
  color: string; // hex or CSS color string used for chart/visualization
  scores: BenchmarkScore[];
  humanBaseline: number | null;
  expertBaseline: number | null;
  url: string | null;
}

export interface Capability {
  id: string;
  name: string;
  description: string;
  // benchmark IDs that measure this capability
  benchmarks: string[];
  // current and projected levels (0-1)
  currentLevel: number;
  projectedLevel2025?: number;
  projectedLevel2030?: number;
}

export type ThreatCategory =
  | "autonomy"
  | "deception"
  | "cyberoffense"
  | "bioweapons"
  | "persuasion"
  | "proliferation";

export type RiskLevel = "low" | "medium" | "high" | "critical";

export type TimeHorizon = "near" | "medium" | "long"; // near: 0-2 years, medium: 2-5 years, long: 5+ years

export interface RequiredCapability {
  capabilityId: string;
  minimumLevel: number; // 0-100 threshold needed for this threat
  importance: "necessary" | "important" | "helpful";
}

export type ReferenceType = "paper" | "report" | "article" | "book";

export interface Reference {
  title: string;
  authors: string[];
  year: number;
  url?: string;
  type: ReferenceType;
}

export interface ThreatModel {
  id: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  category: ThreatCategory;
  riskLevel: RiskLevel;
  timeHorizon: TimeHorizon;
  requiredCapabilities: RequiredCapability[];
  indicators: string[];
  mitigations: string[];
  references: Reference[];
}

export interface RiskAssessment {
  threatModelId: string;
  currentRisk: number; // 0-100 based on current capability levels
  projectedRisk2025: number;
  projectedRisk2030: number;
  bottleneckCapabilities: string[]; // capabilities preventing this threat
}
