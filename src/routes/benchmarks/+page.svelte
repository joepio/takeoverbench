<script lang="ts">
  import { onMount } from "svelte";
  import { benchmarks, models } from "$lib/data";
  import BenchmarkFreshness from "$lib/components/BenchmarkFreshness.svelte";

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
          Overview of representative benchmarks. Use the chart to compare
          progress across selected benchmarks and inspect recent scores.
        </p>
      </div>

      <!-- Compact combined chart (same as home) -->
      <div class="bg-surface-primary rounded-lg shadow-sm p-6 mb-8">
        {#if !hydrated}
          <div class="h-[520px] flex items-center justify-center text-gray-700">
            Chart loading…
          </div>
        {:else if MainChart}
          <svelte:component
            this={MainChart}
            {selectedBenchmarks}
            height="520px"
          />
        {:else}
          <div class="h-[520px] flex items-center justify-center text-red-600">
            Failed to load chart
          </div>
        {/if}
      </div>

      <!-- All benchmark cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        {#each benchmarks as benchmark}
          <a
            href={"/benchmarks/" + benchmark.id}
            class="block bg-surface-primary rounded-2xl border border-gray-900 p-6 md:p-8 transition-all duration-200 hover:shadow-md no-underline text-current focus:outline-none focus:ring-2 focus:ring-blue-100"
            style="border-left: 4px solid {benchmark.color}"
          >
            <div class="flex flex-col md:flex-row justify-between gap-8 h-full">
              <div class="flex-1 flex flex-col">
                <div class="flex justify-between items-start mb-4">
                  <div>
                    <h3 class="font-bold text-xl text-gray-900 leading-tight">
                      {benchmark.capabilityName ?? benchmark.name}
                    </h3>
                    <p
                      class="text-xs text-gray-400 mt-1 font-bold uppercase tracking-widest"
                    >
                      {benchmark.name}
                    </p>
                  </div>
                </div>

                <p
                  class="text-sm text-gray-700 leading-relaxed mb-6 line-clamp-3"
                >
                  {benchmark.capabilityDefinition}
                </p>

                <div class="mt-auto"></div>
              </div>

              <div
                class="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-8 border-t md:border-t-0 md:border-l border-gray-100/10 pt-6 md:pt-0 md:pl-8 min-w-[140px]"
              >
                {#if benchmark.scores && benchmark.scores.length > 0}
                  {@const sortedScores = [...benchmark.scores].sort(
                    (a, b) => b.score - a.score
                  )}
                  {@const topScore = sortedScores[0]}
                  <div class="text-center md:text-right">
                    <div
                      class="text-3xl font-extrabold tracking-tighter text-gray-900"
                    >
                      {Math.round(
                        typeof topScore.score === "number" &&
                          topScore.score <= 1
                          ? topScore.score * 100
                          : topScore.score
                      )}%
                    </div>
                    <div
                      class="text-[10px] mt-1 text-gray-900 font-bold uppercase tracking-wider"
                    >
                      {getModelNameById(topScore.modelId)}
                    </div>
                  </div>
                {:else}
                  <div
                    class="text-[10px] font-bold opacity-30 uppercase tracking-widest"
                  >
                    No Data
                  </div>
                {/if}

                <div class="md:mt-auto">
                  <BenchmarkFreshness {benchmark} compact={true} />
                </div>
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
