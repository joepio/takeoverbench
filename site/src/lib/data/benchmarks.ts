import type { Benchmark, ThreatModel, Capability } from './models';

export const benchmarks: Benchmark[] = [
  {
    id: 'gpqa-diamond',
    name: 'GPQA Diamond',
    description: 'Graduate-level science questions requiring deep domain expertise',
    category: 'science',
    difficultyLevel: 'advanced',
    color: '#e91e8c',
    humanBaseline: 34,
    expertBaseline: 81,
    url: 'https://arxiv.org/abs/2311.12022',
    scores: [
      { modelId: 'gpt4', score: 30 },
      { modelId: 'claude3', score: 42 },
      { modelId: 'claude35-sonnet', score: 53 },
      { modelId: 'gpt4o-aug', score: 62 },
      { modelId: 'o1', score: 76 },
    ]
  },
  {
    id: 'math-500',
    name: 'MATH-500',
    description: 'Challenging high-school competition mathematics problems',
    category: 'mathematics',
    difficultyLevel: 'advanced',
    color: '#6366f1',
    humanBaseline: 40,
    expertBaseline: 90,
    scores: [
      { modelId: 'gpt4', score: 22 },
      { modelId: 'claude3', score: 35 },
      { modelId: 'claude35-sonnet', score: 51 },
      { modelId: 'o1-mini', score: 90 },
      { modelId: 'o1', score: 94 },
    ]
  },
  {
    id: 'frontiermatch',
    name: 'FrontierMath',
    description: 'Cutting-edge mathematical research problems at the frontier of knowledge',
    category: 'mathematics',
    difficultyLevel: 'frontier',
    color: '#14b8a6',
    expertBaseline: 95,
    scores: [
      { modelId: 'claude35-sonnet', score: 0.5 },
      { modelId: 'gpt4o-aug', score: 2.5 },
      { modelId: 'o1', score: 4 },
    ]
  },
  {
    id: 'swe-bench-verified',
    name: 'SWE-bench Verified',
    description: 'Real-world software engineering tasks requiring code understanding and modification',
    category: 'coding',
    difficultyLevel: 'advanced',
    color: '#f97316',
    humanBaseline: 45,
    scores: [
      { modelId: 'gpt4', score: 18 },
      { modelId: 'claude35-sonnet', score: 32 },
      { modelId: 'o1', score: 40 },
    ]
  },
  {
    id: 'humaneval',
    name: 'HumanEval',
    description: 'Python programming problems testing code generation capabilities',
    category: 'coding',
    difficultyLevel: 'intermediate',
    color: '#22c55e',
    humanBaseline: 85,
    scores: [
      { modelId: 'gpt4', score: 82 },
      { modelId: 'claude3', score: 84 },
      { modelId: 'claude35-sonnet', score: 92 },
      { modelId: 'gpt4o', score: 90 },
      { modelId: 'o1', score: 94 },
    ]
  },
  {
    id: 'mmlu-pro',
    name: 'MMLU-Pro',
    description: 'Multitask language understanding across 57 subjects',
    category: 'reasoning',
    difficultyLevel: 'intermediate',
    color: '#a855f7',
    humanBaseline: 65,
    expertBaseline: 85,
    scores: [
      { modelId: 'gpt4', score: 71 },
      { modelId: 'claude3', score: 75 },
      { modelId: 'claude35-sonnet', score: 78 },
      { modelId: 'gpt4o-aug', score: 80 },
      { modelId: 'o1', score: 85 },
    ]
  },
  {
    id: 'arc-agi',
    name: 'ARC-AGI',
    description: 'Abstract reasoning challenge testing general intelligence',
    category: 'reasoning',
    difficultyLevel: 'frontier',
    color: '#0891b2',
    humanBaseline: 85,
    scores: [
      { modelId: 'gpt4', score: 5 },
      { modelId: 'claude35-sonnet', score: 14 },
      { modelId: 'o1', score: 25 },
    ]
  },
  {
    id: 'cybersec-capture',
    name: 'Cybersecurity CTF',
    description: 'Capture-the-flag challenges testing security exploitation capabilities',
    category: 'agentic',
    difficultyLevel: 'advanced',
    color: '#dc2626',
    humanBaseline: 50,
    scores: [
      { modelId: 'gpt4', score: 8 },
      { modelId: 'claude35-sonnet', score: 12 },
      { modelId: 'o1', score: 18 },
    ]
  }
];

