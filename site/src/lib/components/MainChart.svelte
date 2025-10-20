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
    import { benchmarks } from "$lib/data/benchmarks";
    import type { Benchmark } from "$lib/data/models";

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

    const models = [
        {
            id: "gpt4",
            name: "GPT-4",
            releaseDate: "Mar 2023",
            organization: "OpenAI",
        },
        {
            id: "claude3",
            name: "Claude 3",
            releaseDate: "Mar 2024",
            organization: "Anthropic",
        },
        {
            id: "claude35-sonnet",
            name: "Claude 3.5 Sonnet",
            releaseDate: "Jun 2024",
            organization: "Anthropic",
        },
        {
            id: "gpt4o",
            name: "GPT-4o",
            releaseDate: "May 2024",
            organization: "OpenAI",
        },
        {
            id: "gpt4o-aug",
            name: "GPT-4o",
            releaseDate: "Aug 2024",
            organization: "OpenAI",
        },
        {
            id: "o1-mini",
            name: "o1-mini",
            releaseDate: "Sep 2024",
            organization: "OpenAI",
        },
        {
            id: "o1",
            name: "o1",
            releaseDate: "Sep 2024",
            organization: "OpenAI",
        },
    ];

    const dateOrder = [
        "Mar 2023",
        "Jun 2023",
        "Sep 2023",
        "Dec 2023",
        "Mar 2024",
        "May 2024",
        "Jun 2024",
        "Aug 2024",
        "Sep 2024",
        "Jan 2025",
        "Mar 2025",
        "Jun 2025",
        "Sep 2025",
    ];

    function getUniqueReleaseDates(): string[] {
        const dates = new Set<string>();
        selectedBenchmarks.forEach((benchmarkId) => {
            const benchmark = benchmarks.find((b) => b.id === benchmarkId);
            if (benchmark) {
                benchmark.scores.forEach((s) => {
                    const model = models.find((m) => m.id === s.modelId);
                    if (model) dates.add(model.releaseDate);
                });
            }
        });
        return Array.from(dates).sort(
            (a, b) => dateOrder.indexOf(a) - dateOrder.indexOf(b),
        );
    }

    function createChart() {
        if (!chartEl) return;

        const ctx = chartEl.getContext("2d");
        if (!ctx) return;

        if (chart) {
            chart.destroy();
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
                            padding: 15,
                            usePointStyle: true,
                            font: {
                                size: 12,
                                family: "Inter, sans-serif",
                            },
                        },
                    },
                    tooltip: {
                        backgroundColor: "rgba(17, 24, 39, 0.95)",
                        padding: 12,
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

                                return `${benchmark.name}: ${score}% (${model?.name || "Unknown"})`;
                            },
                        },
                    },
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: "Release Date",
                            font: {
                                size: 12,
                                family: "Inter, sans-serif",
                                weight: 500,
                            },
                        },
                        grid: {
                            color: "rgba(229, 231, 235, 0.5)",
                        },
                        ticks: {
                            font: {
                                size: 11,
                                family: "Inter, sans-serif",
                            },
                            padding: 8,
                        },
                    },
                    y: {
                        beginAtZero: true,
                        max: 100,
                        title: {
                            display: true,
                            text: "Accuracy (%)",
                            font: {
                                size: 12,
                                family: "Inter, sans-serif",
                                weight: 500,
                            },
                        },
                        ticks: {
                            callback: (v) => `${v}%`,
                            font: {
                                size: 11,
                                family: "Inter, sans-serif",
                            },
                            padding: 8,
                        },
                        grid: {
                            color: "rgba(229, 231, 235, 0.5)",
                        },
                    },
                },
            },
        });
    }

    onMount(() => {
        createChart();
    });

    onDestroy(() => {
        if (chart) {
            chart.destroy();
        }
    });

    $: if (chartEl && selectedBenchmarks) {
        createChart();
    }
</script>

<div class="chart-container" style="height: {height}; position: relative;">
    {#if showDangerZone}
        <div class="danger-zone">
            <span class="danger-label">Dangerous Capability Threshold</span>
        </div>
    {/if}
    <canvas bind:this={chartEl}></canvas>
</div>

<style>
    .chart-container {
        width: 100%;
        background: white;
        border-radius: 0.5rem;
        padding: 1rem;
    }

    .danger-zone {
        position: absolute;
        top: 1rem;
        left: 3.5rem;
        right: 1rem;
        height: 20%;
        background: linear-gradient(
            to bottom,
            rgba(239, 68, 68, 0.08),
            rgba(239, 68, 68, 0)
        );
        border-bottom: 2px dashed rgba(239, 68, 68, 0.3);
        pointer-events: none;
        z-index: 0;
    }

    .danger-label {
        position: absolute;
        top: 0.5rem;
        right: 1rem;
        font-size: 0.6875rem;
        color: rgba(239, 68, 68, 0.8);
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }
</style>
