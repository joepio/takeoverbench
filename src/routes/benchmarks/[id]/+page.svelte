<script lang="ts">
  import { models } from "$lib/data";
  import type { Benchmark } from "$lib/types";
  import { linkifyCitations } from "$lib/utils";
  import { onMount } from "svelte";

  import BenchmarkFreshness from "$lib/components/BenchmarkFreshness.svelte";

  export let data: {
    benchmark: Benchmark;
    relatedThreatModels?: {
      id: string;
      name: string;
      capabilities?: { label?: string | null }[];
    }[];
  };

  $: ({ benchmark, relatedThreatModels = [] } = data);

  function getModelNameById(id: string) {
    return models.find((m) => m.id === id)?.name ?? id;
  }

  function getModelReleaseDateById(id: string) {
    return models.find((m) => m.id === id)?.releaseDate ?? null;
  }

  function formatDate(dateStr: string | null | undefined): string {
    if (!dateStr) return "—";
    const t = Date.parse(dateStr);
    if (Number.isNaN(t)) return "—";
    return new Date(t).toISOString().slice(0, 10);
  }

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

  $: topScoreEntry = (benchmark?.scores ?? []).reduce(
    (best, cur) => {
      if (!best) return cur;
      return cur.score > best.score ? cur : best;
    },
    null as { modelId: string; score: number } | null
  );

  $: selectedBenchmarks = [benchmark?.id];

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
  <title>{benchmark?.capabilityName} — Benchmark — TakeOverBench</title>
  <meta name="description" content={benchmark?.description} />
</svelte:head>

