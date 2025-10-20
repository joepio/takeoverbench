// Core data models for TakeOverBench

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

export interface Benchmark {
  id: string;
  name: string;
  description: string;
  category:
    | "reasoning"
    | "coding"
    | "mathematics"
    | "science"
    | "multimodal"
    | "agentic";
  difficultyLevel: "foundational" | "intermediate" | "advanced" | "frontier";
  color: string;
  scores: BenchmarkScore[];
  humanBaseline?: number;
  expertBaseline?: number;
  url?: string;
}

export interface Capability {
  id: string;
  name: string;
  description: string;
  category: "cognitive" | "technical" | "social" | "physical";
  benchmarks: string[]; // benchmark IDs that measure this capability
  currentLevel: number; // 0-100 scale
  projectedLevel2025?: number;
  projectedLevel2030?: number;
}

export interface ThreatModel {
  id: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  category:
    | "autonomy"
    | "deception"
    | "cyberoffense"
    | "bioweapons"
    | "persuasion"
    | "proliferation";
  riskLevel: "low" | "medium" | "high" | "critical";
  timeHorizon: "near" | "medium" | "long"; // near: 0-2 years, medium: 2-5 years, long: 5+ years
  requiredCapabilities: RequiredCapability[];
  indicators: string[];
  mitigations: string[];
  references: Reference[];
}

export interface RequiredCapability {
  capabilityId: string;
  minimumLevel: number; // 0-100 threshold needed for this threat
  importance: "necessary" | "important" | "helpful";
}

export interface Reference {
  title: string;
  authors: string[];
  year: number;
  url?: string;
  type: "paper" | "report" | "article" | "book";
}

export interface RiskAssessment {
  threatModelId: string;
  currentRisk: number; // 0-100 based on current capability levels
  projectedRisk2025: number;
  projectedRisk2030: number;
  bottleneckCapabilities: string[]; // capabilities preventing this threat
}

// Data exports
export const models: Model[] = [
  {
    id: "gpt4",
    name: "GPT-4",
    releaseDate: "March 2023",
    description: "",
    organization: "OpenAI",
  },
  {
    id: "claude3",
    name: "Claude 3",
    releaseDate: "March 2024",
    description: "",
    organization: "Anthropic",
  },
  {
    id: "claude35-sonnet",
    name: "Claude 3.5 Sonnet",
    releaseDate: "June 2024",
    description: "",
    organization: "Anthropic",
  },
  {
    id: "gpt4o",
    name: "GPT-4o",
    releaseDate: "May 2024",
    description: "",
    organization: "OpenAI",
  },
  {
    id: "gpt4o-aug",
    name: "GPT-4o (August)",
    releaseDate: "August 2024",
    description: "",
    organization: "OpenAI",
  },
  {
    id: "o1-mini",
    name: "o1-mini",
    releaseDate: "September 2024",
    description: "reasoning model",
    organization: "OpenAI",
  },
  {
    id: "o1",
    name: "o1",
    releaseDate: "September 2024",
    description: "advanced reasoning",
    organization: "OpenAI",
  },
  {
    id: "gemini-ultra",
    name: "Gemini Ultra",
    releaseDate: "December 2023",
    description: "",
    organization: "Google",
  },
  {
    id: "gemini-pro-1.5",
    name: "Gemini Pro 1.5",
    releaseDate: "February 2024",
    description: "",
    organization: "Google",
  },
];

export const benchmarks: Benchmark[] = [
  {
    id: "gpqa-diamond",
    name: "GPQA Diamond",
    description:
      "Graduate-level science questions requiring deep domain expertise",
    category: "science",
    difficultyLevel: "advanced",
    color: "#e91e8c",
    humanBaseline: 34,
    expertBaseline: 81,
    url: "https://arxiv.org/abs/2311.12022",
    scores: [
      { modelId: "gpt4", score: 30 },
      { modelId: "claude3", score: 42 },
      { modelId: "claude35-sonnet", score: 53 },
      { modelId: "gpt4o-aug", score: 62 },
      { modelId: "o1", score: 76 },
    ],
  },
];
