<script lang="ts">
    import { onMount } from "svelte";
    import { threatModels } from "$lib/data";

    // hydrated flag for client-only rendering
    let hydrated = false;

    // per-threat loaded markdown components (client loaded)
    const threatComponents: Record<string, any> = {};

    onMount(async () => {
        hydrated = true;

        // Load threat markdown components if present in the repo-level threat_models folder
        const modules = import.meta.glob(
            "../../../../threat_models/*.{md,svx}",
        );
        for (const t of threatModels) {
            const key = Object.keys(modules).find(
                (k) => k.endsWith(`${t.id}.md`) || k.endsWith(`${t.id}.svx`),
            );
            if (key) {
                const loader = modules[key] as () => Promise<any>;
                try {
                    const mod = await loader();
                    threatComponents[t.id] = mod?.default ?? mod;
                } catch (e) {
                    // ignore load errors and leave fallback text
                    console.warn(
                        `[threats] failed to load markdown for ${t.id}`,
                        e,
                    );
                    threatComponents[t.id] = null;
                }
            } else {
                threatComponents[t.id] = null;
            }
        }
    });
</script>

<svelte:head>
    <title>Takeover scenarios — TakeOverBench</title>
    <meta
        name="description"
        content="Catalog of modeled threats and the benchmarks referenced by each."
    />
</svelte:head>

<main class="min-h-screen bg-gray-50">
    <section>
        <div class="container mx-auto px-4 md:px-6 lg:px-10 py-10 max-w-7xl">
            <div class="flex items-center justify-between mb-6">
                <div>
                    <h1 class="text-3xl font-bold text-gray-900">
                        Takeover scenarios
                    </h1>
                    <p class="mt-1">
                        Catalog of modeled threats. Click a card to view the
                        threat text and the benchmarks chart.
                    </p>
                </div>
                <div class="text-right">
                    <div class="text-sm ">Total</div>
                    <div class="text-2xl font-semibold text-gray-900">
                        {threatModels.length}
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {#each threatModels as threat (threat.id)}
                    <a
                        href={"/threat/" + threat.id}
                        class="block bg-surface-primary border border-gray-900 rounded-lg p-6 hover:shadow-lg transition-all duration-200 no-underline text-current"
                        aria-labelledby={"threat-" + threat.id + "-title"}
                    >
                        <div class="flex justify-between items-start mb-3">
                            <h3 class="font-semibold mr-1 text-gray-900">
                                {threat.name}
                            </h3>
                            <div class="text-xs mt-1 whitespace-nowrap">
                                {threat.benchmarks?.length ?? 0} benchmarks
                            </div>
                        </div>

                        <!-- render threat markdown if present, otherwise fallback to shortDescription -->
                        {#if hydrated && threatComponents[threat.id]}
                            <div class="prose max-w-none mb-4">
                                <svelte:component
                                    this={threatComponents[threat.id]}
                                />
                            </div>
                        {:else}
                            <p class="text-sm mb-4">
                                {threat.shortDescription ??
                                    threat.longDescription ??
                                    "No description available."}
                            </p>
                        {/if}

                        <!-- Chart hidden on index for simplicity; click the card to view the threat page with chart -->
                    </a>
                {/each}
            </div>

            <div class="text-center mt-10">
                <a
                    href="/"
                    class="inline-flex items-center gap-2 px-6 py-3 bg-surface-primary font-medium rounded-lg border border-gray-900 hover:bg-gray-300 transition-colors duration-150"
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

    .bg-surface-primary {
        /* keep existing styling, ensure cards animate */
    }

    .grid > :global(div) {
        animation: fadeInUp 0.45s ease-out;
    }
</style>
