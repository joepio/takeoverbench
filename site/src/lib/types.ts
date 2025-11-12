// Core data type definitions for TakeOverBench
// Extracted from models.ts so they can be shared across the codebase.

export interface Model {
  id: string;
  name: string;
  releaseDate: string;
  description: string;
  organization?: string;
}

export interface BenchmarkScore {
  modelId: string;
  score: number;
  date?: string;
}

export type BenchmarkCategory =
  | "reasoning"
  | "coding"
  | "mathematics"
  | "science"
  | "multimodal"
  | "agentic";

export type DifficultyLevel = "foundational" | "intermediate" | "advanced" | "frontier";

export interface Benchmark {
  id: string;
  name: string;
  description: string;
  category: BenchmarkCategory;
  difficultyLevel: DifficultyLevel;
  color: string;
  scores: BenchmarkScore[];
  humanBaseline?: number;
  expertBaseline?: number;
  url?: string;
}

export type CapabilityCategory = "cognitive" | "technical" | "social" | "physical";

export interface Capability {
  id: string;
  name: string;
  description: string;
  category: CapabilityCategory;
  benchmarks: string[]; // benchmark IDs that measure this capability
  currentLevel: number; // 0-100 scale
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
