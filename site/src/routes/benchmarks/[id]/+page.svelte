<script lang="ts">
    import MainChart from "$lib/components/MainChart.svelte";
    import { models } from "$lib/data";
    import type { Benchmark } from "$lib/types";
    import { onMount } from "svelte";

    // page data provided by the route load() function (+page.ts)
    export let data: {
        benchmark: Benchmark;
        relatedCapabilities?: { id: string; name: string }[];
    };

    const { benchmark, relatedCapabilities = [] } = data;

    // Score helpers
    function getModelNameById(id: string) {
        return models.find((m) => m.id === id)?.name ?? id;
    }

    // Return the model releaseDate (ISO) for a given model id, or null if not found.
    // This lets the UI prefer the model's canonical release date and fall back to the
    // score-level date if a model-level releaseDate isn't available.
    function getModelReleaseDateById(id: string) {
        return models.find((m) => m.id === id)?.releaseDate ?? null;
    }

    // Format an ISO date (or any parseable date string) as YYYY-MM-DD for display.
    // Returns "—" when no valid date is available.
    function formatDate(dateStr: string | null | undefined): string {
        if (!dateStr) return "—";
        const t = Date.parse(dateStr);
        if (Number.isNaN(t)) return "—";
        return new Date(t).toISOString().slice(0, 10);
    }

    // Scores sorted newest last (original data is assumed unordered)
    const scoresSorted = [...(benchmark.scores ?? [])].sort((a, b) => {
        // Prefer explicit date if provided (ISO), otherwise fall back to score value
        if (a.date && b.date) return Date.parse(a.date) - Date.parse(b.date);
        return 0;
    });

    // Determine top score
    const topScoreEntry = (benchmark.scores ?? []).reduce(
        (best, cur) => {
            if (!best) return cur;
            return cur.score > best.score ? cur : best;
        },
        null as { modelId: string; score: number } | null,
    );

    // For chart we show this one benchmark's id
    let selectedBenchmarks = [benchmark.id];

    // Tiny client-side guard in case data is undefined during hydration
    let hydrated = false;
    onMount(() => {
        hydrated = true;
    });
</script>

<svelte:head>
    <title>{benchmark.name} — Benchmark — TakeOverBench</title>
    <meta name="description" content={benchmark.description} />
</svelte:head>

<main class="min-h-screen bg-gray-50">
    <section class="py-8">
        <div class="container mx-auto px-4 max-w-7xl">
            <nav class="text-sm text-gray-600 mb-4">
                <a href="/" class="hover:underline">Home</a>
                <span class="mx-2">/</span>
                <a href="/benchmarks" class="hover:underline">Benchmarks</a>
                <span class="mx-2">/</span>
                <span class="text-gray-900">{benchmark.name}</span>
            </nav>

            <div class="bg-white rounded-lg p-6 shadow-sm">
                <div class="md:flex md:items-start md:justify-between gap-6">
                    <div class="flex-1">
                        <h1 class="text-2xl font-bold text-gray-900">
                            {benchmark.name}
                        </h1>
                        <p class="text-sm text-gray-600 mt-2 max-w-2xl">
                            {benchmark.description}
                        </p>

                        <div
                            class="mt-4 flex flex-wrap gap-3 text-xs text-gray-500"
                        >
                            <div class="px-2 py-1 bg-gray-50 rounded">
                                {benchmark.category}
                            </div>
                            <div class="px-2 py-1 bg-gray-50 rounded">
                                {benchmark.difficultyLevel}
                            </div>
                            {#if benchmark.humanBaseline}
                                <div class="px-2 py-1 bg-gray-50 rounded">
                                    Human: {benchmark.humanBaseline}%
                                </div>
                            {/if}
                            {#if benchmark.expertBaseline}
                                <div class="px-2 py-1 bg-gray-50 rounded">
                                    Expert: {benchmark.expertBaseline}%
                                </div>
                            {/if}
                        </div>
                    </div>

                    <div class="w-full md:w-48 mt-4 md:mt-0 text-right">
                        {#if topScoreEntry}
                            <div class="text-3xl font-extrabold text-blue-600">
                                {Math.round(topScoreEntry.score)}%
                            </div>
                            <div class="text-xs text-gray-500 mt-1">
                                {getModelNameById(topScoreEntry.modelId)}
                            </div>
                        {:else}
                            <div class="text-sm text-gray-500">
                                No scores available
                            </div>
                        {/if}
                    </div>
                </div>

                <!-- Chart -->
                <div class="mt-6 bg-gray-50 rounded p-4">
                    <!-- only render the chart once client-side to avoid SSR / Chart.js issues -->
                    {#if hydrated}
                        <MainChart
                            {selectedBenchmarks}
                            height="420px"
                            showLegend={true}
                        />
                    {:else}
                        <div
                            class="h-[420px] flex items-center justify-center text-gray-400"
                        >
                            Chart loading…
                        </div>
                    {/if}
                </div>

                <!-- Scores table / list -->
                <div class="mt-6">
                    <h2 class="text-lg font-semibold text-gray-900 mb-3">
                        Model scores
                    </h2>
                    {#if (benchmark.scores ?? []).length === 0}
                        <div class="text-sm text-gray-500">
                            No scores recorded for this benchmark.
                        </div>
                    {:else}
                        <div class="overflow-x-auto">
                            <table class="w-full text-left text-sm">
                                <thead class="text-xs text-gray-500 uppercase">
                                    <tr>
                                        <th class="py-2 pr-4">Model</th>
                                        <th class="py-2 pr-4">Score</th>
                                        <th class="py-2 pr-4">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {#each (benchmark.scores ?? []).sort((a, b) => b.score - a.score) as s}
                                        <tr class="border-t">
                                            <td class="py-3 pr-4"
                                                >{getModelNameById(
                                                    s.modelId,
                                                )}</td
                                            >
                                            <td class="py-3 pr-4"
                                                ><span class="font-medium"
                                                    >{s.score}%</span
                                                ></td
                                            >
                                            <td class="py-3 pr-4"
                                                >{formatDate(
                                                    getModelReleaseDateById(
                                                        s.modelId,
                                                    ) ?? s.date,
                                                )}</td
                                            >
                                        </tr>
                                    {/each}
                                </tbody>
                            </table>
                        </div>
                    {/if}
                </div>

                <!-- Related capabilities -->
                {#if relatedCapabilities && relatedCapabilities.length > 0}
                    <div class="mt-6">
                        <h3 class="text-lg font-semibold text-gray-900 mb-3">
                            Related capabilities
                        </h3>
                        <div
                            class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
                        >
                            {#each relatedCapabilities as cap}
                                <a
                                    href={"/capability/" + cap.id}
                                    class="block bg-white border border-gray-100 rounded p-3 hover:shadow focus:ring-2 focus:ring-blue-100 no-underline text-current"
                                >
                                    <div class="font-medium text-gray-900">
                                        {cap.name}
                                    </div>
                                </a>
                            {/each}
                        </div>
                    </div>
                {/if}

                {#if benchmark.url}
                    <div class="mt-6 text-sm text-gray-500">
                        Source: <a
                            href={benchmark.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            class="text-blue-600 hover:underline"
                            >{benchmark.url}</a
                        >
                    </div>
                {/if}
            </div>
        </div>
    </section>
</main>

<style>
    /* Small utility in case line-clamp isn't available in build */
    :global(.line-clamp-3) {
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
</style>
