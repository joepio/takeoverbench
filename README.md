# [TakeOverBench](https://takeoverbench.netlify.app/)

A comprehensive benchmark tracking system for AI capabilities and risk assessment.
This platform monitors the rapid advancement of AI systems across critical benchmarks and maps their progress to potential threat models, providing data-driven insights for AI safety research and policy.

## Concepts

1. **Models**: AI / LLM models, like Claude Sonnet 4.5.
1. **Benchmarks**: A benchmark with scores from 0 - 100 per model.
1. **Capabilities**: A set of benchmarks should measure a dangerous capability.
1. **Threat Models**: A narrative of how a combination of capabilities could lead to a certain threat model.

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

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
pnpm install
pnpm dev
pnpm build

# Preview production build
pnpm preview

# Type checking
pnpm check

# Linting
pnpm lint
```

### Publishing

Netlify (PauseAI account) follows this repository and runs `pnpm build` on commit, publishes to https://takeoverbench.netlify.app/

## 🔗 Links

- [Production Site](https://takeoverbench.com) (when deployed)
- [GitHub Repository](https://github.com/pauseai/takeoverbench)
- [PauseAI](https://pauseai.info)

## Credits

- Joep Meindertsma (front-end)
- Otto Barten (threat models)
- Hugo Save (benchmark data collection)
