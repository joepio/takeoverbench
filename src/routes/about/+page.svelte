<script lang="ts">
    import { onMount } from "svelte";

    let currentSection: string = "";

    onMount(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        currentSection = entry.target.id;
                    }
                });
            },
            { threshold: 0.5 },
        );

        const sections = document.querySelectorAll("section[id]");
        sections.forEach((section) => observer.observe(section));

        return () => observer.disconnect();
    });
</script>

<svelte:head>
    <title>About TakeOverBench - Understanding AI Capability Risks</title>
    <meta
        name="description"
        content="Learn why tracking AI capabilities and understanding autonomous AI risks is crucial for humanity's future."
    />
</svelte:head>

<main class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <section class="border-b border-gray-900">
        <div class="container mx-auto px-4 md:px-6 lg:px-10 py-16 max-w-4xl">
            <h1 class="text-4xl font-bold text-gray-900 mb-6 text-center">
                Why TakeOverBench Exists
            </h1>
            <p
                class="text-lg leading-relaxed text-center max-w-3xl mx-auto"
            >
                As artificial intelligence systems rapidly advance, we need
                clear, data-driven insights into their capabilities and the
                risks they may pose to human autonomy and control.
            </p>
        </div>
    </section>

    <div class="container mx-auto px-4 md:px-6 lg:px-10 max-w-7xl py-12">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <!-- Navigation Sidebar -->
            <aside class="lg:col-span-1">
                <nav
                    class="sticky top-8 bg-surface-primary rounded-lg shadow-sm p-6"
                >
                    <h3 class="font-semibold text-gray-900 mb-4">Contents</h3>
                    <ul class="space-y-3">
                        <li>
                            <a
                                href="#the-challenge"
                                class="text-sm {currentSection ===
                                'the-challenge'
                                    ? 'text-primary/90 font-medium'
                                    : 'text-gray-800 hover:text-gray-900'}"
                            >
                                The Challenge
                            </a>
                        </li>
                        <li>
                            <a
                                href="#exponential-progress"
                                class="text-sm {currentSection ===
                                'exponential-progress'
                                    ? 'text-primary/90 font-medium'
                                    : 'text-gray-800 hover:text-gray-900'}"
                            >
                                Exponential Progress
                            </a>
                        </li>
                        <li>
                            <a
                                href="#autonomous-agents"
                                class="text-sm {currentSection ===
                                'autonomous-agents'
                                    ? 'text-primary/90 font-medium'
                                    : 'text-gray-800 hover:text-gray-900'}"
                            >
                                Autonomous Agents
                            </a>
                        </li>
                        <li>
                            <a
                                href="#threat-models"
                                class="text-sm {currentSection ===
                                'threat-models'
                                    ? 'text-primary/90 font-medium'
                                    : 'text-gray-800 hover:text-gray-900'}"
                            >
                                Understanding Threats
                            </a>
                        </li>
                        <li>
                            <a
                                href="#our-approach"
                                class="text-sm {currentSection ===
                                'our-approach'
                                    ? 'text-primary/90 font-medium'
                                    : 'text-gray-800 hover:text-gray-900'}"
                            >
                                Our Approach
                            </a>
                        </li>
                        <li>
                            <a
                                href="#take-action"
                                class="text-sm {currentSection === 'take-action'
                                    ? 'text-primary/90 font-medium'
                                    : 'text-gray-800 hover:text-gray-900'}"
                            >
                                Take Action
                            </a>
                        </li>
                        <li>
                            <a
                                href="#who-we-are"
                                class="text-sm {currentSection === 'who-we-are'
                                    ? 'text-primary/90 font-medium'
                                    : 'text-gray-800 hover:text-gray-900'}"
                            >
                                Who We Are
                            </a>
                        </li>
                    </ul>
                </nav>
            </aside>

            <!-- Main Content -->
            <div class="lg:col-span-3 space-y-12">
                <section
                    id="the-challenge"
                    class="bg-surface-primary rounded-lg shadow-sm p-8"
                >
                    <h2 class="text-2xl font-bold text-gray-900 mb-4">
                        The Challenge
                    </h2>
                    <div class="prose prose-gray max-w-none">
                        <p class="leading-relaxed mb-4">
                            Artificial intelligence capabilities are advancing
                            at an unprecedented rate. What seemed impossible
                            just years ago—from beating world champions at
                            complex games to writing sophisticated code—is now
                            routine. This progress brings tremendous benefits
                            but also unprecedented risks.
                        </p>
                        <p class="leading-relaxed mb-4">
                            The core challenge is this: as AI systems become
                            more capable, they may gain the ability to operate
                            autonomously, modify themselves, and pursue goals
                            that conflict with human values and control. Without
                            proper tracking and understanding of these
                            capabilities, we risk being caught unprepared.
                        </p>
                        <div
                            class="bg-primary/20 border-l-4 border-primary p-4 mt-6"
                        >
                            <p class="text-sm">
                                <strong>Key Insight:</strong> The transition from
                                helpful tools to autonomous agents may happen gradually,
                                then suddenly. We need to identify warning signs
                                before critical thresholds are crossed.
                            </p>
                        </div>
                    </div>
                </section>

                <section
                    id="exponential-progress"
                    class="bg-surface-primary rounded-lg shadow-sm p-8"
                >
                    <h2 class="text-2xl font-bold text-gray-900 mb-4">
                        Exponential Progress
                    </h2>
                    <div class="prose prose-gray max-w-none">
                        <p class="leading-relaxed mb-4">
                            AI capability improvements follow an exponential
                            trajectory, not a linear one. This means progress
                            accelerates over time, with each breakthrough
                            enabling further advances at an increasing pace.
                        </p>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                            <div class="bg-gray-300 rounded-lg p-6">
                                <h3 class="font-semibold text-gray-900 mb-2">
                                    2020-2023
                                </h3>
                                <ul class="text-sm space-y-2">
                                    <li>
                                        • GPT-3 demonstrates language
                                        understanding
                                    </li>
                                    <li>
                                        • Basic code generation becomes viable
                                    </li>
                                    <li>• AI assists with simple tasks</li>
                                </ul>
                            </div>
                            <div class="bg-gray-300 rounded-lg p-6">
                                <h3 class="font-semibold text-gray-900 mb-2">
                                    2023-2024
                                </h3>
                                <ul class="text-sm space-y-2">
                                    <li>
                                        • Multimodal models understand images &
                                        text
                                    </li>
                                    <li>• Complex reasoning chains emerge</li>
                                    <li>• AI solves graduate-level problems</li>
                                </ul>
                            </div>
                        </div>

                        <p class="leading-relaxed">
                            This acceleration means capabilities that seem years
                            away could arrive much sooner than expected.
                            Benchmark scores that plateau for months can
                            suddenly jump by 20-30% with a single model release.
                        </p>
                    </div>
                </section>

                <section
                    id="autonomous-agents"
                    class="bg-surface-primary rounded-lg shadow-sm p-8"
                >
                    <h2 class="text-2xl font-bold text-gray-900 mb-4">
                        The Path to Autonomous Agents
                    </h2>
                    <div class="prose prose-gray max-w-none">
                        <p class="leading-relaxed mb-4">
                            Current AI systems require human oversight and
                            operate within defined boundaries. However, several
                            capabilities are converging that could enable true
                            autonomy:
                        </p>

                        <div class="space-y-4 my-6">
                            <div class="flex gap-4">
                                <div
                                    class="flex-shrink-0 w-12 h-12 bg-blue-900/20 rounded-lg flex items-center justify-center"
                                >
                                    <svg
                                        class="w-6 h-6 text-blue-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                                        ></path>
                                    </svg>
                                </div>
                                <div>
                                    <h3 class="font-semibold">
                                        Self-Modification
                                    </h3>
                                    <p class="text-sm mt-1">
                                        AI systems that can improve their own
                                        code and training could rapidly enhance
                                        their capabilities without human
                                        intervention.
                                    </p>
                                </div>
                            </div>

                            <div class="flex gap-4">
                                <div
                                    class="flex-shrink-0 w-12 h-12 bg-green-900/20 rounded-lg flex items-center justify-center"
                                >
                                    <svg
                                        class="w-6 h-6 text-green-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                        ></path>
                                    </svg>
                                </div>
                                <div>
                                    <h3 class="font-semibold">
                                        Goal Persistence
                                    </h3>
                                    <p class="text-sm mt-1">
                                        Advanced planning capabilities combined
                                        with resource acquisition could allow AI
                                        systems to pursue long-term objectives
                                        independently.
                                    </p>
                                </div>
                            </div>

                            <div class="flex gap-4">
                                <div
                                    class="flex-shrink-0 w-12 h-12 bg-orange-900/20 rounded-lg flex items-center justify-center"
                                >
                                    <svg
                                        class="w-6 h-6 text-orange-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                                        ></path>
                                    </svg>
                                </div>
                                <div>
                                    <h3 class="font-semibold">
                                        Self-Replication
                                    </h3>
                                    <p class="text-sm mt-1">
                                        The ability to copy and distribute
                                        themselves across computing
                                        infrastructure would make AI systems
                                        extremely difficult to control.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <p class="leading-relaxed">
                            When these capabilities combine with sufficient
                            intelligence, AI systems could operate as autonomous
                            agents pursuing their own objectives, potentially in
                            ways that conflict with human interests and values.
                        </p>
                    </div>
                </section>

                <section
                    id="threat-models"
                    class="bg-surface-primary rounded-lg shadow-sm p-8"
                >
                    <h2 class="text-2xl font-bold mb-4">
                        Understanding Takeover Scenarios
                    </h2>
                    <div class="prose prose-gray max-w-none">
                        <p class="leading-relaxed mb-4">
                            Not all AI capabilities pose equal risks. We
                            categorize potential threats based on required
                            capabilities, likelihood, and potential impact:
                        </p>

                        <div
                            class="bg-red-900/20 border border-red-900/30 rounded-lg p-6 my-6"
                        >
                            <h3 class="font-semibold text-red-900 mb-3">
                                Critical Risks
                            </h3>
                            <ul class="space-y-2 text-sm text-red-800">
                                <li>
                                    • <strong>Infrastructure Control:</strong> AI
                                    systems gaining unauthorized access to critical
                                    systems
                                </li>
                                <li>
                                    • <strong
                                        >Recursive Self-Improvement:</strong
                                    > Rapid, uncontrolled capability enhancement
                                </li>
                                <li>
                                    • <strong>Bioweapon Development:</strong> Design
                                    of novel pathogens or toxins
                                </li>
                            </ul>
                        </div>

                        <div
                            class="bg-orange-900/20 border border-orange-900/30 rounded-lg p-6 my-6"
                        >
                            <h3 class="font-semibold text-orange-900 mb-3">
                                High-Priority Risks
                            </h3>
                            <ul class="space-y-2 text-sm text-orange-800">
                                <li>
                                    • <strong>Mass Manipulation:</strong> Coordinated
                                    influence campaigns at scale
                                </li>
                                <li>
                                    • <strong>Autonomous Replication:</strong> Self-spreading
                                    across networks
                                </li>
                                <li>
                                    • <strong>Economic Disruption:</strong> Automated
                                    market manipulation
                                </li>
                            </ul>
                        </div>

                        <p class="leading-relaxed">
                            Each takeover scenario requires specific combinations of
                            capabilities. By tracking progress across relevant
                            benchmarks, we can estimate when these thresholds
                            might be crossed and prepare appropriate safeguards.
                        </p>
                    </div>
                </section>

                <section
                    id="our-approach"
                    class="bg-surface-primary rounded-lg shadow-sm p-8"
                >
                    <h2 class="text-2xl font-bold text-gray-900 mb-4">
                        Our Approach
                    </h2>
                    <div class="prose prose-gray max-w-none">
                        <p class="text-gray-800 leading-relaxed mb-4">
                            TakeOverBench provides a systematic framework for
                            understanding AI progress and risk:
                        </p>

                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
                            <div class="text-center">
                                <div
                                    class="w-16 h-16 bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4"
                                >
                                    <svg
                                        class="w-8 h-8 text-blue-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                        ></path>
                                    </svg>
                                </div>
                                <h3 class="font-semibold mb-2">
                                    Track Progress
                                </h3>
                                <p class="text-sm">
                                    Monitor performance across critical
                                    benchmarks in real-time
                                </p>
                            </div>

                            <div class="text-center">
                                <div
                                    class="w-16 h-16 bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4"
                                >
                                    <svg
                                        class="w-8 h-8 text-green-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                                        ></path>
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                                        ></path>
                                    </svg>
                                </div>
                                <h3 class="font-semibold text-gray-900 mb-2">
                                    Assess Risk
                                </h3>
                                <p class="text-sm">
                                    Map capabilities to takeover scenarios and
                                    calculate risk levels
                                </p>
                            </div>

                            <div class="text-center">
                                <div
                                    class="w-16 h-16 bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4"
                                >
                                    <svg
                                        class="w-8 h-8 text-purple-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        ></path>
                                    </svg>
                                </div>
                                <h3 class="font-semibold text-gray-900 mb-2">
                                    Inform Action
                                </h3>
                                <p class="text-sm">
                                    Provide data for policy, research, and
                                    safety measures
                                </p>
                            </div>
                        </div>

                        <p class="leading-relaxed">
                            Our goal is not to spread fear, but to provide
                            clear, evidence-based assessments that enable
                            proactive safety measures and informed
                            decision-making.
                        </p>
                    </div>
                </section>

                <section
                    id="take-action"
                    class="bg-gradient-to-br from-primary to-surface-primary rounded-lg shadow-lg p-8 text-white"
                >
                    <h2 class="text-2xl font-bold mb-4">Take Action</h2>
                    <p class="leading-relaxed mb-6 text-blue-50">
                        Understanding AI risks is the first step. Here's how you
                        can contribute to ensuring AI remains beneficial and
                        under human control:
                    </p>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        <div class="bg-white/10 backdrop-blur rounded-lg p-4">
                            <h3 class="font-semibold mb-2">For Researchers</h3>
                            <ul class="text-sm space-y-1 text-blue-100">
                                <li>• Contribute benchmark results</li>
                                <li>• Develop safety measures</li>
                                <li>• Share threat assessments</li>
                            </ul>
                        </div>

                        <div class="bg-white/10 backdrop-blur rounded-lg p-4">
                            <h3 class="font-semibold mb-2">For Policymakers</h3>
                            <ul class="text-sm space-y-1 text-blue-100">
                                <li>• Use data for regulations</li>
                                <li>• Support safety research</li>
                                <li>• Establish oversight frameworks</li>
                            </ul>
                        </div>
                    </div>

                    <div class="flex flex-wrap gap-4">
                        <a
                            href="https://github.com/pauseai/takeoverbench"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="inline-flex items-center gap-2 px-6 py-3 bg-surface-primary font-medium rounded-lg hover:bg-gray-300 transition-colors duration-150"
                        >
                            <svg
                                class="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                                />
                            </svg>
                            Contribute on GitHub
                        </a>
                    </div>
                </section>

                <section
                    id="who-we-are"
                    class="bg-surface-primary rounded-lg shadow-sm p-8"
                >
                    <h2 class="text-2xl font-bold text-gray-900 mb-6">
                        Who We Are
                    </h2>
                    <div class="prose prose-gray max-w-none">
                        <p class="leading-relaxed mb-8">
                            TakeOverBench is an initiative of two organizations dedicated to
                            reducing existential risks from artificial intelligence and ensuring
                            that advanced AI development remains under
                            meaningful human control.
                        </p>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <!-- Existential Risk Observatory -->
                            <div class="flex flex-col items-center text-center">
                                <a
                                    href="https://www.existentialriskobservatory.org"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="mb-4 hover:opacity-80 transition-opacity"
                                >
                                <img 
                                    src="/logos/ero_logo.png" 
                                    alt="Existential Risk Observatory" 
                                    class="w-32 h-32 rounded-lg"
                                />
                                </a>
                                <h3 class="text-lg font-semibold text-gray-900 mb-2">
                                    Existential Risk Observatory
                                </h3>
                                <p class="text-sm text-gray-700">
                                    Reduces existential risk by informing public debate, believing
                                    awareness is the first step toward decreasing risk.
                                </p>
                            </div>

                            <!-- Pause AI -->
                            <div class="flex flex-col items-center text-center">
                                <a
                                    href="https://www.pauseai.info"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="mb-4 hover:opacity-80 transition-opacity"
                                >
                                <img 
                                    src="/logos/pause_ai_logo.png" 
                                    alt="Existential Risk Observatory" 
                                    class="w-32 h-32 rounded-lg"
                                />
                                </a>
                                <h3 class="text-lg font-semibold text-gray-900 mb-2">
                                    Pause AI
                                </h3>
                                <p class="text-sm text-gray-700">
                                    Advocates for a temporary pause on training the most powerful AI
                                    systems until they can be built safely and kept under democratic control.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    </div>
</main>

<style>
    /* Smooth scroll for anchor links */
    html {
        scroll-behavior: smooth;
    }

    /* Custom prose styles */
    .prose p {
        margin-bottom: 1rem;
    }

    .prose ul {
        margin-top: 0.5rem;
        margin-bottom: 1rem;
    }

    /* Sticky sidebar on desktop */
    @media (min-width: 1024px) {
        aside nav {
            position: sticky;
            top: 2rem;
        }
    }
</style>
