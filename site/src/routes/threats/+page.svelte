<script lang="ts">
  import { threatModels, calculateThreatRisk } from "$lib/data";
  import {
    getRiskColor,
    getRiskBackgroundColor,
    getTimeHorizonLabel,
  } from "$lib/styles/theme";

  // Compute current risk for display
  const threatModelsWithRisk = threatModels
    .map((tm) => ({ ...tm, currentRisk: calculateThreatRisk(tm) }))
    .sort((a, b) => b.currentRisk - a.currentRisk);
</script>

<svelte:head>
  <title>Threat Models — TakeOverBench</title>
  <meta
    name="description"
    content="List of threat models, their risk levels and indicators for TakeOverBench."
  />
</svelte:head>

<main class="min-h-screen bg-gray-50">
  <section class="bg-white border-b border-gray-200">
    <div class="container mx-auto px-4 py-10 max-w-7xl">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Threat Models</h1>
          <p class="text-gray-600 mt-1">
            Catalog of modeled threats, their indicators, mitigations and an
            estimate of current risk based on capability data.
          </p>
        </div>
        <div class="text-right">
          <div class="text-sm text-gray-500">Total</div>
          <div class="text-2xl font-semibold text-gray-900">{threatModels.length}</div>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each threatModelsWithRisk as threat}
          <a
            href={"/threat/" + threat.id}
            class="block bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200"
            style="border-top: 4px solid {getRiskColor(threat.riskLevel)}"
          >
            <div class="flex justify-between items-start mb-3">
              <h3 class="font-semibold text-gray-900">{threat.name}</h3>
              <span
                class="text-xs px-2 py-1 rounded-full font-medium"
                style="background-color: {getRiskBackgroundColor(threat.riskLevel)}; color: {getRiskColor(threat.riskLevel)}"
              >
                {threat.riskLevel}
              </span>
            </div>

            <p class="text-sm text-gray-600 mb-4">{threat.shortDescription}</p>

            <div class="flex items-center justify-between text-xs text-gray-500 mb-4">
              <div>Timeline: <span class="font-medium text-gray-700">{getTimeHorizonLabel(threat.timeHorizon)}</span></div>
              <div>Current Risk: <span class="font-semibold" style="color: {getRiskColor(threat.riskLevel)}">{Math.round(threat.currentRisk)}%</span></div>
            </div>

            <div class="w-full bg-gray-200 rounded-full h-2">
              <div
                class="h-2 rounded-full transition-all duration-500"
                style="width: {Math.min(100, Math.round(threat.currentRisk))}%; background-color: {getRiskColor(threat.riskLevel)}"
              ></div>
            </div>

            <div class="mt-4 text-xs text-gray-500">
              <div class="mb-1"><strong>Indicators:</strong></div>
              <ul class="list-disc list-inside space-y-1">
                {#each threat.indicators.slice(0, 3) as ind}
                  <li>{ind}</li>
                {/each}
                {#if threat.indicators.length > 3}
                  <li class="text-gray-400">and {threat.indicators.length - 3} more…</li>
                {/if}
              </ul>
            </div>
          </a>
        {/each}
      </div>

      <div class="text-center mt-10">
        <a
          href="/"
          class="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 font-medium rounded-lg border border-blue-600 hover:bg-blue-50 transition-colors duration-150"
        >
          Back to Home
        </a>
      </div>
    </div>
  </section>
</main>

<style>
  /* small animation for entries */
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  a.block {
    animation: fadeInUp 0.45s ease-out;
  }
</style>
