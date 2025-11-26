<script lang="ts">
    import { onMount } from "svelte";
    import { benchmarks, threatModels, models, getBenchmarkById } from "$lib/data";

    // Show all benchmarks on the main chart
    const selectedBenchmarks = benchmarks.map((b) => b.id);

    // Helper to get capability name from benchmark id
    function capabilityName(id: string) {
        return getBenchmarkById(id)?.capabilityName ?? id;
    }

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
    <title>TakeOverBench — AI Safety Benchmarks & Takeover Scenarios</title>
    <meta
        name="description"
        content="AI is rapidly getting better at using weapons, manipulating, hacking, and carrying out long-term plots against us. We track progress towards AI takeover scenarios."
    />
</svelte:head>

<main class="min-h-screen bg-gray-50 py-12">
    <div class="container mx-auto px-4 max-w-7xl">
        <header class="text-center mb-10">
            <h1 class="text-4xl font-bold text-gray-900">TakeOverBench</h1>
            <p class="text-gray-600 mt-2 max-w-2xl mx-auto">
                AI is rapidly getting more dangerous. We track progress towards
                an AI takeover scenario.
            </p>
        </header>

        <!-- Benchmark Overview Section -->
        <section class="mb-12">
            <div class="mb-6">
                <h2 class="text-2xl font-bold text-gray-900">
                    Dangerous capabilities timeline
                </h2>
                <p class="text-gray-600">
                    According to "Model evaluation for extreme risks" (Shevlane,
                    2023), the most dangerous AI capabilities include
                    Cyber-offense, Persuasion & manipulation, Political
                    strategy, Weapons acquisition, Long-horizon planning, AI
                    development, Situational awareness, and Self-proliferation.
                    Progress on these capabilities is shown below.
                </p>
            </div>

            <!-- Chart -->
            <div class="bg-surface-primary rounded-lg shadow-sm p-6 mb-8">
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

            <div class="text-center">
                <a
                    href="/benchmarks"
                    class="inline-flex items-center gap-2 px-6 py-3 bg-surface-primary text-gray-200 font-medium rounded-lg border border-gray-200 hover:bg-gray-300 transition-colors duration-150"
                >
                    View benchmarks
                </a>
            </div>
        </section>

        <!-- Takeover scenarios section -->
        <section>
            <div class="mb-6">
                <h2 class="text-2xl font-bold text-gray-900">
                    How do dangerous capabilities lead to a takeover?
                </h2>
                <p class="text-gray-600 mt-2">
                    Based on the literature, these are four plausible threat
                    models.
                </p>
            </div>

            {#if threatModels && threatModels.length > 0}
                <div
                    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {#each threatModels as t (t.id)}
                        <a
                            href={"/threat/" + t.id}
                            class="block bg-surface-primary border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200 no-underline text-current hover:bg-surface-primary/50"
                            aria-labelledby={"threat-" + t.id + "-title"}
                        >
                            <div class="flex items-start justify-between mb-3">
                                <h2
                                    id={"threat-" + t.id + "-title"}
                                    class="text-lg font-semibold text-gray-900"
                                >
                                    {t.name}
                                </h2>
                                <div
                                    class="text-xs text-gray-500 whitespace-nowrap mt-1.5"
                                >
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
                                        <strong>Required capabilities:</strong>
                                    </div>
                                    <ul class="list-disc list-inside space-y-1">
                                        {#each t.benchmarks.slice(0, 4) as bid (bid)}
                                            <li class="text-sm text-gray-700">
                                                {capabilityName(bid)}
                                            </li>
                                        {/each}
                                        {#if t.benchmarks.length > 4}
                                            <li class="text-sm text-gray-400">
                                                and {t.benchmarks.length - 4} more…
                                            </li>
                                        {/if}
                                    </ul>
                                </div>
                                {#if t.sources_short && t.sources_short.length > 0}
                                    <div class="text-xs text-gray-500 mt-3">
                                        <div class="mb-1">
                                            <strong>Sources:</strong>
                                        </div>
                                        <ul class="list-disc list-inside space-y-1">
                                            {#each t.sources_short as source (source)}
                                                <li class="text-sm text-gray-700">
                                                    {source}
                                                </li>
                                            {/each}
                                        </ul>
                                    </div>
                                {/if}
                            {:else}
                                <div class="text-xs text-gray-400">
                                    No benchmarks listed for this threat.
                                </div>
                            {/if}
                        </a>
                    {/each}
                </div>
            {:else}
                <div
                    class="bg-surface-primary rounded-lg p-8 text-center shadow-sm"
                >
                    <p class="text-gray-600">No takeover scenarios found.</p>
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
