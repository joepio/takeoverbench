<script lang="ts">
    import { page } from "$app/stores";
    import type { PageData } from "./$types";
    import MainChart from "$lib/components/MainChart.svelte";
    import {
        getRiskColor,
        getRiskBackgroundColor,
        getTimeHorizonLabel,
        getCapabilityLevelColor,
        getCapabilityLevelLabel,
    } from "$lib/styles/theme";

    export let data: PageData;

    const { threatModel, capabilities, currentRisk } = data;

    // Get benchmarks relevant to this threat model
    const relevantBenchmarkIds = new Set<string>();
    capabilities.forEach((cap) => {
        if (cap.capability?.benchmarks) {
            cap.capability.benchmarks.forEach((b) => relevantBenchmarkIds.add(b));
        }
    });
</script>

<svelte:head>
    <title>{threatModel.name} - TakeOverBench</title>
    <meta name="description" content={threatModel.shortDescription} />
</svelte:head>

<main class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <section class="bg-white border-b border-gray-200">
        <div class="container mx-auto px-4 py-8 max-w-7xl">
            <!-- Breadcrumb -->
            <nav class="flex items-center gap-2 text-sm text-gray-600 mb-6">
                <a href="/" class="hover:text-gray-900">Home</a>
                <span>/</span>
                <a href="/threats" class="hover:text-gray-900">Threat Models</a>
                <span>/</span>
                <span class="text-gray-900">{threatModel.name}</span>
            </nav>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div class="lg:col-span-2">
                    <h1 class="text-3xl font-bold text-gray-900 mb-4">
                        {threatModel.name}
                    </h1>
                    <p class="text-lg text-gray-700 leading-relaxed">
                        {threatModel.longDescription}
                    </p>

                    <!-- Key Metrics -->
                    <div class="flex flex-wrap gap-4 mt-6">
                        <div class="flex items-center gap-2">
                            <span class="text-sm text-gray-500">Risk Level:</span>
                            <span
                                class="px-3 py-1 rounded-full text-sm font-medium"
                                style="background-color: {getRiskBackgroundColor(
                                    threatModel.riskLevel,
                                )}; color: {getRiskColor(threatModel.riskLevel)}"
                            >
                                {threatModel.riskLevel.toUpperCase()}
                            </span>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="text-sm text-gray-500">Time Horizon:</span>
                            <span class="text-sm font-medium text-gray-900">
                                {getTimeHorizonLabel(threatModel.timeHorizon)}
                            </span>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="text-sm text-gray-500">Category:</span>
                            <span class="text-sm font-medium text-gray-900 capitalize">
                                {threatModel.category}
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Risk Assessment Card -->
                <div class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6">
                    <h3 class="font-semibold text-gray-900 mb-4">Current Risk Assessment</h3>
                    <div class="text-center mb-4">
                        <div
                            class="text-4xl font-bold"
                            style="color: {getRiskColor(threatModel.riskLevel)}"
                        >
                            {Math.round(currentRisk)}%
                        </div>
                        <div class="text-sm text-gray-600 mt-1">
                            Based on current capabilities
                        </div>
                    </div>
                    <div class="space-y-3">
                        <div>
                            <div class="flex justify-between text-xs text-gray-600 mb-1">
                                <span>Risk Progress</span>
                                <span>{Math.round(currentRisk)}%</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    class="h-2 rounded-full transition-all duration-500"
                                    style="width: {currentRisk}%; background-color: {getRiskColor(
                                        threatModel.riskLevel,
                                    )}"
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Required Capabilities Section -->
    <section class="py-12">
        <div class="container mx-auto px-4 max-w-7xl">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Required Capabilities</h2>
            <p class="text-gray-600 mb-8">
                This threat model becomes viable when AI systems achieve sufficient levels in the following capabilities:
            </p>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {#each capabilities as { capability, minimumLevel, importance }}
                    {#if capability}
                        <div class="bg-white rounded-lg border border-gray-200 p-6">
                            <div class="flex justify-between items-start mb-3">
                                <h3 class="font-semibold text-gray-900">
                                    {capability.name}
                                </h3>
                                <span
                                    class="text-xs px-2 py-1 rounded-full capitalize"
                                    class:bg-red-100={importance === "necessary"}
                                    class:text-red-700={importance === "necessary"}
                                    class:bg-orange-100={importance === "important"}
                                    class:text-orange-700={importance === "important"}
                                    class:bg-blue-100={importance === "helpful"}
                                    class:text-blue-700={importance === "helpful"}
                                >
                                    {importance}
                                </span>
                            </div>
                            <p class="text-sm text-gray-600 mb-4">
                                {capability.description}
                            </p>

                            <div class="space-y-3">
                                <div>
                                    <div class="flex justify-between text-xs text-gray-600 mb-1">
                                        <span>Current Level</span>
                                        <span
                                            style="color: {getCapabilityLevelColor(
                                                capability.currentLevel,
                                            )}"
                                        >
                                            {capability.currentLevel}% ({getCapabilityLevelLabel(
                                                capability.currentLevel,
                                            )})
                                        </span>
                                    </div>
                                    <div class="w-full bg-gray-200 rounded-full h-1.5">
                                        <div
                                            class="h-1.5 rounded-full transition-all duration-500"
                                            style="width: {capability.currentLevel}%; background-color: {getCapabilityLevelColor(
                                                capability.currentLevel,
                                            )}"
                                        ></div>
                                    </div>
                                </div>

                                <div>
                                    <div class="flex justify-between text-xs text-gray-600 mb-1">
                                        <span>Required Threshold</span>
                                        <span class="font-medium">{minimumLevel}%</span>
                                    </div>
                                    <div class="w-full bg-gray-200 rounded-full h-1.5 relative">
                                        <div
                                            class="absolute h-1.5 bg-red-300 rounded-full"
                                            style="width: {minimumLevel}%"
                                        ></div>
                                        <div
                                            class="absolute w-0.5 bg-red-500 h-3 -top-0.75"
                                            style="left: {minimumLevel}%"
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    {/if}
                {/each}
            </div>
        </div>
    </section>

    <!-- Relevant Benchmarks Chart -->
    {#if relevantBenchmarkIds.size > 0}
        <section class="py-12 bg-white border-t border-gray-200">
            <div class="container mx-auto px-4 max-w-7xl">
                <h2 class="text-2xl font-bold text-gray-900 mb-6">
                    Relevant Benchmark Progress
                </h2>
                <p class="text-gray-600 mb-8">
                    Tracking progress on benchmarks that measure capabilities required for this threat model.
                </p>
                <div class="bg-gray-50 rounded-lg p-6">
                    <MainChart
                        selectedBenchmarks={Array.from(relevantBenchmarkIds)}
                        height="400px"
                        showDangerZone={false}
                    />
                </div>
            </div>
        </section>
    {/if}

    <!-- Indicators Section -->
    <section class="py-12">
        <div class="container mx-auto px-4 max-w-7xl">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <!-- Warning Indicators -->
                <div>
                    <h2 class="text-2xl font-bold text-gray-900 mb-6">Warning Indicators</h2>
                    <p class="text-gray-600 mb-6">
                        Early warning signs that this threat may be materializing:
                    </p>
                    <div class="space-y-3">
                        {#each threatModel.indicators as indicator}
                            <div class="flex gap-3">
                                <div class="flex-shrink-0 w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center mt-0.5">
                                    <div class="w-2 h-2 rounded-full bg-orange-500"></div>
                                </div>
                                <p class="text-sm text-gray-700">{indicator}</p>
                            </div>
                        {/each}
                    </div>
                </div>

                <!-- Mitigation Strategies -->
                <div>
                    <h2 class="text-2xl font-bold text-gray-900 mb-6">Mitigation Strategies</h2>
                    <p class="text-gray-600 mb-6">
                        Proposed measures to prevent or reduce this risk:
                    </p>
                    <div class="space-y-3">
                        {#each threatModel.mitigations as mitigation}
                            <div class="flex gap-3">
                                <div class="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                                    <svg class="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                </div>
                                <p class="text-sm text-gray-700">{mitigation}</p>
                            </div>
                        {/each}
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- References Section -->
    {#if threatModel.references.length > 0}
        <section class="py-12 bg-gray-50 border-t border-gray-200">
            <div class="container mx-auto px-4 max-w-7xl">
                <h2 class="text-2xl font-bold text-gray-900 mb-6">References & Further Reading</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {#each threatModel.references as reference}
                        <div class="bg-white rounded-lg border border-gray-200 p-4">
                            <h3 class="font-medium text-gray-900 mb-1">
                                {reference.title}
                            </h3>
                            <p class="text-sm text-gray-600 mb-2">
                                {reference.authors.join(", ")} • {reference.year}
                            </p>
                            {#if reference.url}
                                <a
                                    href={reference.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="text-sm text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
                                >
                                    View {reference.type}
                                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                                    </svg>
                                </a>
                            {/if}
                        </div>
                    {/each}
                </div>
            </div>
        </section>
    {/if}

    <!-- Call to Action -->
    <section class="py-12">
        <div class="container mx-auto px-4 max-w-4xl">
            <div class="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-8 text-white text-center">
                <h2 class="text-2xl font-bold mb-4">Stay Informed</h2>
                <p class="mb-6 text-blue-50">
                    Understanding and tracking AI risks is crucial for ensuring beneficial outcomes.
                    Help us improve our assessments and stay updated on the latest developments.
                </p>
                <div class="flex gap-4 justify-center">
                    <a
                        href="https://github.com/pauseai/takeoverbench"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="px-6 py-3 bg-white text-blue-700 font-medium rounded-lg hover:bg-blue-50 transition-colors duration-150"
                    >
                        Contribute on GitHub
                    </a>
                    <a
                        href="/about"
                        class="px-6 py-3 bg-white/20 text-white font-medium rounded-lg hover:bg-white/30 transition-colors duration-150 backdrop-blur"
                    >
                        Learn More
                    </a>
                </div>
            </div>
        </div>
    </section>
</main>