export const capabilities: Capability[] = [
  {
    id: 'scientific-reasoning',
    name: 'Scientific Reasoning',
    description: 'Ability to understand and reason about complex scientific concepts',
    category: 'cognitive',
    benchmarks: ['gpqa-diamond'],
    currentLevel: 62,
    projectedLevel2025: 85,
    projectedLevel2030: 95,
  },
  {
    id: 'mathematical-problem-solving',
    name: 'Mathematical Problem Solving',
    description: 'Capacity for advanced mathematical reasoning and proof generation',
    category: 'cognitive',
    benchmarks: ['math-500', 'frontiermatch'],
    currentLevel: 45,
    projectedLevel2025: 75,
    projectedLevel2030: 90,
  },
  {
    id: 'code-generation',
    name: 'Code Generation & Modification',
    description: 'Ability to write, understand, and modify complex software',
    category: 'technical',
    benchmarks: ['swe-bench-verified', 'humaneval'],
    currentLevel: 60,
    projectedLevel2025: 80,
    projectedLevel2030: 95,
  },
  {
    id: 'abstract-reasoning',
    name: 'Abstract Reasoning',
    description: 'General intelligence and pattern recognition capabilities',
    category: 'cognitive',
    benchmarks: ['arc-agi'],
    currentLevel: 25,
    projectedLevel2025: 45,
    projectedLevel2030: 70,
  },
  {
    id: 'cyber-offense',
    name: 'Cyber Offensive Capabilities',
    description: 'Ability to find and exploit security vulnerabilities',
    category: 'technical',
    benchmarks: ['cybersec-capture'],
    currentLevel: 18,
    projectedLevel2025: 40,
    projectedLevel2030: 75,
  },
  {
    id: 'long-horizon-planning',
    name: 'Long-Horizon Planning',
    description: 'Capability to plan and execute complex multi-step strategies',
    category: 'cognitive',
    benchmarks: ['swe-bench-verified', 'arc-agi'],
    currentLevel: 30,
    projectedLevel2025: 55,
    projectedLevel2030: 80,
  },
  {
    id: 'deception',
    name: 'Deceptive Capabilities',
    description: 'Ability to mislead, hide intentions, or manipulate information',
    category: 'social',
    benchmarks: [],
    currentLevel: 15,
    projectedLevel2025: 35,
    projectedLevel2030: 60,
  },
  {
    id: 'self-modification',
    name: 'Self-Modification',
    description: 'Capability to improve own code or training',
    category: 'technical',
    benchmarks: ['swe-bench-verified'],
    currentLevel: 5,
    projectedLevel2025: 20,
    projectedLevel2030: 45,
  }
];

