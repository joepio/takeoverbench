<script lang="ts">
  import { onMount } from "svelte";
  import {
    benchmarks,
    threatModels,
    models,
    getBenchmarkById,
  } from "$lib/data";

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
  <div class="container mx-auto px-4 md:px-6 lg:px-10 max-w-7xl">
    <header class="text-center mb-10">
      <h1 class="text-4xl font-bold text-gray-900">TakeOverBench</h1>
      <p class="mt-2 mx-auto">
        AI is rapidly getting more dangerous. We track progress towards an AI
        takeover scenario.
      </p>
    </header>

    <!-- Benchmark Overview Section -->
    <section class="mb-12">
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-gray-900">
          Dangerous capabilities timeline
        </h2>
        <p class="text-lg text-gray-800 leading-relaxed">
          According to "Model evaluation for extreme risks" (Shevlane, 2023),
          the most dangerous AI capabilities include Cyber-offense, Persuasion &
          manipulation, Political strategy, Weapons acquisition, Long-horizon
          planning, AI development, Situational awareness, and
          Self-proliferation. Progress on these capabilities is shown below.
        </p>
      </div>

      <!-- Chart -->
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

      <div class="text-center">
        <a
          href="/benchmarks"
          class="inline-flex items-center gap-2 px-6 py-3 bg-surface-primary text-gray-900 font-medium rounded-lg border border-gray-900 hover:bg-black transition-colors duration-150"
        >
          Explore the Benchmarks
        </a>
      </div>
    </section>

    <!-- Takeover scenarios section -->
    <section>
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-gray-900">
          How do dangerous capabilities lead to a takeover?
        </h2>
        <p class="mt-2">
          Based on the literature, these are four plausible AI takeover
          scenarios.
        </p>
      </div>

      {#if threatModels && threatModels.length > 0}
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {#each threatModels as t (t.id)}
            <a
              href={"/threat/" + t.id}
              class="group block bg-surface-primary border rounded-xl transition-all duration-300 no-underline text-current {t.id ===
              'selfImprovement'
                ? 'p-10 border-red-500/30 bg-red-500/[0.03] hover:shadow-red-500/10'
                : 'p-8 border-gray-400/20 hover:shadow-2xl hover:border-blue-400/30 hover:bg-gray-100/5'}"
              aria-labelledby={"threat-" + t.id + "-title"}
            >
              <div class="flex items-start justify-between mb-4">
                <div class="flex flex-col gap-1">
                  {#if t.id === "selfImprovement"}
                    <span
                      class="text-[10px] uppercase tracking-[0.2em] font-black text-red-500 mb-1"
                      >Critical Driver</span
                    >
                  {/if}
                  <h2
                    id={"threat-" + t.id + "-title"}
                    class="text-xl font-bold text-gray-900 group-hover:text-blue-400 transition-colors leading-tight"
                  >
                    {t.name}
                  </h2>
                </div>
                <div
                  class="text-[11px] uppercase tracking-widest font-bold text-gray-400 whitespace-nowrap mt-1.5 bg-gray-100/5 px-2 py-1 rounded"
                >
                  {t.benchmarks?.length ?? 0} benchmarks
                </div>
              </div>

              <p class="text-base text-gray-700 mb-6 leading-relaxed">
                {t.shortDescription ?? t.longDescription?.slice(0, 120) + "..."}
              </p>

              {#if t.benchmarks && t.benchmarks.length > 0}
                <div class="text-xs">
                  <div class="mb-1">
                    <strong>Required capabilities:</strong>
                  </div>
                  <ul class="list-disc list-inside space-y-1">
                    {#each t.benchmarks.slice(0, 4) as bid (bid)}
                      <li class="text-sm">
                        {capabilityName(bid)}
                      </li>
                    {/each}
                    {#if t.benchmarks.length > 4}
                      <li class="text-sm text-gray-700">
                        and {t.benchmarks.length - 4} more…
                      </li>
                    {/if}
                  </ul>
                </div>
              {:else}
                <div class="text-xs text-gray-700">
                  No benchmarks listed for this threat.
                </div>
              {/if}
            </a>
          {/each}
        </div>

        <div class="mb-6">
          <p class="mt-2" style="font-style: italic;">
            We aim to use the best available benchmarks and the most plausible
            AI takeover scenarios, but the field of AI safety is rapidly
            developing. Some benchmark scores may therefore not perfectly
            reflect the actual associated dangerous capability, and some experts
            may disagree on the likeliness of specific threat models.
          </p>
        </div>
      {:else}
        <div class="bg-surface-primary rounded-lg p-8 text-center shadow-sm">
          <p>No takeover scenarios found.</p>
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
