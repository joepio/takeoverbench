<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/Header.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href="/favicon.png" />
	<script src="https://swetrix.org/swetrix.js" defer></script>
	<script>
		document.addEventListener('DOMContentLoaded', function() {
			swetrix.init('RKmR2SurP6sn')
			swetrix.trackViews()
		})
	</script>
</svelte:head>

<Header />

<noscript>
	<img
		src="https://api.swetrix.com/log/noscript?pid=RKmR2SurP6sn"
		alt=""
		referrerpolicy="no-referrer-when-downgrade"
	/>
</noscript>

<div class="min-h-screen">
	{@render children?.()}
</div>

<footer class="bg-gray-50 border-t border-gray-900 mt-20">
	<div class="container mx-auto px-5 md:px-6 lg:px-8 py-8 max-w-7xl">
		<div class="flex flex-col md:flex-row justify-between items-center gap-4">
			<div class="text-sm ">
				© 2026 TakeOverBench. Data-driven AI safety research.
			</div>
			<div class="flex gap-6 text-sm">
				<a href="/about" class="text-gray-800 hover:text-gray-900">About</a>
				<a href="https://github.com/pauseai/takeoverbench" target="_blank" rel="noopener noreferrer" class="text-gray-800 hover:text-gray-900">GitHub</a>
			</div>
		</div>
	</div>
</footer>
