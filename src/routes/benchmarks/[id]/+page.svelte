<script lang="ts">
    import { models } from "$lib/data";
    import type { Benchmark } from "$lib/types";
    import { onMount } from "svelte";

    // page data provided by the route load() function (+page.ts)
    // NOTE: capabilities were removed. The benchmark page now receives
    // `relatedThreatModels` (threat models that reference this benchmark).
    export let data: {
        benchmark: Benchmark;
        relatedThreatModels?: {
            id: string;
            name: string;
            capabilities?: { label?: string | null }[];
        }[];
    };

    const { benchmark, relatedThreatModels = [] } = data;

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

    // Format numeric score as percentage string. If value <= 1 treat as fraction and multiply by 100.
    // Returns "—" when score is missing/invalid.
    function formatPercent(raw: number | null | undefined): string {
        if (
            raw === null ||
            raw === undefined ||
            typeof raw !== "number" ||
            Number.isNaN(raw)
        )
            return "—";
        const val = raw <= 1 ? raw * 100 : raw;
        return `${Math.round(val)}%`;
    }

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
</script>

<svelte:head>
    <title
        >{benchmark.capabilityName ?? benchmark.name} — Benchmark — TakeOverBench</title
    >
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

            <div class="bg-surface-primary rounded-lg p-6 shadow-sm">
                <div class="md:flex md:items-start md:justify-between gap-6">
                    <div class="flex-1">
                        {#if benchmark.url}
                            <a
                                href={benchmark.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                class="inline-flex items-center gap-2 text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
                            >
                                <h1>
                                    {benchmark.capabilityName ?? benchmark.name}
                                </h1>
                                <svg
                                    class="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                    />
                                </svg>
                            </a>
                        {:else}
                            <h1 class="text-2xl font-bold text-gray-900">
                                {benchmark.capabilityName ?? benchmark.name}
                            </h1>
                        {/if}
                        {#if benchmark.capabilityName}
                            <h2 class="text-sm text-gray-500 mt-1">
                                {benchmark.name}
                            </h2>
                        {/if}
                        <p class="text-sm text-gray-600 mt-2 max-w-2xl">
                            {benchmark.description}
                        </p>

                        <div
                            class="mt-4 flex flex-wrap gap-3 text-xs text-gray-500"
                        >
                            {#if benchmark.humanBaseline}
                                <div class="px-2 py-1 bg-gray-300 rounded">
                                    Human: {benchmark.humanBaseline}%
                                </div>
                            {/if}
                            {#if benchmark.expertBaseline}
                                <div class="px-2 py-1 bg-gray-300 rounded">
                                    Expert: {benchmark.expertBaseline}%
                                </div>
                            {/if}
                        </div>
                    </div>

                    <div class="w-full md:w-48 mt-4 md:mt-0 text-right">
                        {#if topScoreEntry}
                            <div class="text-3xl font-extrabold text-blue-400">
                                {Math.round(topScoreEntry.score * 100)}%
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
                <div class="mt-6 bg-surface-primary rounded p-4">
                    <!-- only render the chart once client-side to avoid SSR / Chart.js issues -->
                    {#if !hydrated}
                        <div
                            class="h-[420px] flex items-center justify-center text-gray-400"
                        >
                            Chart loading…
                        </div>
                    {:else if MainChart}
                        <svelte:component
                            this={MainChart}
                            {selectedBenchmarks}
                            height="420px"
                            showLegend={true}
                        />
                    {:else}
                        <div
                            class="h-[420px] flex items-center justify-center text-red-600"
                        >
                            Failed to load chart
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
                                                    >{formatPercent(
                                                        s.score,
                                                    )}</span
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

                <!-- Related threat models -->
                {#if relatedThreatModels && relatedThreatModels.length > 0}
                    <div class="mt-6">
                        <h3 class="text-lg font-semibold text-gray-900 mb-3">
                            Related threat models
                        </h3>
                        <div
                            class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
                        >
                            {#each relatedThreatModels as t}
                                <a
                                    href={"/threat/" + t.id}
                                    class="block bg-surface-primary border border-gray-200 rounded p-3 hover:shadow no-underline text-current"
                                >
                                    <div class="font-medium text-gray-900">
                                        {t.name}
                                    </div>

                                    {#if t.capabilities && t.capabilities.length > 0}
                                        <div class="text-xs text-gray-500 mt-1">
                                            {#each t.capabilities as c, ci}
                                                <span
                                                    >{c.label ??
                                                        "Capability"}{ci <
                                                    t.capabilities.length - 1
                                                        ? ", "
                                                        : ""}</span
                                                >
                                            {/each}
                                        </div>
                                    {/if}
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
