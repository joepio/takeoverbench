<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { goto } from "$app/navigation";
    import { generateProjection } from "$lib/projections";
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
    import "chartjs-adapter-date-fns";
    import { benchmarks, models } from "$lib/data";

    // Register controllers/elements once.
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
    export let height: string = "420px";
    export let showLegend: boolean = true;
    export let showProjections: boolean = true;
    export let showSotaFilter: boolean = true;

    let canvasEl: HTMLCanvasElement | null = null;
    let chart: Chart | null = null;
    let mounted = false;
    let projectionsEnabled = showProjections;
    let sotaFilterEnabled = true;

    // Helper: get benchmark object by id
    function getBenchmark(id: string) {
        return benchmarks.find((b) => b.id === id) ?? null;
    }

    // Helper: build a sorted list of unique timestamps from the selected benchmarks.
    function buildReleaseTimestamps(): number[] {
        const minDate = Date.parse("2022-01-01"); // Filter out anything before 2022
        const arr: number[] = [];
        for (const bid of selectedBenchmarks) {
            const b = getBenchmark(bid);
            if (!b) continue;
            for (const s of b.scores ?? []) {
                if (!s?.modelId) continue;
                const m = models.find((mm) => mm.id === s.modelId);
                if (!m?.releaseDate) continue;
                const ts = Date.parse(m.releaseDate);
                if (!Number.isNaN(ts) && ts >= minDate) arr.push(ts);
            }
        }
        // dedupe preserve first occurrence order, then sort ascending
        const unique = arr.filter((v, i) => arr.indexOf(v) === i);
        unique.sort((a, b) => a - b);
        return unique;
    }

    // Build datasets for Chart.js
    function buildDatasets(
        releaseTs: number[],
        useCategory: boolean,
        categoryLabels?: string[],
    ) {
        const datasets: any[] = [];

        if (!useCategory) {
            // time-based x axis: create {x:ts, y:value} points per bench
            for (const bid of selectedBenchmarks) {
                const bench = getBenchmark(bid);
                if (!bench) continue;

                let currentMax = -Infinity;
                const dateToModelId: Record<number, string | null> = {};

                const data = releaseTs.map((ts) => {
                    const scoreObj = (bench.scores ?? []).find((s) => {
                        const m = models.find((mm) => mm.id === s.modelId);
                        if (!m?.releaseDate) return false;
                        const mts = Date.parse(m.releaseDate);
                        return !Number.isNaN(mts) && mts === ts;
                    });

                    if (!scoreObj) {
                        dateToModelId[ts] = null;
                        return { x: ts, y: null };
                    }

                    const raw = scoreObj.score;
                    const scaled =
                        typeof raw === "number" && raw <= 1 ? raw * 100 : raw;

                    // Always calculate SOTA for the line
                    if (typeof scaled === "number" && scaled > currentMax) {
                        currentMax = scaled;
                        dateToModelId[ts] = scoreObj.modelId ?? null;
                        return { x: ts, y: scaled };
                    } else {
                        dateToModelId[ts] = null;
                        return { x: ts, y: null };
                    }
                });

                // Add SOTA line dataset
                datasets.push({
                    label: bench.capabilityName ?? bench.name,
                    data,
                    borderColor: bench.color,
                    backgroundColor: (bench.color ?? "#666") + "20",
                    tension: 0.3,
                    pointRadius: 3,
                    borderWidth: 2,
                    showLine: true,
                    spanGaps: true,
                    meta: { dateToModelId },
                });

                // When SOTA filter is off, also add scatter plot with all points
                if (!sotaFilterEnabled) {
                    const scatterDateToModelId: Record<number, string | null> =
                        {};
                    const allData = releaseTs.map((ts) => {
                        const scoreObj = (bench.scores ?? []).find((s) => {
                            const m = models.find((mm) => mm.id === s.modelId);
                            if (!m?.releaseDate) return false;
                            const mts = Date.parse(m.releaseDate);
                            return !Number.isNaN(mts) && mts === ts;
                        });

                        if (!scoreObj) {
                            scatterDateToModelId[ts] = null;
                            return { x: ts, y: null };
                        }

                        const raw = scoreObj.score;
                        const scaled =
                            typeof raw === "number" && raw <= 1
                                ? raw * 100
                                : raw;

                        if (typeof scaled === "number") {
                            scatterDateToModelId[ts] = scoreObj.modelId ?? null;
                            return { x: ts, y: scaled };
                        } else {
                            scatterDateToModelId[ts] = null;
                            return { x: ts, y: null };
                        }
                    });

                    datasets.push({
                        label: bench.capabilityName ?? bench.name,
                        data: allData,
                        borderColor: bench.color,
                        backgroundColor: bench.color,
                        pointRadius: 4,
                        pointHoverRadius: 6,
                        borderWidth: 0,
                        showLine: false,
                        meta: {
                            isScatter: true,
                            dateToModelId: scatterDateToModelId,
                        },
                    });
                }

                // Generate projection if enabled (always use SOTA data for projections)
                if (projectionsEnabled && bench.projectionType !== "none") {
                    const validData = data.filter(
                        (d) => d.y !== null && !isNaN(d.y),
                    );
                    if (validData.length >= 2) {
                        // Use appropriate ceiling: no ceiling for exponential, 100 for s-curve
                        const ceiling =
                            bench.projectionType === "exponential" ? 1000 : 100;
                        const projection = generateProjection(
                            validData.map((d) => ({ x: d.x, y: d.y })),
                            bench.projectionType ?? "s-curve",
                            12,
                            ceiling,
                        );

                        if (
                            projection.projectedPoints.length > 0 &&
                            projection.confidence > 0.3
                        ) {
                            // Add last actual data point to connect projection
                            const lastActual = validData[validData.length - 1];
                            const projectionData = [
                                lastActual,
                                ...projection.projectedPoints.map((p) => ({
                                    x: p.x,
                                    y: p.y,
                                })),
                            ];

                            datasets.push({
                                label: bench.capabilityName ?? bench.name,
                                data: projectionData,
                                borderColor: bench.color,
                                backgroundColor: "transparent",
                                tension: 0.3,
                                pointRadius: 0,
                                borderWidth: 2,
                                borderDash: [5, 5],
                                spanGaps: true,
                                meta: { isProjection: true },
                                hidden: false,
                            });
                        }
                    }
                }

                // Add expert baseline horizontal line if single benchmark with valid baseline
                if (
                    selectedBenchmarks.length === 1 &&
                    bench.expertBaseline !== null &&
                    typeof bench.expertBaseline === "number"
                ) {
                    const baselineValue = bench.expertBaseline <= 1 ? bench.expertBaseline * 100 : bench.expertBaseline;
                    // Extend baseline to 1 year past last data point to match projection extension
                    const oneYearInMs = 365.25 * 24 * 60 * 60 * 1000;
                    const endTime = releaseTs[releaseTs.length - 1] + oneYearInMs;
                    // Add interpolated points along the baseline for better hover detection
                    const baselineData = [];
                    const startTime = releaseTs[0];
                    const timeRange = endTime - startTime;
                    const numPoints = 1000; // Add many points for smooth hover detection
                    for (let i = 0; i <= numPoints; i++) {
                        const x = startTime + (timeRange / numPoints) * i;
                        baselineData.push({ x, y: baselineValue });
                    }

                    datasets.push({
                        label: "Expert Baseline",
                        data: baselineData,
                        borderColor: "#9ca3af",
                        backgroundColor: "transparent",
                        tension: 0,
                        pointRadius: 0,
                        borderWidth: 1.5,
                        borderDash: [5, 5],
                        showLine: true,
                        spanGaps: true,
                        meta: { isBaseline: true },
                    });
                }
            }
        } else {
            // categorical axis: use provided categoryLabels (model names) and align scores to labels
            const modelIds = (categoryLabels ?? []).map((_, i) => {
                const m = models[i];
                return m?.id ?? null;
            });

            for (const bid of selectedBenchmarks) {
                const bench = getBenchmark(bid);
                if (!bench) continue;

                const data = (categoryLabels ?? []).map((lbl, idx) => {
                    const mid = modelIds[idx];
                    if (!mid) return null;
                    const scoreObj = (bench.scores ?? []).find(
                        (s) => s.modelId === mid,
                    );
                    if (!scoreObj) return null;
                    const raw = scoreObj.score;
                    const scaled =
                        typeof raw === "number" && raw <= 1 ? raw * 100 : raw;
                    return typeof scaled === "number" ? scaled : null;
                });

                datasets.push({
                    label: bench.capabilityName ?? bench.name,
                    data,
                    borderColor: bench.color,
                    backgroundColor: (bench.color ?? "#666") + "20",
                    tension: 0.3,
                    pointRadius: 3,
                    borderWidth: 2,
                    spanGaps: true,
                    meta: {},
                });

                // Generate projection if enabled (category mode)
                if (projectionsEnabled && bench.projectionType !== "none") {
                    // For category mode, we don't have timestamps, so skip projections
                    // Projections only make sense with time-based data
                }
            }
        }

        return datasets;
    }

    function createChart() {
        if (!canvasEl) return;
        const ctx = canvasEl.getContext("2d");
        if (!ctx) return;

        // cleanup existing
        if (chart) {
            chart.destroy();
            chart = null;
        }

        const releaseTs = buildReleaseTimestamps();
        const useCategory = releaseTs.length === 0;

        // if category mode, create labels from models list; else use timestamps
        let categoryLabels: string[] | undefined = undefined;
        let xMin: number | undefined = undefined;
        let xMax: number | undefined = undefined;

        if (useCategory) {
            categoryLabels = models.map((m) => m.name);
        } else {
            xMin = releaseTs[0];
            // Extend xMax to show projections (add 1 year)
            const oneYearInMs = 365.25 * 24 * 60 * 60 * 1000;
            xMax = releaseTs[releaseTs.length - 1] + oneYearInMs;
        }

        const datasets = buildDatasets(releaseTs, useCategory, categoryLabels);

        if (!datasets || datasets.length === 0) {
            // nothing to render
            return;
        }

        chart = new Chart(ctx, {
            type: "line",
            data: {
                datasets,
                labels: useCategory ? categoryLabels : undefined,
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
                            font: { size: 12, family: "Inter, sans-serif" },
                            filter: function (legendItem: any, chartData: any) {
                                // Hide projected and scatter datasets from legend (but show baseline)
                                const dataset =
                                    chartData.datasets[legendItem.datasetIndex];
                                return (
                                    !dataset.meta?.isProjection &&
                                    !dataset.meta?.isScatter
                                );
                            },
                        },
                        onHover: function (event: any) {
                            event.native.target.style.cursor = "pointer";
                        },
                        onLeave: function (event: any) {
                            event.native.target.style.cursor = "default";
                        },
                        // navigate to benchmark page on legend click
                        onClick: (_e: any, legendItem: any, legend: any) => {
                            try {
                                // Get the actual dataset index from the chart
                                const datasetIndex =
                                    legendItem?.datasetIndex ?? 0;

                                // Find the benchmark ID from the dataset label
                                const dataset =
                                    legend.chart.data.datasets[datasetIndex];
                                const label = dataset?.label;

                                // Find matching benchmark by capability name or name
                                const bench = benchmarks.find(
                                    (b) =>
                                        b.capabilityName === label ||
                                        b.name === label,
                                );

                                if (bench?.id) {
                                    goto(`/benchmarks/${bench.id}`);
                                }
                            } catch (err) {
                                // swallow errors to avoid crashing chart interactions
                                // eslint-disable-next-line no-console
                                console.error(
                                    "Legend click navigation failed",
                                    err,
                                );
                            }
                        },
                    },
                    tooltip: {
                        mode: "nearest",
                        intersect: true,
                        backgroundColor: "rgba(17, 24, 39, 0.95)",
                        padding: 10,
                        titleFont: { size: 13, weight: 600 },
                        bodyFont: { size: 12 },
                        callbacks: {
                            title: (context: any) => {
                                // Hide title for baseline tooltips
                                if (context.length > 0 && context[0].dataset?.meta?.isBaseline) {
                                    return "";
                                }
                                return context.length > 0 ? context[0].label : "";
                            },
                            label: (context: any) => {
                                const dataset = context.dataset;
                                const meta = dataset?.meta ?? {};
                                const isBaseline = meta.isBaseline;
                                const isScatter = meta.isScatter;

                                // Handle baseline dataset
                                if (isBaseline) {
                                    const value = context.parsed?.y ?? "Unknown";
                                    return `Expert Baseline: ${typeof value === "number" ? value.toFixed(1) : value}%`;
                                }

                                // For scatter plots, map back to the correct benchmark
                                let benchIdx = context.datasetIndex ?? 0;
                                if (isScatter) {
                                    // Scatter datasets are added after SOTA line, so find the previous non-scatter
                                    benchIdx = Math.floor(benchIdx / 2);
                                }

                                const benchId = selectedBenchmarks[benchIdx];
                                const bench = getBenchmark(benchId);
                                if (!bench) return "";

                                const parsedX = context.parsed?.x;
                                const ts =
                                    typeof parsedX === "number"
                                        ? parsedX
                                        : typeof context.label === "string"
                                          ? Date.parse(context.label)
                                          : null;

                                const modelIdFromMeta =
                                    ts != null
                                        ? (meta.dateToModelId?.[ts] ?? null)
                                        : null;
                                let modelId = modelIdFromMeta;

                                if (!modelId && ts != null) {
                                    // Try to find by timestamp and score
                                    const score = context.parsed?.y;
                                    const match = bench.scores?.find((s) => {
                                        const m = models.find(
                                            (mm) => mm.id === s.modelId,
                                        );
                                        if (!m?.releaseDate) return false;
                                        const mts = Date.parse(m.releaseDate);
                                        if (
                                            Number.isNaN(mts) ||
                                            Math.abs(mts - ts) > 86400000
                                        )
                                            return false; // not within 1 day

                                        const raw = s.score;
                                        const scaled =
                                            typeof raw === "number" && raw <= 1
                                                ? raw * 100
                                                : raw;
                                        return (
                                            typeof scaled === "number" &&
                                            Math.abs(
                                                (scaled as number) -
                                                    (score as number),
                                            ) < 0.1
                                        );
                                    });
                                    modelId = match?.modelId ?? null;
                                }

                                const model = models.find(
                                    (m) => m.id === modelId,
                                );
                                return model?.name ?? "Unknown";
                            },
                        },
                    },
                },
                scales: {
                    x: useCategory
                        ? {
                              type: "category",
                              title: { display: true, text: "Model" },
                          }
                        : {
                              type: "time",
                              min: xMin,
                              max: xMax,
                              time: {
                                  unit: "year",
                                  displayFormats: { year: "yyyy" },
                                  tooltipFormat: "yyyy-MM",
                              },
                              title: {
                                  display: true,
                                  text: "Model release date",
                                  color: "#9ca3af",
                                  font: { size: 12 },
                              },
                              ticks: {
                                  maxRotation: 0,
                                  autoSkip: true,
                              },
                          },
                    y: {
                        min: 0,
                        max: 100,
                        title: {
                            display: true,
                            text: "Score (%)",
                            color: "#9ca3af",
                            font: { size: 12 },
                        },
                        grid: {
                            color: "rgba(255, 255, 255, 0.1)",
                        },
                        ticks: {
                            stepSize: 10,
                            callback: (val: any) => `${val}%`,
                        },
                    },
                },
            },
        });
    }

    onMount(() => {
        mounted = true;
        return () => {
            if (chart) {
                chart.destroy();
                chart = null;
            }
        };
    });

    $: if (mounted && canvasEl && selectedBenchmarks) {
        createChart();
    }

    $: if (mounted && chart) {
        // Recreate chart when toggles change
        projectionsEnabled;
        sotaFilterEnabled;
        createChart();
    }

    onDestroy(() => {
        if (chart) {
            chart.destroy();
            chart = null;
        }
    });
