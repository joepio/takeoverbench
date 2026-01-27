<script lang="ts">
  import "../app.css";
  import Header from "$lib/components/Header.svelte";
  import { toast, shareWebsite } from "$lib/toast.svelte";

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href="/favicon.svg" />
</svelte:head>

<Header />

<div class="min-h-screen">
  {@render children?.()}
</div>

{#if toast.show}
  <div
    class="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] animate-fade-in pointer-events-none"
  >
    <div
      class="bg-primary text-white px-6 py-3 rounded-xl shadow-2xl font-bold border border-white/20 text-center"
    >
      {toast.message}
    </div>
  </div>
{/if}

<footer class="bg-gray-50 border-t border-gray-400/10 mt-20">
  <div class="container mx-auto px-5 md:px-6 lg:px-8 py-8 max-w-7xl">
    <div class="flex flex-col md:flex-row justify-between items-center gap-4">
      <p class="text-sm">
        Have suggestions or found something wrong? Add an issue on <a
          href="https://github.com/pauseai/takeoverbench"
          target="_blank"
          rel="noopener noreferrer">GitHub</a
        >
      </p>
      <div class="flex gap-6 text-sm">
        <button
          onclick={shareWebsite}
          class="text-gray-800 hover:text-gray-900 cursor-pointer border-none bg-transparent p-0 font-inherit"
        >
          Share
        </button>
        <a href="/about">About</a>
        <a
          href="https://github.com/pauseai/takeoverbench"
          target="_blank"
          rel="noopener noreferrer">GitHub</a
        >
      </div>
    </div>
  </div>
</footer>
