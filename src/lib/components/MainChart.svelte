<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import {
        Chart,
        LineController,
        LineElement,
        PointElement,
        LinearScale,
        Title,
        TimeScale,
        CategoryScale,
        Tooltip,
        Legend,
    } from "chart.js";
    // chartjs-adapter-date-fns removed - we will pass numeric timestamps and format ticks manually
    import { benchmarks, models } from "$lib/data";
    import { fitCurve, type FitType } from "$lib/utils/curveFitting";

    Chart.register(
        LineController,
        LineElement,
        PointElement,
        LinearScale,
        Title,
        TimeScale,
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
    export let showFit: boolean = true;
    export let fitType: FitType = "exponential";

    let chartEl: HTMLCanvasElement;
    let chart: Chart | null = null;

    // Build a list of unique model release timestamps (ms since epoch) used by selected benchmarks
    function getUniqueReleaseTimestamps(): number[] {
        const arr: number[] = [];

        for (const benchmarkId of selectedBenchmarks) {
            const benchmark = benchmarks.find((b) => b.id === benchmarkId);
            if (!benchmark) continue;
            for (const s of benchmark.scores ?? []) {
                const model = models.find((m) => m.id === s.modelId);
                if (model && model.releaseDate) {
                    const ts = Date.parse(model.releaseDate);
                    if (!Number.isNaN(ts)) arr.push(ts);
                }
            }
        }

        // dedupe preserving order
        const unique = arr.filter((d, i) => arr.indexOf(d) === i);
        // sort chronological ascending
        unique.sort((a, b) => a - b);
        return unique;
    }

    function createChart() {
        if (!chartEl) return;
        const ctx = chartEl.getContext("2d");
        if (!ctx) return;

        // destroy existing
        if (chart) {
            chart.destroy();
            chart = null;
        }

        const releaseTs = getUniqueReleaseTimestamps();
        // Set explicit x-axis bounds to the actual data min/max so Chart.js doesn't extend
        // the axis into future years. If there are no timestamps, leave bounds undefined.
        const xMin = releaseTs.length ? releaseTs[0] : undefined;
        const xMax = releaseTs.length
            ? releaseTs[releaseTs.length - 1]
            : undefined;
        const filteredBenchmarks = benchmarks.filter((b) =>
            selectedBenchmarks.includes(b.id),
        );

        const datasets = filteredBenchmarks.map((benchmark) => {
            // build timestamp -> modelId map and dataset.data as {x:ts, y:scaled|null}
            const dateToModelId: Record<number, string | null> = {};
            let currentMax = -Infinity;

            const data = releaseTs.map((ts) => {
                // find score for this benchmark where model.releaseDate corresponds to ts
                const scoreObj = (benchmark.scores ?? []).find((s) => {
                    const model = models.find((m) => m.id === s.modelId);
                    if (!model || !model.releaseDate) return false;
                    const mts = Date.parse(model.releaseDate);
                    return !Number.isNaN(mts) && mts === ts;
                });

                if (!scoreObj) {
                    dateToModelId[ts] = null;
                    // return a point with null y -> will be a gap
                    return { x: ts, y: null };
                }

                const raw = scoreObj.score;
                const scaled =
                    typeof raw === "number" && raw <= 1 ? raw * 100 : raw;

                // record-breaking filtering: only show if strictly greater than previous max
                if (typeof scaled === "number" && scaled > currentMax) {
                    currentMax = scaled;
                    dateToModelId[ts] = scoreObj.modelId ?? null;
                    return { x: ts, y: scaled };
                } else {
                    dateToModelId[ts] = null;
                    return { x: ts, y: null };
                }
            });

            const mainDataset = {
                label: benchmark.name,
                data,
                borderColor: benchmark.color,
                backgroundColor: benchmark.color + "20",
                tension: 0.3,
                pointRadius: 4,
                pointHoverRadius: 6,
                borderWidth: 2,
                spanGaps: true,
                meta: {
                    dateToModelId,
                },
            };

            // Add fitted line dataset if enabled
            const datasets_arr = [mainDataset];
            if (showFit) {
                // Filter valid points for fitting
                const validPoints = data.filter((p) => p.y !== null);
                if (validPoints.length >= 2) {
                    const fittedData = fitCurve(validPoints, fitType, 100);
                    datasets_arr.push({
                        label: `${benchmark.name} (${fitType} fit)`,
                        data: fittedData,
                        borderColor: benchmark.color,
                        borderDash: [5, 5],
                        fill: false,
                        pointRadius: 0,
                        pointHoverRadius: 0,
                        borderWidth: 2,
                        spanGaps: true,
                    });
                }
            }

            return datasets_arr;
        }).flat();

        chart = new Chart(ctx, {
            type: "line",
            data: {
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
                                const datasetIndex = context.datasetIndex ?? 0;
                                const benchmark =
                                    filteredBenchmarks[datasetIndex];
                                const score = context.parsed?.y;
                                if (score === null || score === undefined)
                                    return "";

                                const datasetMeta = context.dataset?.meta ?? {};
                                const parsedX = context.parsed?.x;
                                const ts =
                                    typeof parsedX === "number"
                                        ? parsedX
                                        : typeof context.label === "string"
                                          ? Date.parse(context.label)
                                          : null;

                                const modelIdFromMeta =
                                    ts != null
                                        ? (datasetMeta.dateToModelId?.[ts] ??
                                          null)
                                        : null;
                                let modelId = modelIdFromMeta;

                                if (!modelId) {
                                    const match = benchmark.scores?.find(
                                        (s) => {
                                            const raw = s.score;
                                            const scaled =
                                                typeof raw === "number" &&
                                                raw <= 1
                                                    ? raw * 100
                                                    : raw;
                                            return (
                                                typeof scaled === "number" &&
                                                Math.abs(
                                                    (scaled as number) -
                                                        (score as number),
                                                ) < 0.001
                                            );
                                        },
                                    );
                                    modelId = match?.modelId ?? null;
                                }

                                const model = models.find(
                                    (m) => m.id === modelId,
                                );
                                return `${benchmark.name}: ${Math.round(score as number)}% (${model?.name ?? "Unknown"})`;
                            },
                        },
                    },
                },
                scales: {
                    x: {
                        type: "linear",
                        // pin the axis to the data range to avoid auto-extending into future years
                        min: xMin,
                        max: xMax,
                        title: {
                            display: true,
                            text: "Model release date",
                            color: "#6b7280",
                            font: { size: 12 },
                        },
                        ticks: {
                            // stepSize set to milliseconds per year (approx. 365.25 days)
                            stepSize: 31557600000,
                            // Format tick labels as years
                            callback: function (value) {
                                if (typeof value === "number") {
                                    const d = new Date(value);
                                    // use UTC year to avoid timezone shifts changing year label
                                    return d.getUTCFullYear();
                                }
                                return value;
                            },
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

    // create on mount and whenever selectedBenchmarks or chartEl change
    let mounted = false;
    onMount(() => {
        mounted = true;
        createChart();
        const onResize = () => createChart();
        window.addEventListener("resize", onResize);
        return () => {
            window.removeEventListener("resize", onResize);
            if (chart) {
                chart.destroy();
                chart = null;
            }
        };
    });

    // recreate when selectedBenchmarks, showFit, or fitType changes (reactive)
    $: if (mounted && chartEl) {
        // ensure reactivity by referencing all variables that trigger updates
        void selectedBenchmarks;
        void showFit;
        void fitType;
        createChart();
    }

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
