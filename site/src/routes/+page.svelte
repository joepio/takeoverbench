<script lang="ts">
    import MainChart from "$lib/components/MainChart.svelte";
    import {
        benchmarks,
        threatModels,
        calculateThreatRisk,
    } from "$lib/data/benchmarks";
    import {
        getRiskColor,
        getRiskBackgroundColor,
        getTimeHorizonLabel,
    } from "$lib/styles/theme";

    let selectedBenchmarks = benchmarks.slice(0, 5).map((b) => b.id);
    let expandedBenchmark: string | null = null;

    // Calculate risk levels for threat models
    const threatModelsWithRisk = threatModels
        .map((tm) => ({
            ...tm,
            currentRisk: calculateThreatRisk(tm),
        }))
        .sort((a, b) => b.currentRisk - a.currentRisk);

    function toggleBenchmark(benchmarkId: string) {
        expandedBenchmark =
            expandedBenchmark === benchmarkId ? null : benchmarkId;
    }
</script>

<svelte:head>
    <title>TakeOverBench - AI Capability & Risk Assessment</title>
    <meta
        name="description"
        content="Track AI capabilities across benchmarks and understand potential risks through comprehensive threat modeling."
    />
</svelte:head>

<main class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <section class="bg-white border-b border-gray-200">
        <div class="container mx-auto px-4 py-12 max-w-7xl">
            <div class="text-center mb-8">
                <h1 class="text-4xl font-bold text-gray-900 mb-4">
                    AI Capability Tracking & Risk Assessment
                </h1>
                <p class="text-lg text-gray-600 max-w-3xl mx-auto">
                    Monitor the rapid advancement of AI capabilities across
                    critical benchmarks and understand their implications for
                    autonomous systems and societal risks.
                </p>
            </div>

            <!-- Key Metrics -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <div class="bg-gray-50 rounded-lg p-6">
                    <div class="text-sm font-medium text-gray-500 mb-1">
                        Benchmarks Tracked
                    </div>
                    <div class="text-3xl font-bold text-gray-900">
                        {benchmarks.length}
                    </div>
                    <div class="text-sm text-gray-600 mt-1">
                        Across {new Set(benchmarks.map((b) => b.category)).size}
                        categories
                    </div>
                </div>
                <div class="bg-gray-50 rounded-lg p-6">
                    <div class="text-sm font-medium text-gray-500 mb-1">
                        Threat Models
                    </div>
                    <div class="text-3xl font-bold text-gray-900">
                        {threatModels.length}
                    </div>
                    <div class="text-sm text-gray-600 mt-1">
                        <span class="text-red-600 font-medium"
                            >{threatModels.filter(
                                (t) => t.riskLevel === "critical",
                            ).length}</span
                        >
                        critical,
                        <span class="text-orange-600 font-medium"
                            >{threatModels.filter((t) => t.riskLevel === "high")
                                .length}</span
                        > high risk
                    </div>
                </div>
                <div class="bg-gray-50 rounded-lg p-6">
                    <div class="text-sm font-medium text-gray-500 mb-1">
                        Highest Current Risk
                    </div>
                    <div
                        class="text-3xl font-bold"
                        style="color: {getRiskColor(
                            threatModelsWithRisk[0].riskLevel,
                        )}"
                    >
                        {Math.round(threatModelsWithRisk[0].currentRisk)}%
                    </div>
                    <div class="text-sm text-gray-600 mt-1">
                        {threatModelsWithRisk[0].name}
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Main Chart Section -->
    <section class="py-12">
        <div class="container mx-auto px-4 max-w-7xl">
            <div class="mb-8">
                <h2 class="text-2xl font-bold text-gray-900 mb-2">
                    Capability Progress Over Time
                </h2>
                <p class="text-gray-600">
                    Track how AI systems are approaching and surpassing
                    human-level performance across various domains.
                </p>
            </div>

            <!-- Benchmark Selector -->
            <div class="mb-6 flex flex-wrap gap-2">
                {#each benchmarks as benchmark}
                    <button
                        class="px-4 py-2 rounded-full text-sm font-medium transition-all duration-150
                               {selectedBenchmarks.includes(benchmark.id)
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400'}"
                        on:click={() => {
                            if (selectedBenchmarks.includes(benchmark.id)) {
                                selectedBenchmarks = selectedBenchmarks.filter(
                                    (id) => id !== benchmark.id,
                                );
                            } else {
                                selectedBenchmarks = [
                                    ...selectedBenchmarks,
                                    benchmark.id,
                                ];
                            }
                        }}
                    >
                        {benchmark.name}
                    </button>
                {/each}
            </div>

            <!-- Chart -->
            <div class="bg-white rounded-lg shadow-sm p-6">
                <MainChart {selectedBenchmarks} height="500px" />
            </div>

            <!-- Benchmark Details -->
            <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                {#each benchmarks.filter( (b) => selectedBenchmarks.includes(b.id), ) as benchmark}
                    <div
                        class="bg-white rounded-lg border border-gray-200 p-6 transition-all duration-200 hover:shadow-md cursor-pointer"
                        style="border-left: 4px solid {benchmark.color}"
                        role="button"
                        tabindex="0"
                        on:click={() => toggleBenchmark(benchmark.id)}
                        on:keydown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                toggleBenchmark(benchmark.id);
                            }
                        }}
                    >
                        <div class="flex justify-between items-start mb-2">
                            <h3 class="font-semibold text-gray-900">
                                {benchmark.name}
                            </h3>
                            <span
                                class="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600"
                            >
                                {benchmark.category}
                            </span>
                        </div>
                        <p class="text-sm text-gray-600 mb-3">
                            {benchmark.description}
                        </p>

                        {#if benchmark.humanBaseline || benchmark.expertBaseline}
                            <div class="flex gap-4 text-xs text-gray-500 mb-3">
                                {#if benchmark.humanBaseline}
                                    <span
                                        >Human: {benchmark.humanBaseline}%</span
                                    >
                                {/if}
                                {#if benchmark.expertBaseline}
                                    <span
                                        >Expert: {benchmark.expertBaseline}%</span
                                    >
                                {/if}
                            </div>
                        {/if}

                        {#if expandedBenchmark === benchmark.id}
                            <div class="mt-4 pt-4 border-t border-gray-100">
                                <div class="space-y-2">
                                    {#each benchmark.scores.slice(-5) as score}
                                        <div
                                            class="flex justify-between items-center text-sm"
                                        >
                                            <span class="text-gray-600"
                                                >{score.modelId}</span
                                            >
                                            <span
                                                class="font-medium"
                                                style="color: {benchmark.color}"
                                                >{score.score}%</span
                                            >
                                        </div>
                                    {/each}
                                </div>
                            </div>
                        {/if}
                    </div>
                {/each}
            </div>
        </div>
    </section>

    <!-- Threat Models Section -->
    <section class="py-12 bg-white border-t border-gray-200">
        <div class="container mx-auto px-4 max-w-7xl">
            <div class="mb-8">
                <h2 class="text-2xl font-bold text-gray-900 mb-2">
                    Risk Assessment by Threat Model
                </h2>
                <p class="text-gray-600">
                    Understanding how advancing capabilities translate into
                    specific risks and threat scenarios.
                </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {#each threatModelsWithRisk.slice(0, 6) as threat}
                    <a
                        href="/threat/{threat.id}"
                        class="block bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200"
                        style="border-top: 3px solid {getRiskColor(
                            threat.riskLevel,
                        )}"
                    >
                        <div class="flex justify-between items-start mb-3">
                            <h3 class="font-semibold text-gray-900">
                                {threat.name}
                            </h3>
                            <span
                                class="text-xs px-2 py-1 rounded-full font-medium"
                                style="background-color: {getRiskBackgroundColor(
                                    threat.riskLevel,
                                )}; color: {getRiskColor(threat.riskLevel)}"
                            >
                                {threat.riskLevel}
                            </span>
                        </div>

                        <p class="text-sm text-gray-600 mb-4">
                            {threat.shortDescription}
                        </p>

                        <div class="flex justify-between items-center text-xs">
                            <span class="text-gray-500">
                                Timeline: {getTimeHorizonLabel(
                                    threat.timeHorizon,
                                )}
                            </span>
                            <div class="flex items-center gap-2">
                                <span class="text-gray-500">Current Risk:</span>
                                <span
                                    class="font-semibold"
                                    style="color: {getRiskColor(
                                        threat.riskLevel,
                                    )}"
                                >
                                    {Math.round(threat.currentRisk)}%
                                </span>
                            </div>
                        </div>

                        <div class="mt-4">
                            <div class="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    class="h-2 rounded-full transition-all duration-500"
                                    style="width: {threat.currentRisk}%; background-color: {getRiskColor(
                                        threat.riskLevel,
                                    )}"
                                ></div>
                            </div>
                        </div>
                    </a>
                {/each}
            </div>

            <div class="text-center mt-8">
                <a
                    href="/threats"
                    class="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-150"
                >
                    View All Threat Models
                    <svg
                        class="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M9 5l7 7-7 7"
                        ></path>
                    </svg>
                </a>
            </div>
        </div>
    </section>

    <!-- Call to Action -->
    <section class="py-16 bg-gray-50">
        <div class="container mx-auto px-4 max-w-4xl text-center">
            <h2 class="text-3xl font-bold text-gray-900 mb-4">
                Understanding AI Progress & Risk
            </h2>
            <p class="text-lg text-gray-600 mb-8">
                As AI systems rapidly advance toward and beyond human
                capabilities, it's crucial to track their progress and
                understand the associated risks. This platform provides
                data-driven insights to inform policy, research, and safety
                measures.
            </p>
            <div class="flex gap-4 justify-center">
                <a
                    href="/about"
                    class="px-6 py-3 bg-white text-blue-600 font-medium rounded-lg border border-blue-600 hover:bg-blue-50 transition-colors duration-150"
                >
                    Learn More
                </a>
                <a
                    href="https://github.com/pauseai/takeoverbench"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="px-6 py-3 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-900 transition-colors duration-150"
                >
                    View on GitHub
                </a>
            </div>
        </div>
    </section>
</main>

<style>
    /* Custom animations */
    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    section {
        animation: slideUp 0.6s ease-out;
    }
</style>
