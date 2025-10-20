<script lang="ts">
    import { onMount } from "svelte";
    import {
        Chart,
        LineController,
        LineElement,
        PointElement,
        LinearScale,
        Title,
        CategoryScale,
        Tooltip,
    } from "chart.js";

    Chart.register(
        LineController,
        LineElement,
        PointElement,
        LinearScale,
        Title,
        CategoryScale,
        Tooltip,
    );

    // ==== Data ====
    const models = [
        {
            id: "gpt4",
            name: "GPT-4",
            releaseDate: "June 2023",
            description: "",
        },
        {
            id: "claude35-jun",
            name: "Claude 3.5 Sonnet",
            releaseDate: "June 2024",
            description: "",
        },
        {
            id: "gpt4o-aug",
            name: "GPT-4o",
            releaseDate: "Sept. 2024",
            description: "",
        },
        {
            id: "o1-mini",
            name: "o1-mini",
            releaseDate: "Sept. 2024",
            description: "high",
        },
        {
            id: "o1-high",
            name: "o1",
            releaseDate: "Jan. 2025",
            description: "high",
        },
        {
            id: "opus4",
            name: "Claude Opus 4",
            releaseDate: "Mar. 2025",
            description: "",
        },
        {
            id: "gpt5-med",
            name: "GPT-5",
            releaseDate: "June 2025",
            description: "medium",
        },
        {
            id: "grok4",
            name: "Grok 4",
            releaseDate: "June 2025",
            description: "",
        },
        {
            id: "sonnet45",
            name: "Claude Sonnet 4.5",
            releaseDate: "Sept. 2025",
            description: "",
        },
        {
            id: "gpt5-high",
            name: "GPT-5",
            releaseDate: "Sept. 2025",
            description: "high",
        },
    ];

    const benchmarks = [
        {
            name: "GPQA Diamond",
            description:
                "Graduate-level science questions requiring deep domain expertise.",
            color: "#e91e8c",
            scores: [
                { modelId: "gpt4", score: 30 },
                { modelId: "claude35-jun", score: 53 },
                { modelId: "gpt4o-aug", score: 62 },
                { modelId: "o1-high", score: 76 },
                { modelId: "opus4", score: 78 },
                { modelId: "grok4", score: 86 },
                { modelId: "sonnet45", score: 88 },
            ],
        },
        {
            name: "MATH Level 5",
            description:
                "Challenging high-school competition mathematics problems.",
            color: "#6366f1",
            scores: [
                { modelId: "gpt4", score: 22 },
                { modelId: "claude35-jun", score: 51 },
                { modelId: "o1-mini", score: 90 },
                { modelId: "o1-high", score: 94 },
                { modelId: "gpt5-med", score: 98 },
                { modelId: "sonnet45", score: 98 },
            ],
        },
        {
            name: "FrontierMath Tier 1–3",
            description:
                "Cutting-edge mathematical research problems at the frontier of knowledge.",
            color: "#14b8a6",
            scores: [
                { modelId: "claude35-jun", score: 0.5 },
                { modelId: "gpt4o-aug", score: 2.5 },
                { modelId: "opus4", score: 11 },
                { modelId: "gpt5-med", score: 19 },
                { modelId: "gpt5-high", score: 25 },
            ],
        },
        {
            name: "SWE-bench Verified",
            description:
                "Real-world software engineering tasks requiring code understanding.",
            color: "#f97316",
            scores: [
                { modelId: "claude35-jun", score: 32 },
                { modelId: "o1-high", score: 40 },
                { modelId: "opus4", score: 62 },
                { modelId: "gpt5-med", score: 64 },
                { modelId: "sonnet45", score: 65 },
            ],
        },
    ];

    let expanded: Record<string, boolean> = {};
    let chartEl: HTMLCanvasElement;

    onMount(() => {
        const orderedModels = [...models].sort(
            (a, b) => orderIndex(a.releaseDate) - orderIndex(b.releaseDate),
        );

        const labels = orderedModels.map((m) => m.releaseDate);
        const datasets = benchmarks.map((b) => ({
            label: b.name,
            data: orderedModels.map(
                (m) => b.scores.find((s) => s.modelId === m.id)?.score ?? null,
            ),
            borderColor: b.color,
            backgroundColor: b.color,
            tension: 0.3,
            pointRadius: 4,
            borderWidth: 2,
            spanGaps: true,
        }));

        const ctx = chartEl.getContext("2d");
        const chart = new Chart(ctx!, {
            type: "line",
            data: { labels, datasets },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => {
                                const b = benchmarks[ctx.datasetIndex];
                                const model = orderedModels[ctx.dataIndex];
                                const score = b.scores.find(
                                    (s) => s.modelId === model.id,
                                )?.score;
                                if (!score) return "";
                                return `${b.name}: ${score}% – ${model.name}${model.description ? ` (${model.description})` : ""}`;
                            },
                        },
                    },
                },
                scales: {
                    x: {
                        title: { display: true, text: "Release Date" },
                        grid: { color: "#e5e7eb" },
                        ticks: { font: { size: 11 } },
                    },
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: { callback: (v) => `${v}%` },
                        grid: { color: "#e5e7eb" },
                    },
                },
            },
        });

        return () => chart.destroy();
    });

    const order = [
        "June 2023",
        "Sept. 2023",
        "Jan. 2024",
        "Mar. 2024",
        "Apr. 2024",
        "June 2024",
        "July 2024",
        "Sept. 2024",
        "Jan. 2025",
        "Feb. 2025",
        "Mar. 2025",
        "June 2025",
        "Sept. 2025",
    ];
    function orderIndex(d: string) {
        return order.indexOf(d);
    }