</script>

{#if selectedBenchmarks.length > 0}
    <div class="w-full">
        {#if showProjections || showSotaFilter}
            <div class="mb-3 flex items-center justify-end gap-6">
                {#if showSotaFilter}
                    <label
                        class="flex items-center gap-2 text-sm cursor-pointer"
                    >
                        <input
                            type="checkbox"
                            bind:checked={sotaFilterEnabled}
                            class="rounded bg-gray-700 text-blue-600 focus:ring-blue-500"
                        />
                        <span class="text-gray-700"
                            >Show only SOTA (state-of-the-art)</span
                        >
                    </label>
                {/if}
                {#if showProjections}
                    <label
                        class="flex items-center gap-2 text-sm cursor-pointer"
                    >
                        <input
                            type="checkbox"
                            bind:checked={projectionsEnabled}
                            class="rounded bg-gray-700 text-blue-600 focus:ring-blue-500"
                        />
                        <span class="text-gray-700"
                            >Show 1-year projections</span
                        >
                    </label>
                {/if}
            </div>
        {/if}
        <div
            class="w-full bg-surface-primary rounded-lg p-4"
            style="height: {height};"
        >
            <canvas bind:this={canvasEl} width="800" height="400"></canvas>
        </div>
    </div>
{:else}
    <div
        class="w-full bg-surface-primary rounded-lg p-4 h-[400px] flex items-center justify-center text-gray-700"
    >
        No benchmark data to display.
    </div>
{/if}