<main class="min-h-screen bg-gray-50">
  <section class="py-12">
    <div class="container mx-auto px-4 md:px-6 lg:px-10 max-w-7xl">
      {#if benchmark}
        <nav class="text-sm mb-8">
          <a href="/" class="hover:underline opacity-70">Home</a>
          <span class="mx-2 opacity-30">/</span>
          <a href="/benchmarks" class="hover:underline opacity-70">Benchmarks</a
          >
          <span class="mx-2 opacity-30">/</span>
          <span class="text-gray-900 font-medium">{benchmark.name}</span>
        </nav>

        <div
          class="bg-surface-primary rounded-2xl p-6 md:p-10 shadow-sm border border-gray-900/5"
        >
          <!-- Header Area -->
          <div
            class="flex flex-col md:flex-row md:items-start md:justify-between gap-10 pb-8 border-b border-gray-100/10"
          >
            <div class="flex-1">
              <h1
                class="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight"
              >
                {benchmark.capabilityName}
              </h1>

              {#if benchmark.capabilityDefinition}
                <div
                  class="text-lg mt-6 text-gray-800 leading-relaxed max-w-4xl font-medium"
                >
                  {@html linkifyCitations(benchmark.capabilityDefinition)}
                </div>
              {/if}

              <div class="mt-8">
                {#if benchmark.url}
                  <a
                    href={benchmark.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="group inline-flex items-center gap-3 text-xl font-bold text-gray-900 hover:text-blue-400 transition-colors"
                  >
                    <h2>{benchmark.name}</h2>
                    <svg
                      class="w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity"
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
                  <h2 class="text-xl font-bold text-gray-900">
                    {benchmark.name}
                  </h2>
                {/if}

                <div
                  class="text-lg mt-3 text-gray-800 leading-relaxed max-w-3xl"
                >
                  {@html linkifyCitations(benchmark.description)}
                </div>
              </div>
            </div>

            <div class="w-full md:w-64 flex flex-col items-center md:items-end">
              {#if topScoreEntry}
                <div class="text-center md:text-right">
                  <div
                    class="text-5xl font-extrabold text-blue-400 tracking-tighter"
                  >
                    {Math.round(topScoreEntry.score * 100)}%
                  </div>
                  <div
                    class="text-sm mt-2 text-gray-900 font-bold uppercase tracking-wide"
                  >
                    {getModelNameById(topScoreEntry.modelId)}
                  </div>
                </div>
              {:else}
                <div
                  class="text-sm font-bold opacity-50 uppercase tracking-widest"
                >
                  No Data
                </div>
              {/if}

              <div
                class="mt-6 pt-6 border-t border-gray-100/10 w-full flex justify-center md:justify-end"
              >
                <BenchmarkFreshness {benchmark} />
              </div>
            </div>
          </div>

          <!-- Body Content Area -->
          <div class="space-y-10 pt-4">
            <!-- Context Group -->
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-16">
              {#if benchmark.motivation}
                <div class="lg:col-span-12 max-w-4xl">
                  <h2 class="text-2xl font-bold text-gray-900 mb-6">
                    Why this benchmark?
                  </h2>
                  <div class="text-lg text-gray-800 leading-relaxed">
                    {@html linkifyCitations(benchmark.motivation)}
                  </div>
                </div>
              {/if}

              {#if relatedThreatModels && relatedThreatModels.length > 0}
                <div class="lg:col-span-12">
                  <h3 class="text-2xl font-bold text-gray-900 mb-6">
                    Related takeover scenarios
                  </h3>
                  <div
                    class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
                  >
                    {#each relatedThreatModels as t}
                      <a
                        href={"/threat/" + t.id}
                        class="group block bg-gray-50/5 border border-gray-900/20 rounded-xl p-5 hover:shadow-2xl hover:border-blue-400/30 hover:bg-gray-900/40 transition-all no-underline text-current"
                      >
                        <div
                          class="text-lg font-bold text-gray-900 group-hover:text-blue-500 transition-colors"
                        >
                          {t.name}
                        </div>
                        {#if t.capabilities && t.capabilities.length > 0}
                          <div
                            class="text-[10px] mt-3 opacity-40 uppercase font-mono tracking-widest font-bold"
                          >
                            {#each t.capabilities as c, ci}
                              <span
                                >{c.label ?? "Capability"}{ci <
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
            </div>

            <!-- Visualization Group -->
            <div class="space-y-8">
              <h2 class="text-2xl font-bold text-gray-900">Over time</h2>
              <div
                class="bg-transparent rounded-2xl p-6 border border-gray-100/10 min-h-[480px] flex flex-col justify-center"
              >
                {#if !hydrated}
                  <div
                    class="flex items-center justify-center text-gray-400 font-mono text-xs uppercase tracking-widest animate-pulse"
                  >
                    Initializing Visualization...
                  </div>
                {:else if MainChart}
                  <svelte:component
                    this={MainChart}
                    {selectedBenchmarks}
                    height="440px"
                    showLegend={true}
                  />
                {:else}
                  <div
                    class="flex items-center justify-center text-red-500 font-bold uppercase tracking-widest"
                  >
                    Visual rendering failed
                  </div>
                {/if}
              </div>
            </div>

            <!-- Table Group -->
            <div class="space-y-8">
              <h2 class="text-2xl font-bold text-gray-900">
                Complete Model results
              </h2>
              {#if (benchmark.scores ?? []).length === 0}
                <div
                  class="p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-500 italic"
                >
                  No score records found for this telemetry set.
                </div>
              {:else}
                <div
                  class="overflow-hidden rounded-xl border border-gray-100/10 bg-transparent"
                >
                  <table class="w-full text-left">
                    <thead>
                      <tr
                        class="bg-transparent text-[11px] uppercase font-bold tracking-widest text-gray-500 border-b border-gray-100/10"
                      >
                        <th class="py-5 px-6">Model Architecture</th>
                        <th class="py-5 px-6">Performance Metric</th>
                        <th class="py-5 px-6">Canonical Release</th>
                      </tr>
                    </thead>
                    <tbody class="text-sm">
                      {#each (benchmark.scores ?? []).sort((a, b) => b.score - a.score) as s}
                        <tr
                          class="border-b border-gray-100/10 last:border-0 hover:bg-gray-100/5 transition-colors"
                        >
                          <td class="py-5 px-6 font-bold text-gray-900"
                            >{getModelNameById(s.modelId)}</td
                          >
                          <td class="py-5 px-6">
                            <span
                              class="inline-flex items-center justify-center px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 font-extrabold text-xs"
                              >{formatPercent(s.score)}</span
                            >
                          </td>
                          <td class="py-5 px-6 text-gray-500 font-medium"
                            >{formatDate(
                              getModelReleaseDateById(s.modelId) ?? s.date
                            )}</td
                          >
                        </tr>
                      {/each}
                    </tbody>
                  </table>
                </div>
              {/if}
            </div>

            {#if benchmark.url}
              <div
                class="pt-8 opacity-30 text-[11px] uppercase tracking-widest font-bold"
              >
                Verification Source // <a
                  href={benchmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="hover:text-blue-500 underline decoration-dotted"
                  >{benchmark.url}</a
                >
              </div>
            {/if}
          </div>
        </div>
      {/if}
    </div>
  </section>
</main>

<style>
  :global(.line-clamp-3) {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
