<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import {
        Chart,
        LineController,
        LineElement,
        PointElement,
        LinearScale,
        Title,
        CategoryScale,
        Tooltip,
        Legend,
    } from "chart.js";
    import { benchmarks, models } from "$lib/data";
    // type Benchmark import removed — not needed in this component

    Chart.register(
        LineController,
        LineElement,
        PointElement,
        LinearScale,
        Title,
        CategoryScale,
        Tooltip,
        Legend,
    );

    export let selectedBenchmarks: string[] = benchmarks
        .slice(0, 4)
        .map((b) => b.id);
    export let height: string = "400px";
    export let showLegend: boolean = true;
    export let showDangerZone: boolean = true;

    let chartEl: HTMLCanvasElement;
    let chart: Chart | null = null;

    // `models` are now imported from the data bridge (canonical source:
    // site/data/models.json). The symbol `models` is available from the import
    // above: `import { benchmarks, models } from "$lib/data/benchmarks";`

    /**
     * Collect unique release dates (ISO strings) referenced by the selected benchmarks
     * and return them sorted lexically. ISO date strings sort lexically in chronological order,
     * so a simple localeCompare is sufficient.
     *
     * Note: avoid using Set to satisfy the Svelte linter; dedupe using array methods
     * while preserving encounter order.
     */
    function getUniqueReleaseDates(): string[] {
        const datesArr: string[] = [];

        selectedBenchmarks.forEach((benchmarkId) => {
            const benchmark = benchmarks.find((b) => b.id === benchmarkId);
            if (!benchmark) return;
            benchmark.scores.forEach((s) => {
                const model = models.find((m) => m.id === s.modelId);
                if (model && model.releaseDate)
                    datesArr.push(model.releaseDate);
            });
        });

        // Dedupe while preserving the first-seen order
        const unique = datesArr.filter((d, i) => datesArr.indexOf(d) === i);

        return unique.sort((a, b) => a.localeCompare(b));
    }

    function createChart() {
        if (!chartEl) return;
        const ctx = chartEl.getContext("2d");
        if (!ctx) return;

        if (chart) {
            chart.destroy();
            chart = null;
        }

        const releaseDates = getUniqueReleaseDates();
        const filteredBenchmarks = benchmarks.filter((b) =>
            selectedBenchmarks.includes(b.id),
        );

        const datasets = filteredBenchmarks.map((benchmark) => {
            const data = releaseDates.map((date) => {
                const score = benchmark.scores.find((s) => {
                    const model = models.find((m) => m.id === s.modelId);
                    return model?.releaseDate === date;
                });
                return score?.score ?? null;
            });

            return {
                label: benchmark.name,
                data,
                borderColor: benchmark.color,
                backgroundColor: benchmark.color + "20",
                tension: 0.3,
                pointRadius: 4,
                pointHoverRadius: 6,
                borderWidth: 2,
                spanGaps: true,
            };
        });

        chart = new Chart(ctx, {
            type: "line",
            data: {
                labels: releaseDates,
                datasets,
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: showLegend,
                        position: "bottom",
                        labels: {
                            padding: 12,
                            usePointStyle: true,
                            font: {
                                size: 12,
                                family: "Inter, sans-serif",
                            },
                        },
                    },
                    tooltip: {
                        backgroundColor: "rgba(17, 24, 39, 0.95)",
                        padding: 10,
                        titleFont: {
                            size: 13,
                            weight: 600,
                        },
                        bodyFont: {
                            size: 12,
                        },
                        callbacks: {
                            label: (context) => {
                                const benchmark =
                                    filteredBenchmarks[context.datasetIndex];
                                const score = context.parsed.y;
                                if (score === null) return "";
                                const modelId = benchmark.scores.find(
                                    (s) => s.score === score,
                                )?.modelId;
                                const model = models.find(
                                    (m) => m.id === modelId,
                                );
                                return `${benchmark.name}: ${score}% (${model?.name ?? "Unknown"})`;
                            },
                        },
                    },
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: "Model release date",
                            color: "#6b7280",
                            font: { size: 12 },
                        },
                    },
                    y: {
                        min: 0,
                        max: 100,
                        title: {
                            display: true,
                            text: "Score (%)",
                            color: "#6b7280",
                            font: { size: 12 },
                        },
                        ticks: {
                            stepSize: 10,
                            callback: (val) => `${val}%`,
                        },
                    },
                },
            },
        });
    }

    // Svelte lifecycle - create chart on mount and on relevant prop changes.
    onMount(() => {
        createChart();
        // Recreate chart when window resizes to keep canvas crisp
        const onResize = () => {
            createChart();
        };
        window.addEventListener("resize", onResize);

        return () => {
            window.removeEventListener("resize", onResize);
            if (chart) {
                chart.destroy();
                chart = null;
            }
        };
    });

    onDestroy(() => {
        if (chart) {
            chart.destroy();
            chart = null;
        }
    });
</script>

<!-- Chart container -->
<div class="w-full bg-white rounded-lg p-4" style="height: {height};">
    <canvas bind:this={chartEl} width="800" height="400"></canvas>
</div>
