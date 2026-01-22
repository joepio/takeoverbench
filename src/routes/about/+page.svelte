<script lang="ts">
  import { onMount } from "svelte";
  import { shareWebsite } from "$lib/toast.svelte";

  let currentSection: string = "";

  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            currentSection = entry.target.id;
          }
        });
      },
      { threshold: 0.5 },
    );

    const sections = document.querySelectorAll("section[id]");
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  });
</script>

<svelte:head>
  <title>About TakeOverBench - Understanding AI Capability Risks</title>
  <meta
    name="description"
    content="Learn why tracking AI capabilities and understanding autonomous AI risks is crucial for humanity's future."
  />
</svelte:head>

<main class="min-h-screen bg-gray-50">
  <!-- Hero Section -->
  <section class="border-b border-gray-900">
    <div class="container mx-auto px-4 md:px-6 lg:px-10 py-16 max-w-4xl">
      <h1 class="text-4xl font-bold text-gray-900 mb-6 text-center">
        Why TakeOverBench exists
      </h1>
      <p class="text-lg leading-relaxed text-center max-w-3xl mx-auto">
        As artificial intelligence systems rapidly advance, we need clear,
        data-driven insights into their capabilities and the risks they may pose
        to human autonomy and control.
      </p>
    </div>
  </section>

  <div class="container mx-auto px-4 md:px-6 lg:px-10 max-w-7xl py-12">
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <!-- Navigation Sidebar -->
      <aside class="lg:col-span-1">
        <nav
          class="sticky top-32 bg-surface-primary rounded-xl border border-gray-400/20 p-8 shadow-sm"
        >
          <h3
            class="font-bold text-gray-900 mb-6 uppercase tracking-widest text-xs"
          >
            Contents
          </h3>
          <ul class="space-y-3">
            <li>
              <a
                href="#our-approach"
                class="text-sm {currentSection === 'our-approach'
                  ? 'text-primary/90 font-medium'
                  : 'text-gray-800 hover:text-gray-900'}"
              >
                Our approach
              </a>
            </li>
            <li>
              <a
                href="#take-action"
                class="text-sm {currentSection === 'take-action'
                  ? 'text-primary/90 font-medium'
                  : 'text-gray-800 hover:text-gray-900'}"
              >
                Take action
              </a>
            </li>
            <li>
              <a
                href="#who-we-are"
                class="text-sm {currentSection === 'who-we-are'
                  ? 'text-primary/90 font-medium'
                  : 'text-gray-800 hover:text-gray-900'}"
              >
                Who we are
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      <!-- Main Content -->
      <div class="lg:col-span-3 space-y-12">
        <section
          id="our-approach"
          class="bg-surface-primary rounded-lg shadow-sm p-8"
        >
          <h2 class="text-3xl font-bold text-gray-900 mb-8">Our approach</h2>
          <div class="prose prose-gray max-w-none space-y-8">
            <div class="max-w-4xl">
              <h3 class="text-xl font-bold text-gray-900 mb-4">
                The Theoretical Framework
              </h3>
              <p class="leading-relaxed text-gray-800 text-lg">
                To identify the most critical risks, we grounded our methodology
                in the research paper <a
                  href="https://arxiv.org/abs/2305.15324"
                  target="_blank"
                  rel="noopener noreferrer"
                  >"Model evaluation for extreme risks" (Shevlane et al., 2023)</a
                >. This framework describes how advanced AI systems might
                develop <strong>9 dangerous capabilities</strong>.
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-12 mt-10">
              <div class="space-y-4">
                <h3
                  class="text-xl font-bold text-gray-900 border-b border-gray-100 pb-2"
                >
                  1. Mapping Capabilities
                </h3>
                <p class="text-gray-800 leading-relaxed text-base">
                  We evaluated dozens of public benchmarks and mapped the most
                  rigorous and relevant ones to the <strong
                    ><a href="/benchmarks">9 dangerous capabilities</a></strong
                  >
                  identified in Shevlane et al. (2023). For each benchmark, we describe
                  why we selected it and what its limitations are.
                </p>
              </div>

              <div class="space-y-4">
                <h3
                  class="text-xl font-bold text-gray-900 border-b border-gray-100 pb-2"
                >
                  2. Linking Scenarios
                </h3>
                <p class="text-gray-800 leading-relaxed text-base">
                  Capabilities don't exist in a vacuum. We composed various
                  concrete <strong
                    ><a href="/threats">Takeover Scenarios</a></strong
                  > (threat models) and linked them to the specific capabilities
                  required to execute them.
                </p>
              </div>

              <div class="space-y-4">
                <h3
                  class="text-xl font-bold text-gray-900 border-b border-gray-100 pb-2"
                >
                  3. Evaluating Model Freshness
                </h3>
                <p class="text-gray-800 leading-relaxed text-base">
                  Due to the speed of AI development, many leading benchmarks
                  become outdated within months. We track and highlight the
                  <strong>"Months since latest update"</strong> to emphasize the
                  critical need for regular benchmark runs on newer frontier models.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          id="take-action"
          class="bg-gradient-to-br from-primary to-surface-primary rounded-lg shadow-lg p-8 text-white"
        >
          <h2 class="text-2xl font-bold mb-4">Take action</h2>
          <p class="leading-relaxed mb-6 text-blue-50">
            Understanding AI risks is the first step. Here's how you can
            contribute to ensuring AI remains beneficial and under human
            control:
          </p>

          <div class="flex flex-wrap gap-4">
            <a
              href="https://github.com/pauseai/takeoverbench"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 px-6 py-3 bg-surface-primary text-gray-900 font-medium rounded-lg hover:bg-gray-300 transition-colors duration-150"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                />
              </svg>
              Contribute on GitHub
            </a>

            <a
              href="https://pauseai.info/join"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 px-6 py-3 bg-[#f97316] text-white font-bold rounded-lg hover:bg-[#ea580c] transition-colors duration-150"
            >
              Join PauseAI
            </a>

            <button
              onclick={shareWebsite}
              class="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur text-white font-bold rounded-lg hover:bg-white/20 transition-all cursor-pointer border-none"
            >
              Share this website
            </button>
          </div>
        </section>

        <section
          id="who-we-are"
          class="bg-surface-primary rounded-lg shadow-sm p-8"
        >
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Who we are</h2>
          <div class="prose prose-gray max-w-none">
            <p class="leading-relaxed mb-8">
              TakeOverBench is an initiative of two organizations dedicated to
              reducing existential risks from artificial intelligence and
              ensuring that advanced AI development remains under meaningful
              human control.
            </p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <!-- Existential Risk Observatory -->
              <div class="flex flex-col items-center text-center">
                <a
                  href="https://www.existentialriskobservatory.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="mb-4 hover:opacity-80 transition-opacity"
                >
                  <img
                    src="/logos/ero_logo.png"
                    alt="Existential Risk Observatory"
                    class="w-32 h-32 rounded-lg"
                  />
                </a>
                <h3 class="text-lg font-semibold text-gray-900 mb-2">
                  Existential Risk Observatory
                </h3>
                <p class="text-sm text-gray-700">
                  Reduces existential risk by informing public debate, believing
                  awareness is the first step toward decreasing risk.
                </p>
              </div>

              <!-- Pause AI -->
              <div class="flex flex-col items-center text-center">
                <a
                  href="https://www.pauseai.info"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="mb-4 hover:opacity-80 transition-opacity"
                >
                  <img
                    src="/logos/pause_ai_logo.png"
                    alt="Existential Risk Observatory"
                    class="w-32 h-32 rounded-lg"
                  />
                </a>
                <h3 class="text-lg font-semibold text-gray-900 mb-2">
                  Pause AI
                </h3>
                <p class="text-sm text-gray-700">
                  Advocates for a temporary pause on training the most powerful
                  AI systems until they can be built safely and kept under
                  democratic control.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</main>

<style>
  /* Smooth scroll for anchor links */
  html {
    scroll-behavior: smooth;
  }

  /* Custom prose styles */
  .prose p {
    margin-bottom: 1rem;
  }

  .prose ul {
    margin-top: 0.5rem;
    margin-bottom: 1rem;
  }

  /* Sticky sidebar on desktop */
  @media (min-width: 1024px) {
    aside nav {
      position: sticky;
      top: 2rem;
    }
  }
</style>
