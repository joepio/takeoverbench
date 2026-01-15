<script lang="ts">
  import { onMount } from "svelte";
  import type { PageData } from "./$types";
  import { benchmarks, getBenchmarkById } from "$lib/data";
  import { linkifyCitations } from "$lib/utils";

  export let data: PageData;

  const { threatModel, benchmarkIds, mdPath } = data ?? {};

  let MainChart: any = null;
  let ThreatComponent: any = null;
  let hydrated = false;
  let chartLoadError: string | null = null;
  let mdLoadError: string | null = null;

  const allRequestedBenchmarks: string[] = (
    Array.isArray(benchmarkIds) && benchmarkIds.length > 0
      ? benchmarkIds
      : (threatModel?.benchmarks ?? [])
  ).filter(Boolean);

  const selectedBenchmarks: string[] = allRequestedBenchmarks.filter(
    (id) => getBenchmarkById(id) !== undefined
  );

  const missingBenchmarks: string[] = allRequestedBenchmarks.filter(
    (id) => getBenchmarkById(id) === undefined
  );

  function capabilityName(id: string) {
    const b = getBenchmarkById(id);
    return b ? b.capabilityName : id;
  }

  onMount(async () => {
    hydrated = true;

    try {
      const mod = await import("$lib/components/MainChart.svelte");
      MainChart = mod?.default ?? mod;
    } catch (e) {
      chartLoadError = String(e);
      console.error("[threat] failed to load MainChart:", e);
    }

    if (mdPath) {
      try {
        const modules = import.meta.glob(
          "../../../../threat_models/*.{md,svx}"
        );
        const loader = modules[mdPath] as (() => Promise<any>) | undefined;
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
      try {
        const modules = import.meta.glob(
          "../../../../threat_models/*.{md,svx}"
        );
        const key = Object.keys(modules).find(
          (k) =>
            k.endsWith(`${threatModel?.id}.md`) ||
            k.endsWith(`${threatModel?.id}.svx`)
        );
        if (key) {
          const loader = modules[key] as () => Promise<any>;
          const mod = await loader();
          ThreatComponent = mod?.default ?? mod;
        }
      } catch (e) {
        ThreatComponent = null;
      }
    }
  });
</script>

<svelte:head>
  <title>{threatModel?.name ?? "Takeover Scenario"} — TakeOverBench</title>
  <meta name="description" content={threatModel?.shortDescription ?? ""} />
</svelte:head>

<main class="min-h-screen bg-gray-50">
  <section class="py-12">
    <div class="container mx-auto px-4 md:px-6 lg:px-10 max-w-7xl">
      <nav class="text-sm mb-8">
        <a href="/" class="hover:underline opacity-70">Home</a>
        <span class="mx-2 opacity-30">/</span>
        <a href="/threats" class="hover:underline opacity-70"
          >Takeover Scenarios</a
        >
        <span class="mx-2 opacity-30">/</span>
        <span class="text-gray-900 font-medium">{threatModel?.name}</span>
      </nav>

      <div
        class="bg-surface-primary rounded-2xl p-6 md:p-10 shadow-sm border border-gray-100/10"
      >
        <!-- Header -->
        <header class="pb-8 border-b border-gray-100/10 mb-8">
          <h1
            class="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight text-center"
          >
            {threatModel?.name}
          </h1>
        </header>

        <div class="space-y-10 pt-4">
          <!-- Description / Narrative -->
          <div class="mx-auto max-w-4xl">
            <div class="text-lg text-gray-800 leading-relaxed space-y-4">
              {#if hydrated && ThreatComponent}
                <svelte:component this={ThreatComponent} />
              {:else}
                <p>
                  {@html linkifyCitations(
                    threatModel?.longDescription ??
                      threatModel?.shortDescription ??
                      "No description available."
                  )}
                </p>
              {/if}

              <p
                class="pt-6 border-t border-gray-100/10 text-sm font-medium italic opacity-70"
              >
                This narrative presents one of the many possible ways in which
                an actual takeover may happen. We cannot predict how such a
                takeover will unfold exactly. We do however claim that once AIs
                have the dangerous capabilities listed on this page, takeover
                scenarios like this one become possible.
              </p>
            </div>
          </div>

          <!-- Benchmarks Section -->
          <div class="space-y-10">
            <div class="mx-auto max-w-4xl">
              <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">
                Dangerous capabilities required
              </h2>

              <div class="flex flex-wrap justify-center gap-3">
                {#each selectedBenchmarks as bid (bid)}
                  <a
                    href={"/benchmarks/" + bid}
                    class="px-4 py-2 bg-gray-50/5 border border-gray-900/10 rounded-full text-sm font-bold text-gray-900 hover:border-blue-400/30 hover:bg-white/5 transition-all no-underline"
                  >
                    {capabilityName(bid)}
                  </a>
                {/each}
              </div>

              {#if missingBenchmarks.length > 0}
                <div class="mt-6 text-center">
                  <span
                    class="text-[10px] uppercase tracking-widest font-bold opacity-30"
                    >Pending data: {missingBenchmarks.join(", ")}</span
                  >
                </div>
              {/if}
            </div>

            <!-- Chart -->
            <div class="space-y-6">
              <h3 class="text-xl font-bold text-gray-900 text-center">
                Capabilities over time
              </h3>
              <div
                class="border border-gray-100/10 rounded-2xl p-6 min-h-[480px] flex flex-col justify-center"
              >
                {#if !hydrated}
                  <div
                    class="flex items-center justify-center text-gray-400 font-mono text-xs uppercase tracking-widest animate-pulse"
                  >
                    Initializing Visualization...
                  </div>
                {:else if chartLoadError}
                  <div
                    class="flex items-center justify-center text-red-500 font-bold uppercase tracking-widest text-xs"
                  >
                    Error: {chartLoadError}
                  </div>
                {:else if MainChart}
                  {#if selectedBenchmarks.length > 0}
                    <svelte:component
                      this={MainChart}
                      {selectedBenchmarks}
                      height="440px"
                      showLegend={true}
                    />
                  {:else}
                    <div class="flex items-center justify-center text-gray-500">
                      No benchmark data available for this scenario.
                    </div>
                  {/if}
                {:else}
                  <div class="flex items-center justify-center text-gray-500">
                    Visualization engine unavailable
                  </div>
                {/if}
              </div>
            </div>
          </div>

          <!-- Sources -->
          {#if threatModel?.sources && threatModel.sources.length > 0}
            <div class="pt-12 border-t border-gray-100/10">
              <h2 class="text-xl font-bold text-gray-900 mb-6">
                Verification Sources
              </h2>
              <ul class="space-y-4">
                {#each threatModel.sources as source (source)}
                  <li
                    class="flex items-start gap-3 opacity-60 hover:opacity-100 transition-opacity"
                  >
                    <span class="text-blue-500 mt-1 flex-shrink-0">•</span>
                    <span
                      class="text-sm break-words leading-relaxed font-medium"
                    >
                      {source}
                    </span>
                  </li>
                {/each}
              </ul>
            </div>
          {/if}
        </div>

        <div class="mt-16 pt-8 border-t border-gray-100/10 text-center">
          <a
            href="/threats"
            class="inline-flex items-center gap-2 px-6 py-3 bg-gray-50/5 border border-gray-900/10 rounded-xl text-sm font-bold text-gray-900 hover:bg-white/5 hover:border-blue-400/30 transition-all"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Scenarios
          </a>
        </div>
      </div>
    </div>
  </section>
</main>

<style>
  .container {
    max-width: 72rem;
  }
</style>
