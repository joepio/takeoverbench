<script lang="ts">
    import { onMount } from "svelte";
    import { benchmarks, threatModels, models } from "$lib/data";

    // Show all benchmarks on the main chart
    const selectedBenchmarks = benchmarks.map((b) => b.id);

    // Dynamically import MainChart only on the client to avoid SSR/Chart.js issues.
    let MainChart: any = null;
    let hydrated = false;
    // Visible status for debugging/chart state
    let chartStatus: "idle" | "loading" | "loaded" | "error" = "idle";

    onMount(async () => {
        hydrated = true;
        chartStatus = "loading";
        try {
            // dynamic import so Chart.js runs only in browser
            const mod = await import("$lib/components/MainChart.svelte");
            MainChart = mod?.default ?? mod;
            chartStatus = MainChart ? "loaded" : "error";
            console.log("[MainChart] loaded:", !!MainChart);
        } catch (err) {
            chartStatus = "error";
            console.error("[MainChart] failed to load:", err);
        }
    });

    // Helper to map model id -> human name
    function getModelNameById(id: string) {
        return models.find((m) => m.id === id)?.name ?? id;
    }
</script>

<svelte:head>
    <title>TakeOverBench — AI Safety Benchmarks & Threat Models</title>
    <meta
        name="description"
        content="Track AI capabilities through benchmarks and explore threat models relevant to AI safety."
    />
</svelte:head>

<main class="min-h-screen bg-gray-50 py-12">
    <div class="container mx-auto px-4 max-w-7xl">
        <header class="text-center mb-10">
            <h1 class="text-4xl font-bold text-gray-900">TakeOverBench</h1>
            <p class="text-gray-600 mt-2 max-w-2xl mx-auto">
                Track AI capabilities through representative benchmarks and
                explore threat models relevant to AI safety.
            </p>
        </header>

        <!-- Benchmark Overview Section -->
        <section class="mb-12">
            <div class="mb-6">
                <h2 class="text-2xl font-bold text-gray-900">
                    Benchmarks Overview
                </h2>
                <p class="text-gray-600 mt-2">
                    Track progress across key AI capability benchmarks over
                    time.
                </p>
            </div>

            <!-- Chart -->
            <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
                {#if !hydrated}
                    <div
                        class="h-[520px] flex items-center justify-center text-gray-400"
                    >
                        Chart loading…
                    </div>
                {:else if MainChart}
                    <svelte:component
                        this={MainChart}
                        {selectedBenchmarks}
                        height="520px"
                    />
                {:else}
                    <div
                        class="h-[520px] flex items-center justify-center text-red-600"
                    >
                        Failed to load chart
                    </div>
                {/if}
            </div>

            <!-- Benchmark Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {#each benchmarks.filter( (b) => selectedBenchmarks.includes(b.id), ) as benchmark}
                    <a
                        href={"/benchmarks/" + benchmark.id}
                        class="block bg-white rounded-lg border border-gray-200 p-6 transition-all duration-200 hover:shadow-md no-underline text-current focus:outline-none focus:ring-2 focus:ring-blue-100"
                        style="border-left: 4px solid {benchmark.color}"
                    >
                        <div class="flex justify-between items-start mb-2">
                            <div>
                                <h3 class="font-semibold text-gray-900">
                                    {benchmark.capabilityName ?? benchmark.name}
                                </h3>
                                <p class="text-xs text-gray-500 mt-0.5">
                                    {benchmark.name}
                                </p>
                            </div>
                            {#if benchmark.category}
                                <span
                                    class="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600"
                                >
                                    {benchmark.category}
                                </span>
                            {/if}
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

                        <div class="mt-4 pt-4 border-t border-gray-100">
                            <div class="space-y-2">
                                {#each (benchmark.scores ?? [])
                                    .slice()
                                    .sort((a, b) => b.score - a.score)
                                    .slice(0, 3) as score}
                                    <div
                                        class="flex justify-between items-center text-sm"
                                    >
                                        <span class="text-gray-600"
                                            >{getModelNameById(
                                                score.modelId,
                                            )}</span
                                        >
                                        <span
                                            class="font-medium"
                                            style="color: {benchmark.color}"
                                            >{Math.round(
                                                typeof score.score ===
                                                    "number" && score.score <= 1
                                                    ? score.score * 100
                                                    : score.score,
                                            )}%</span
                                        >
                                    </div>
                                {/each}
                            </div>
                        </div>
                    </a>
                {/each}
            </div>

            <div class="text-center">
                <a
                    href="/benchmarks"
                    class="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 font-medium rounded-lg border border-blue-600 hover:bg-blue-50 transition-colors duration-150"
                >
                    View All Benchmarks
                </a>
            </div>
        </section>

        <!-- Threat Models Section -->
        <section>
            <div class="mb-6">
                <h2 class="text-2xl font-bold text-gray-900">Threat Models</h2>
                <p class="text-gray-600 mt-2">
                    Explore AI safety threat scenarios and their relevant
                    benchmarks.
                </p>
            </div>

            {#if threatModels && threatModels.length > 0}
                <div
                    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {#each threatModels as t (t.id)}
                        <a
                            href={"/threat/" + t.id}
                            class="block bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200 no-underline text-current"
                            aria-labelledby={"threat-" + t.id + "-title"}
                        >
                            <div class="flex items-start justify-between mb-3">
                                <h2
                                    id={"threat-" + t.id + "-title"}
                                    class="text-lg font-semibold text-gray-900"
                                >
                                    {t.name}
                                </h2>
                                <div class="text-xs text-gray-500">
                                    {t.benchmarks?.length ?? 0} benchmarks
                                </div>
                            </div>

                            <p class="text-sm text-gray-600 mb-4">
                                {t.shortDescription ??
                                    t.longDescription ??
                                    "No description available."}
                            </p>

                            {#if t.benchmarks && t.benchmarks.length > 0}
                                <div class="text-xs text-gray-500">
                                    <div class="mb-1">
                                        <strong>Benchmarks:</strong>
                                    </div>
                                    <ul class="list-disc list-inside space-y-1">
                                        {#each t.benchmarks.slice(0, 4) as bid (bid)}
                                            <li class="text-sm text-gray-700">
                                                {bid}
                                            </li>
                                        {/each}
                                        {#if t.benchmarks.length > 4}
                                            <li class="text-gray-400">
                                                and {t.benchmarks.length - 4} more…
                                            </li>
                                        {/if}
                                    </ul>
                                </div>
                            {:else}
                                <div class="text-xs text-gray-400">
                                    No benchmarks listed for this threat.
                                </div>
                            {/if}
                        </a>
                    {/each}
                </div>
            {:else}
                <div class="bg-white rounded-lg p-8 text-center shadow-sm">
                    <p class="text-gray-600">No threat models found.</p>
                </div>
            {/if}
        </section>
    </div>
</main>

<style>
    /* small animation for entries */
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(8px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    a.block {
        animation: fadeInUp 0.4s ease-out;
    }
</style>