</script>

<div class="container">
    <h1>Frontier performance across benchmarks</h1>
    <div class="subtitle" style="color:#666;font-size:14px;margin-bottom:1rem;">
        Accuracy — 38 Results
    </div>

    <div class="chart-wrapper">
        <div class="danger-zone">
            <span class="danger-label">Dangerous Capabilities</span>
        </div>
        <canvas bind:this={chartEl} style="max-height:600px"></canvas>
    </div>

    <div class="benchmarks-grid">
        {#each benchmarks as b}
            <div
                class="benchmark-card {expanded[b.name] ? 'expanded' : ''}"
                style="border-color:{b.color}"
                role="button"
                tabindex="0"
                on:click={() => (expanded[b.name] = !expanded[b.name])}
                on:keydown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        expanded[b.name] = !expanded[b.name];
                    }
                }}
            >
                <div class="benchmark-title" style="font-weight:600;">
                    {b.name}
                </div>

                <div
                    class="description {expanded[b.name] ? '' : 'collapsed'}"
                    style="color:#666;font-size:13px;margin-top:4px;"
                >
                    {b.description}
                </div>

                <div
                    class="scores {expanded[b.name] ? '' : 'collapsed'}"
                    style="font-size:13px;margin-top:8px;"
                >
                    {#each b.scores as s}
                        {#if models.find((m) => m.id === s.modelId)}
                            <div class="score-item" style="margin-bottom:4px;">
                                <span
                                    class="score-value"
                                    style="font-weight:600;">{s.score}%</span
                                >
                                –
                                <span class="model-name" style="color:#666;">
                                    {models.find((m) => m.id === s.modelId)
                                        ?.name}
                                    {#if models.find((m) => m.id === s.modelId)?.description}
                                        ({models.find((m) => m.id === s.modelId)
                                            ?.description})
                                    {/if}
                                </span>
                            </div>
                        {/if}
                    {/each}
                </div>
            </div>
        {/each}
    </div>
</div>

<style>
    .container {
        max-width: 1400px;
        margin: 0 auto;
        background: white;
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    .chart-wrapper {
        position: relative;
    }
    .danger-zone {
        position: absolute;
        top: 0;
        left: 60px;
        right: 10px;
        height: 20%;
        background: linear-gradient(
            to bottom,
            rgba(239, 68, 68, 0.15),
            rgba(239, 68, 68, 0.02)
        );
        border-bottom: 1px dashed rgba(239, 68, 68, 0.3);
        pointer-events: none;
    }
    .danger-label {
        position: absolute;
        top: 8px;
        right: 20px;
        font-size: 11px;
        color: rgba(239, 68, 68, 0.7);
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    .benchmarks-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1.5rem;
        margin-top: 2rem;
    }
    .benchmark-card {
        border-left: 4px solid;
        padding-left: 1rem;
        cursor: pointer;
        transition: all 0.25s ease;
    }
    .benchmark-card.expanded {
        grid-column: 1 / -1;
    }
    .description,
    .scores {
        transition:
            max-height 0.3s ease,
            opacity 0.3s ease;
        overflow: hidden;
    }
    .collapsed {
        max-height: 0;
        opacity: 0;
    }
</style>
