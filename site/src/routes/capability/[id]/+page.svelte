<script lang="ts">
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import MainChart from "$lib/components/MainChart.svelte";
  import {
    getCapabilityById,
    getBenchmarkById,
    benchmarks as allBenchmarks,
  } from "$lib/data";
  import type { Capability, Benchmark } from "$lib/types";
  import { getCapabilityLevelColor, getCapabilityLevelLabel } from "$lib/styles/theme";

  // read route param
  let id: string;
  $: id = $page?.params?.id ?? "";

  // capability data
  let capability: Capability | undefined = undefined;

  // benchmarks relevant to this capability
  let relevantBenchmarkIds: string[] = [];
  let relevantBenchmarks: Benchmark[] = [];

  // simple not-found state
  let notFound = false;

  $: if (id) {
    capability = getCapabilityById(id);
    notFound = !capability;
    if (capability) {
      relevantBenchmarkIds = capability.benchmarks ?? [];
      relevantBenchmarks = relevantBenchmarkIds
        .map((bid) => getBenchmarkById(bid))
        .filter(Boolean) as Benchmark[];
    } else {
      relevantBenchmarkIds = [];
      relevantBenchmarks = [];
    }
  }

  // small helper to format projection lines
  function formatProjected(label: string | number | undefined) {
    return label ?? "—";
  }
</script>

<svelte:head>
  <title>{capability ? `${capability.name} — Capability` : "Capability"} - TakeOverBench</title>
  <meta
    name="description"
    content={capability?.description ?? "Capability details and benchmarks"}
  />
</svelte:head>

<main class="min-h-screen bg-gray-50">
  <div class="container mx-auto px-4 py-10 max-w-6xl">
    {#if notFound}
      <div class="bg-white rounded-lg p-8 shadow-sm text-center">
        <h2 class="text-2xl font-semibold text-gray-900 mb-2">Capability not found</h2>
        <p class="text-gray-600 mb-4">No capability with id <span class="font-mono">{id}</span> was found.</p>
        <a href="/" class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Back home</a>
      </div>
    {:else if capability}
      <div class="bg-white rounded-lg p-8 shadow-sm">
        <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">{capability.name}</h1>
            <p class="text-gray-600 mt-2 max-w-2xl">{capability.description}</p>

            <div class="flex flex-wrap gap-4 mt-4">
              <div class="bg-gray-50 rounded-lg p-3">
                <div class="text-xs text-gray-500">Current Level</div>
                <div class="text-2xl font-semibold" style="color: {getCapabilityLevelColor(capability.currentLevel)}">
                  {capability.currentLevel}%
                </div>
                <div class="text-xs text-gray-500 mt-1">{getCapabilityLevelLabel(capability.currentLevel)}</div>
              </div>

              <div class="bg-gray-50 rounded-lg p-3">
                <div class="text-xs text-gray-500">Projected 2025</div>
                <div class="text-lg font-medium">{formatProjected(capability.projectedLevel2025)}%</div>
              </div>

              <div class="bg-gray-50 rounded-lg p-3">
                <div class="text-xs text-gray-500">Projected 2030</div>
                <div class="text-lg font-medium">{formatProjected(capability.projectedLevel2030)}%</div>
              </div>
            </div>
          </div>

          <div class="w-full md:w-80">
            <div class="bg-white border rounded-md p-4">
              <div class="text-xs text-gray-500">Benchmarks measuring this capability</div>
              <div class="mt-3 space-y-2">
                {#if relevantBenchmarks.length === 0}
                  <div class="text-sm text-gray-500">No linked benchmarks.</div>
                {:else}
                  {#each relevantBenchmarks as b}
                    <a href={"/benchmarks/" + b.id} class="block p-2 rounded hover:bg-gray-50 no-underline">
                      <div class="flex items-center justify-between">
                        <div class="text-sm font-medium text-gray-900">{b.name}</div>
                        <div class="text-xs text-gray-500">{b.category}</div>
                      </div>
                      {#if b.humanBaseline || b.expertBaseline}
                        <div class="text-xs text-gray-500 mt-1">
                          {#if b.humanBaseline}Human: {b.humanBaseline}% {/if}
                          {#if b.expertBaseline} • Expert: {b.expertBaseline}%{/if}
                        </div>
                      {/if}
                    </a>
                  {/each}
                {/if}
              </div>
            </div>
          </div>
        </div>

        {#if relevantBenchmarkIds.length > 0}
          <div class="mt-8 bg-gray-50 rounded-lg p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-3">Benchmark progress</h2>
            <p class="text-sm text-gray-600 mb-4">This chart shows progress on all benchmarks that measure <strong>{capability.name}</strong>.</p>

            <MainChart selectedBenchmarks={relevantBenchmarkIds} height="420px" />
          </div>
        {/if}

        <div class="mt-8">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">More details</h3>
          <div class="prose max-w-none text-sm text-gray-700">
            <p><strong>Category:</strong> {capability.category}</p>
            <p><strong>Benchmarks:</strong> {relevantBenchmarkIds.length > 0 ? relevantBenchmarkIds.join(", ") : "—"}</p>
          </div>
        </div>
      </div>
    {:else}
      <!-- Loading fallback (rare since this is synchronous) -->
      <div class="bg-white rounded-lg p-8 shadow-sm text-center">
        <div class="text-gray-600">Loading…</div>
      </div>
    {/if}
  </div>
</main>

<style>
  /* minimal spacing helpers; rely on Tailwind, but keep a fallback style */
  .prose :global(a) { color: inherit; text-decoration: underline; }
</style>
