<script lang="ts">
    import { page } from "$app/stores";
</script>

<header class="bg-gray-100 border-b border-gray-300 sticky top-0 z-50 backdrop-blur-md bg-opacity-80">
    <nav class="container mx-auto px-4 max-w-7xl">
        <div class="flex items-center justify-between h-16">

            <!-- Logo and Brand -->
            <div class="flex items-center gap-8">
                <a href="/" class="flex items-center gap-3 group">
                    <div class="w-8 h-8 rounded-lg flex items-center justify-center
                                bg-red-700 border border-red-600 transition-all duration-200
                                group-hover:shadow-red-500/40 group-hover:shadow-lg group-hover:scale-105">

                        <!-- Stark white icon -->
                        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z">
                            </path>
                        </svg>
                    </div>

                    <div>
                        <div class="font-semibold text-gray-900">TakeOverBench</div>
                        <div class="text-xs text-gray-600">Progress towards takeover</div>
                    </div>
                </a>

                <!-- Main Navigation -->
                <div class="hidden md:flex items-center gap-6">

                    <a
                        href="/"
                        class="text-sm font-medium transition-colors duration-150
                            {$page.url.pathname === '/' 
                                ? 'text-red-500' 
                                : 'text-gray-700 hover:text-gray-900'}"
                    >
                        Home
                    </a>

                    <a
                        href="/threats"
                        class="text-sm font-medium transition-colors duration-150
                            {$page.url.pathname.startsWith('/threat') 
                                ? 'text-red-500' 
                                : 'text-gray-700 hover:text-gray-900'}"
                    >
                        Takeover Scenarios
                    </a>

                    <a
                        href="/benchmarks"
                        class="text-sm font-medium transition-colors duration-150
                            {$page.url.pathname.startsWith('/benchmark') 
                                ? 'text-red-500' 
                                : 'text-gray-700 hover:text-gray-900'}"
                    >
                        Benchmarks
                    </a>

                    <a
                        href="/about"
                        class="text-sm font-medium transition-colors duration-150
                            {$page.url.pathname === '/about' 
                                ? 'text-red-500' 
                                : 'text-gray-700 hover:text-gray-900'}"
                    >
                        About
                    </a>

                </div>
            </div>

            <!-- Right side actions -->
            <div class="flex items-center gap-4">
                <!-- GitHub -->
                <a
                    href="https://github.com/pauseai/takeoverbench"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="p-2 text-gray-700 hover:text-gray-900 transition-colors duration-150"
                    aria-label="View on GitHub"
                >
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                </a>

                <!-- Mobile menu -->
                <button class="md:hidden p-2 text-gray-700 hover:text-gray-900" aria-label="Open menu">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                </button>
            </div>

        </div>
    </nav>
</header>

<style>
    header {
        /* Darker, more ominous header shadow */
        box-shadow: 0 2px 6px rgba(0,0,0,0.4), 0 1px 3px rgba(0,0,0,0.3);
    }

    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
    }

    .animate-pulse {
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
</style>
