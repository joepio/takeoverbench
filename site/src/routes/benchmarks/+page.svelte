<script lang="ts">
    import MainChart from "$lib/components/MainChart.svelte";
    import { benchmarks, models } from "$lib/data";

    // Use the compact selection (same as homepage)
    const selectedBenchmarks = benchmarks.slice(0, 5).map((b) => b.id);

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
        <div class="container mx-auto px-4 max-w-7xl">
            <div class="mb-6">
                <h1 class="text-3xl font-bold text-gray-900">Benchmarks</h1>
                <p class="text-gray-600 mt-2">
                    Overview of representative benchmarks. Use the chart to
                    compare progress across selected benchmarks and inspect
                    recent scores.
                </p>
            </div>

            <!-- Compact combined chart (same as home) -->
            <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
                <MainChart {selectedBenchmarks} height="520px" />
            </div>

            <!-- Compact selected benchmark cards (same look as homepage) -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                {#each benchmarks.filter( (b) => selectedBenchmarks.includes(b.id), ) as benchmark}
                    <a
                        href={"/benchmarks/" + benchmark.id}
                        class="block bg-white rounded-lg border border-gray-200 p-6 transition-all duration-200 hover:shadow-md no-underline text-current focus:outline-none focus:ring-2 focus:ring-blue-100"
                        style="border-left: 4px solid {benchmark.color}"
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
        </div>
    </section>
</main>

<style>
    /* Keep styling consistent with homepage cards; rely on Tailwind for layout */
</style>
