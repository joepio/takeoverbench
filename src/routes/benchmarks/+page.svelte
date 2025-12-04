<script lang="ts">
    import { onMount } from "svelte";
    import { benchmarks, models } from "$lib/data";

    // Show all benchmarks
    const selectedBenchmarks = benchmarks.map((b) => b.id);

    // Dynamically import MainChart only on the client to avoid SSR/Chart.js issues
    let MainChart: any = null;
    let hydrated = false;

    onMount(async () => {
        hydrated = true;
        try {
            const mod = await import("$lib/components/MainChart.svelte");
            MainChart = mod?.default ?? mod;
        } catch (err) {
            console.error("[MainChart] failed to load:", err);
        }
    });

    // Helper to map model id -> human name
    function getModelNameById(id: string) {
        return models.find((m) => m.id === id)?.name ?? id;
    }
</script>

<svelte:head>
    <title>Benchmarks — TakeOverBench</title>
    <meta
        name="description"
        content="Track model performance across representative benchmarks and inspect recent scores."
    />
</svelte:head>

<main class="min-h-screen bg-gray-50">
    <section class="py-12">
        <div class="container mx-auto px-4 md:px-6 lg:px-10 max-w-7xl">
            <div class="mb-6">
                <h1 class="text-3xl font-bold text-gray-900">Benchmarks</h1>
                <p class="mt-2">
                    Overview of representative benchmarks. Use the chart to
                    compare progress across selected benchmarks and inspect
                    recent scores.
                </p>
            </div>

            <!-- Compact combined chart (same as home) -->
            <div class="bg-surface-primary rounded-lg shadow-sm p-6 mb-8">
                {#if !hydrated}
                    <div
                        class="h-[520px] flex items-center justify-center text-gray-700"
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

            <!-- All benchmark cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                {#each benchmarks as benchmark}
                    <a
                        href={"/benchmarks/" + benchmark.id}
                        class="block bg-surface-primary rounded-lg border border-gray-900 p-6 transition-all duration-200 hover:shadow-md no-underline text-current focus:outline-none focus:ring-2 focus:ring-blue-100"
                        style="border-left: 4px solid {benchmark.color}"
                    >
                        <div class="flex justify-between items-start mb-2">
                            <div>
                                <h3 class="font-semibold text-gray-900">
                                    {benchmark.capabilityName ?? benchmark.name}
                                </h3>
                                <p class="text-xs  mt-0.5">
                                    {benchmark.name}
                                </p>
                            </div>
                            {#if benchmark.category}
                                <span
                                    class="text-xs px-2 py-1 rounded-full bg-gray-300"
                                >
                                    {benchmark.category}
                                </span>
                            {/if}
                        </div>

                        <p class="text-sm mb-3">
                            {benchmark.capabilityDefinition}
                        </p>

                        {#if benchmark.humanBaseline || benchmark.expertBaseline}
                            <div class="flex gap-4 text-xs  mb-3">
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

                        <div class="mt-4 pt-4 border-t">
                            <div class="space-y-2">
                                {#each (benchmark.scores ?? [])
                                    .slice()
                                    .sort((a, b) => b.score - a.score)
                                    .slice(0, 3) as score}
                                    <div
                                        class="flex justify-between items-center text-sm"
                                    >
                                        <span
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
        </div>
    </section>
</main>

<style>
    /* Keep styling consistent with homepage cards; rely on Tailwind for layout */
</style>
