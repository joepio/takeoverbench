<script lang="ts">
  import { models } from "$lib/data";
  import type { Benchmark } from "$lib/types";

  export let benchmark: Benchmark;
  export let compact: boolean = false;

  // Helper to get date of the latest score
  function getLatestScoreDate(bench: Benchmark): Date | null {
    if (!bench.scores || bench.scores.length === 0) return null;

    let maxMs = -Infinity;
    for (const s of bench.scores) {
      const m = models.find((mod) => mod.id === s.modelId);
      // Prefer model release date, fallback to score date
      let dateStr = m?.releaseDate ?? s.date;
      if (!dateStr) continue;
      const ms = Date.parse(dateStr);
      if (!Number.isNaN(ms) && ms > maxMs) {
        maxMs = ms;
      }
    }
    return maxMs > -Infinity ? new Date(maxMs) : null;
  }

  const latestDate = getLatestScoreDate(benchmark);
  const today = new Date();

  let monthsOld = 0;
  let colorClass = "text-gray-400";

  if (latestDate) {
    const diffTime = today.getTime() - latestDate.getTime();
    const daysAgo = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    monthsOld = Math.max(0, Math.floor(daysAgo / 30.43));

    if (monthsOld < 3) {
      colorClass = "text-blue-400";
    } else if (monthsOld < 6) {
      colorClass = "text-amber-500/90";
    } else {
      colorClass = "text-red-500/80";
    }
  }
</script>

{#if latestDate}
  <div class="text-center md:text-right">
    <div
      class="{compact
        ? 'text-3xl'
        : 'text-5xl'} font-extrabold tracking-tighter {compact
        ? 'text-gray-900'
        : colorClass}"
    >
      {monthsOld}
    </div>
    <div
      class="{compact ? 'text-[10px]' : 'text-sm'} {compact
        ? 'mt-0'
        : 'mt-2'} text-gray-900 font-bold uppercase tracking-wide"
    >
      months no update
    </div>
  </div>
{/if}