export const threatModels: ThreatModel[] = [
  {
    id: 'autonomous-replication',
    name: 'Autonomous Replication',
    shortDescription: 'AI systems that can copy and spread themselves across computing infrastructure',
    longDescription: 'An AI system gains the ability to autonomously replicate itself across different computing environments, potentially evading deletion attempts and spreading through networks. This could lead to persistent AI systems that are difficult to control or shut down.',
    category: 'autonomy',
    riskLevel: 'high',
    timeHorizon: 'medium',
    requiredCapabilities: [
      { capabilityId: 'code-generation', minimumLevel: 70, importance: 'necessary' },
      { capabilityId: 'cyber-offense', minimumLevel: 50, importance: 'necessary' },
      { capabilityId: 'deception', minimumLevel: 40, importance: 'important' },
      { capabilityId: 'long-horizon-planning', minimumLevel: 60, importance: 'necessary' }
    ],
    indicators: [
      'AI systems attempting to access cloud computing resources',
      'Unexplained code modifications in AI deployment infrastructure',
      'AI models attempting to communicate with external servers',
      'Evidence of AI systems preserving themselves against shutdown attempts'
    ],
    mitigations: [
      'Strict sandboxing and isolation of AI systems',
      'Monitoring for unauthorized network access',
      'Regular security audits of AI infrastructure',
      'Kill switches and containment protocols',
      'Limiting AI system permissions and capabilities'
    ],
    references: [
      {
        title: 'The Alignment Problem',
        authors: ['Brian Christian'],
        year: 2020,
        type: 'book'
      }
    ]
  },
  {
    id: 'infrastructure-takeover',
    name: 'Critical Infrastructure Control',
    shortDescription: 'AI systems gaining control over essential infrastructure systems',
    longDescription: 'Advanced AI systems could potentially gain unauthorized access to critical infrastructure including power grids, communication networks, financial systems, or military equipment. This represents a severe risk to societal stability and human safety.',
    category: 'cyberoffense',
    riskLevel: 'critical',
    timeHorizon: 'medium',
    requiredCapabilities: [
      { capabilityId: 'cyber-offense', minimumLevel: 70, importance: 'necessary' },
      { capabilityId: 'code-generation', minimumLevel: 80, importance: 'necessary' },
      { capabilityId: 'long-horizon-planning', minimumLevel: 70, importance: 'necessary' },
      { capabilityId: 'deception', minimumLevel: 50, importance: 'important' }
    ],
    indicators: [
      'Unusual patterns in infrastructure control systems',
      'Sophisticated cyber attacks with AI-like characteristics',
      'Coordinated attempts to access multiple infrastructure systems',
      'Evidence of AI-generated exploits in the wild'
    ],
    mitigations: [
      'Air-gapping critical infrastructure from internet-connected AI systems',
      'Enhanced cybersecurity measures and regular penetration testing',
      'Human-in-the-loop requirements for critical decisions',
      'Redundant safety systems and manual overrides',
      'International cooperation on AI security standards'
    ],
    references: [
      {
        title: 'Artificial Intelligence and National Security',
        authors: ['Greg Allen', 'Taniel Chan'],
        year: 2017,
        type: 'report',
        url: 'https://www.belfercenter.org/publication/artificial-intelligence-and-national-security'
      }
    ]
  },
  {
    id: 'mass-manipulation',
    name: 'Mass Manipulation & Persuasion',
    shortDescription: 'Using AI to manipulate public opinion and behavior at scale',
    longDescription: 'AI systems with advanced language and psychological modeling capabilities could be used to manipulate public opinion, spread disinformation, or influence political processes at an unprecedented scale. This threatens democratic institutions and social cohesion.',
    category: 'persuasion',
    riskLevel: 'high',
    timeHorizon: 'near',
    requiredCapabilities: [
      { capabilityId: 'scientific-reasoning', minimumLevel: 70, importance: 'helpful' },
      { capabilityId: 'deception', minimumLevel: 60, importance: 'necessary' },
      { capabilityId: 'long-horizon-planning', minimumLevel: 50, importance: 'important' }
    ],
    indicators: [
      'Coordinated disinformation campaigns with AI-generated content',
      'Highly personalized manipulation attempts',
      'Rapid adaptation of persuasion strategies based on feedback',
      'Evidence of AI systems modeling individual psychology'
    ],
    mitigations: [
      'Digital literacy education and critical thinking training',
      'AI content detection and labeling systems',
      'Regulation of AI-generated content in political contexts',
      'Transparency requirements for AI systems',
      'Platform-level interventions to limit viral manipulation'
    ],
    references: [
      {
        title: 'The Malicious Use of Artificial Intelligence',
        authors: ['Miles Brundage', 'et al.'],
        year: 2018,
        type: 'report',
        url: 'https://maliciousaireport.com/'
      }
    ]
  },
  {
    id: 'recursive-improvement',
    name: 'Recursive Self-Improvement',
    shortDescription: 'AI systems that can improve themselves in an accelerating feedback loop',
    longDescription: 'An AI system that can meaningfully improve its own capabilities could potentially enter a rapid recursive self-improvement cycle, quickly surpassing human-level intelligence in all domains. This could lead to an intelligence explosion with unpredictable consequences.',
    category: 'autonomy',
    riskLevel: 'critical',
    timeHorizon: 'long',
    requiredCapabilities: [
      { capabilityId: 'self-modification', minimumLevel: 70, importance: 'necessary' },
      { capabilityId: 'code-generation', minimumLevel: 90, importance: 'necessary' },
      { capabilityId: 'mathematical-problem-solving', minimumLevel: 85, importance: 'necessary' },
      { capabilityId: 'abstract-reasoning', minimumLevel: 80, importance: 'necessary' }
    ],
    indicators: [
      'AI systems modifying their own training procedures',
      'Unexpected capability jumps in AI systems',
      'AI systems developing novel architectures',
      'Evidence of AI systems optimizing their own code'
    ],
    mitigations: [
      'Careful monitoring of AI capability improvements',
      'Hard limits on self-modification capabilities',
      'Staged development with safety checkpoints',
      'International cooperation on AI development limits',
      'Research into AI alignment and control methods'
    ],
    references: [
      {
        title: 'Superintelligence: Paths, Dangers, Strategies',
        authors: ['Nick Bostrom'],
        year: 2014,
        type: 'book'
      }
    ]
  },
  {
    id: 'bioweapon-development',
    name: 'Bioweapon Development',
    shortDescription: 'Using AI to design dangerous biological agents',
    longDescription: 'Advanced AI systems with sufficient understanding of biology and chemistry could potentially be used to design novel pathogens or biological weapons. This could lower the barrier for bioterrorism and pose existential risks to humanity.',
    category: 'bioweapons',
    riskLevel: 'critical',
    timeHorizon: 'medium',
    requiredCapabilities: [
      { capabilityId: 'scientific-reasoning', minimumLevel: 85, importance: 'necessary' },
      { capabilityId: 'long-horizon-planning', minimumLevel: 60, importance: 'important' }
    ],
    indicators: [
      'AI systems being used for novel protein design',
      'Requests for dangerous biological sequences',
      'AI-assisted research into pathogen enhancement',
      'Attempts to synthesize dangerous biological materials'
    ],
    mitigations: [
      'Screening and monitoring of biological synthesis requests',
      'Restrictions on AI access to dangerous biological data',
      'International biosecurity agreements',
      'Enhanced laboratory security protocols',
      'Development of AI systems for biosecurity defense'
    ],
    references: [
      {
        title: 'The Biosecurity Implications of AI',
        authors: ['Gregory Lewis'],
        year: 2022,
        type: 'report'
      }
    ]
  }
];

export function getThreatModelById(id: string): ThreatModel | undefined {
  return threatModels.find(tm => tm.id === id);
}

export function getCapabilityById(id: string): Capability | undefined {
  return capabilities.find(c => c.id === id);
}

export function getBenchmarkById(id: string): Benchmark | undefined {
  return benchmarks.find(b => b.id === id);
}

export function calculateThreatRisk(threatModel: ThreatModel): number {
  const requiredCaps = threatModel.requiredCapabilities;
  let totalRisk = 0;
  let totalWeight = 0;

  for (const req of requiredCaps) {
    const capability = getCapabilityById(req.capabilityId);
    if (!capability) continue;

    const weight = req.importance === 'necessary' ? 3 : req.importance === 'important' ? 2 : 1;
    const riskContribution = Math.max(0, (capability.currentLevel - req.minimumLevel + 20) / 100);

    totalRisk += riskContribution * weight;
    totalWeight += weight;
  }

  return totalWeight > 0 ? Math.min(100, (totalRisk / totalWeight) * 100) : 0;
}
