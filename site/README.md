# TakeOverBench

A comprehensive benchmark tracking system for AI capabilities and risk assessment. This platform monitors the rapid advancement of AI systems across critical benchmarks and maps their progress to potential threat models, providing data-driven insights for AI safety research and policy.

## 🎯 Project Overview

TakeOverBench combines multiple AI capability benchmarks to assess risks associated with autonomous AI systems. The platform tracks performance metrics across domains like reasoning, mathematics, coding, and science, then correlates these capabilities with specific threat models to understand when certain risks may materialize.

### Key Features

- **Real-time Capability Tracking**: Monitor AI performance across 8+ major benchmarks
- **Threat Model Assessment**: Map capabilities to 5+ critical threat scenarios
- **Risk Visualization**: Interactive charts showing progress toward dangerous thresholds
- **Data-Driven Analysis**: Evidence-based risk assessment using latest benchmark results
- **Clean, Professional UI**: Calm and trustworthy design for serious research communication

## 🏗️ Architecture

### Tech Stack

- **Framework**: SvelteKit with TypeScript
- **Styling**: Tailwind CSS v4 (using Vite plugin)
- **Charts**: Chart.js for data visualization
- **Build Tool**: Vite
- **Package Manager**: pnpm

### Project Structure

```
site/
├── src/
│   ├── lib/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── MainChart.svelte
│   │   │   └── Header.svelte
│   │   ├── data/            # Data models and structures
│   │   │   ├── models.ts
│   │   │   └── benchmarks.ts
│   │   └── styles/          # Design system
│   │       └── theme.ts
│   ├── routes/              # Page components
│   │   ├── +page.svelte     # Home/Dashboard
│   │   ├── about/           # About page
│   │   └── threat/[id]/     # Dynamic threat model pages
│   └── app.css             # Global styles
├── static/                  # Static assets
└── package.json
```

## 📊 Data Structure

### Core Models

1. **Benchmarks**: Track AI performance metrics
   - GPQA Diamond (science)
   - MATH-500 (mathematics)
   - FrontierMath (research-level math)
   - SWE-bench (software engineering)
   - HumanEval (code generation)
   - ARC-AGI (abstract reasoning)
   - Cybersecurity CTF (security)

2. **Threat Models**: Potential risk scenarios
   - Autonomous Replication
   - Infrastructure Control
   - Mass Manipulation
   - Recursive Self-Improvement
   - Bioweapon Development

3. **Capabilities**: Abstract abilities derived from benchmarks
   - Scientific Reasoning
   - Mathematical Problem Solving
   - Code Generation
   - Abstract Reasoning
   - Cyber Offensive Capabilities
   - Long-Horizon Planning

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Type checking
pnpm check

# Linting
pnpm lint
```

### Development Workflow

1. **Adding New Benchmarks**: Update `/src/lib/data/benchmarks.ts`
2. **Adding Threat Models**: Extend the `threatModels` array in `benchmarks.ts`
3. **Updating Styles**: Modify `/src/lib/styles/theme.ts` for design system changes
4. **Creating Pages**: Add new routes in `/src/routes/`

## 🎨 Design Philosophy

The project follows a calm, rational, and trustworthy design approach:

- **Color Palette**: Professional blues and grays with semantic colors for risk levels
- **Typography**: Clean, readable Inter font family
- **Information Hierarchy**: Clear structure with progressive disclosure
- **Data Visualization**: Intuitive charts with contextual information
- **Accessibility**: WCAG-compliant with keyboard navigation and ARIA labels

## 📈 Key Features

### Dashboard (Home Page)
- Overview metrics and statistics
- Main capability progress chart
- Threat model risk assessments
- Interactive benchmark selector

### Threat Model Details
- Comprehensive threat descriptions
- Required capability analysis
- Progress tracking toward threat viability
- Warning indicators and mitigation strategies
- Academic references

### About Page
- Project rationale and mission
- Understanding exponential AI progress
- Path to autonomous agents
- Call to action for researchers and policymakers

## 🔄 Data Updates

Benchmark scores and model information should be updated regularly:

1. Check latest benchmark results from official sources
2. Update scores in `/src/lib/data/benchmarks.ts`
3. Add new models as they are released
4. Adjust threat model assessments based on capability progress

## 🤝 Contributing

Contributions are welcome! Areas where help is needed:

- Adding new benchmarks and keeping scores updated
- Improving threat model assessments
- Enhancing data visualizations
- Adding new analysis features
- Improving mobile responsiveness
- Documentation and educational content

## 📚 References

This project draws on research from:
- AI safety organizations (MIRI, Anthropic, OpenAI)
- Academic institutions studying AI risks
- Benchmark maintainers and researchers
- Policy and governance experts

## 📝 License

[Add appropriate license]

## 🔗 Links

- [Production Site](https://takeoverbench.com) (when deployed)
- [GitHub Repository](https://github.com/pauseai/takeoverbench)
- [PauseAI](https://pauseai.info)

## ⚠️ Disclaimer

This platform provides data-driven analysis of AI capabilities and potential risks. The risk assessments are based on current understanding and should be interpreted as estimates rather than definitive predictions. The goal is to inform research, policy, and safety measures, not to cause alarm.

---

**Remember**: The transition from helpful AI tools to potentially dangerous autonomous systems may happen gradually, then suddenly. Tracking these capabilities helps us prepare appropriate safety measures before critical thresholds are crossed.