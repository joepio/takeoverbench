<script lang="ts">
    import { onMount } from "svelte";
    import { benchmarks, getBenchmarkById } from "$lib/data";

    export let data: any;

    // load() returns:
    // - threatModel: the ThreatModel object (simplified schema)
    // - benchmarkIds: optional explicit array of benchmark ids for the page to display
    // - mdPath: optional module key string pointing to a per-threat .md/.svx file
    const { threatModel, benchmarkIds, mdPath } = data ?? {};

    // Client-only dynamic pieces
    let MainChart: any = null;
    let ThreatComponent: any = null;
    let hydrated = false;
    let chartLoadError: string | null = null;
    let mdLoadError: string | null = null;

    // Determine which benchmark ids to show (prefer load-provided ids else the threat model's list)
    const allRequestedBenchmarks: string[] = (
        Array.isArray(benchmarkIds) && benchmarkIds.length > 0
            ? benchmarkIds
            : (threatModel?.benchmarks ?? [])
    ).filter(Boolean);

    // Filter to only include valid benchmark IDs that exist in our data
    const selectedBenchmarks: string[] = allRequestedBenchmarks.filter(
        (id) => getBenchmarkById(id) !== undefined,
    );

    // Track missing benchmarks for display
    const missingBenchmarks: string[] = allRequestedBenchmarks.filter(
        (id) => getBenchmarkById(id) === undefined,
    );

    function benchmarkName(id: string) {
        const b = getBenchmarkById(id);
        return b ? b.name : id;
    }

    onMount(async () => {
        hydrated = true;

        // Load chart component only on client to avoid SSR/Chart.js issues
        try {
            const mod = await import("$lib/components/MainChart.svelte");
            MainChart = mod?.default ?? mod;
        } catch (e) {
            chartLoadError = String(e);
            console.error("[threat] failed to load MainChart:", e);
        }

        // If load() returned an mdPath use it; otherwise try to find a module matching the threat id
        if (mdPath) {
            try {
                const modules = import.meta.glob(
                    "../../../../threat_models/*.{md,svx}",
                );
                const loader = modules[mdPath] as
                    | (() => Promise<any>)
                    | undefined;
                if (loader) {
                    const mod = await loader();
                    ThreatComponent = mod?.default ?? mod;
                }
            } catch (e) {
                mdLoadError = String(e);
                console.warn("[threat] failed to import md component:", e);
                ThreatComponent = null;
            }
        } else {
            // Try to find a matching file by name if the load didn't provide mdPath
            try {
                const modules = import.meta.glob(
                    "../../../../threat_models/*.{md,svx}",
                );
                const key = Object.keys(modules).find(
                    (k) =>
                        k.endsWith(`${threatModel?.id}.md`) ||
                        k.endsWith(`${threatModel?.id}.svx`),
                );
                if (key) {
                    const loader = modules[key] as () => Promise<any>;
                    const mod = await loader();
                    ThreatComponent = mod?.default ?? mod;
                }
            } catch (e) {
                // ignore; we will fall back to inline description
                ThreatComponent = null;
            }
        }
    });
</script>

<svelte:head>
    <title>{threatModel?.name ?? "Threat"} — TakeOverBench</title>
    <meta name="description" content={threatModel?.shortDescription ?? ""} />
</svelte:head>

<main class="min-h-screen bg-gray-50">
    <section class="bg-white border-b border-gray-200">
        <div class="container mx-auto px-4 py-8 max-w-5xl">
            <nav class="flex items-center gap-2 text-sm text-gray-600 mb-6">
                <a href="/" class="hover:text-gray-900">Home</a>
                <span>/</span>
                <a href="/threats" class="hover:text-gray-900">Threat Models</a>
                <span>/</span>
                <span class="text-gray-900">{threatModel?.name}</span>
            </nav>

            <h1 class="text-3xl font-bold text-gray-900 mb-4">
                {threatModel?.name}
            </h1>

            <div class="prose text-gray-700 mb-6">
                {#if hydrated && ThreatComponent}
                    <svelte:component this={ThreatComponent} />
                {:else}
                    <p>
                        {threatModel?.longDescription ??
                            threatModel?.shortDescription ??
                            "No description available."}
                    </p>
                {/if}
            </div>

            <!-- Benchmarks chart (client-only). Hidden/disabled on SSR. -->
            <section class="mb-8">
                <h2 class="text-xl font-semibold text-gray-900 mb-3">
                    Relevant Benchmarks
                </h2>

                {#if !hydrated}
                    <div
                        class="h-64 flex items-center justify-center text-gray-400"
                    >
                        Chart loading…
                    </div>
                {:else if chartLoadError}
                    <div class="text-sm text-red-600">
                        Chart failed to load: {chartLoadError}
                    </div>
                {:else if !MainChart}
                    <div
                        class="h-64 flex items-center justify-center text-gray-400"
                    >
                        Chart unavailable
                    </div>
                {:else if selectedBenchmarks.length === 0}
                    <div class="text-sm text-gray-500 mb-4">
                        No benchmarks available.
                        {#if missingBenchmarks.length > 0}
                            <div class="mt-2 text-xs text-gray-400">
                                Referenced benchmarks not yet in database: {missingBenchmarks.join(
                                    ", ",
                                )}
                            </div>
                        {/if}
                    </div>
                {:else}
                    <div class="bg-white rounded-lg p-4">
                        <svelte:component
                            this={MainChart}
                            {selectedBenchmarks}
                            height="420px"
                        />
                    </div>

                    {#if missingBenchmarks.length > 0}
                        <div
                            class="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800"
                        >
                            <strong>Note:</strong> Some referenced benchmarks
                            are not yet available:
                            <span class="font-mono text-xs"
                                >{missingBenchmarks.join(", ")}</span
                            >
                        </div>
                    {/if}
                {/if}
            </section>

            <!-- Benchmark list -->
            <section>
                <h3 class="text-lg font-medium text-gray-900 mb-2">
                    Benchmarks
                </h3>
                {#if selectedBenchmarks.length === 0 && missingBenchmarks.length === 0}
                    <div class="text-sm text-gray-500">
                        No benchmarks listed.
                    </div>
                {:else}
                    <ul
                        class="list-disc list-inside space-y-1 text-sm text-gray-700"
                    >
                        {#each selectedBenchmarks as bid (bid)}
                            <li>
                                <a
                                    href={"/benchmarks/" + bid}
                                    class="text-blue-600 hover:underline"
                                >
                                    {benchmarkName(bid)}
                                </a>
                            </li>
                        {/each}
                    </ul>
                {/if}
            </section>
        </div>
    </section>

    <div class="container mx-auto px-4 py-8 max-w-5xl">
        <a
            href="/threats"
            class="inline-block mt-6 px-4 py-2 bg-white border border-gray-200 rounded text-sm text-gray-700 hover:bg-gray-50"
            >Back to Threats</a
        >
    </div>
</main>

<style>
    .container {
        max-width: 72rem;
    }
    .prose p {
        margin: 0 0 0.75rem 0;
    }
</style>
