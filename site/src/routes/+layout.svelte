<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/Header.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href="/favicon.png" />
</svelte:head>

<Header />

<div class="min-h-screen">
	{@render children?.()}
</div>

<footer class="bg-gray-50 border-t border-gray-200 mt-20">
	<div class="container mx-auto px-4 py-8 max-w-7xl">
		<div class="flex flex-col md:flex-row justify-between items-center gap-4">
			<div class="text-sm text-gray-600">
				© 2024 TakeOverBench. Data-driven AI safety research.
			</div>
			<div class="flex gap-6 text-sm">
				<a href="/about" class="text-gray-600 hover:text-gray-900">About</a>
				<a href="https://github.com/pauseai/takeoverbench" target="_blank" rel="noopener noreferrer" class="text-gray-600 hover:text-gray-900">GitHub</a>
				<a href="https://pauseai.info" target="_blank" rel="noopener noreferrer" class="text-gray-600 hover:text-gray-900">PauseAI</a>
			</div>
		</div>
	</div>
</footer>
