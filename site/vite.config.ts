import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import path from "path";
import { fileURLToPath } from "url";

// Resolve __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
  server: {
    // Allow Vite to serve files from the `site/data` and `site/threat_models` directories.
    // Vite restricts filesystem access by default; add these paths so the app can import
    // JSON from `site/data` and load markdown files from `site/threat_models`.
    fs: {
      allow: [
        path.resolve(__dirname, "data"),
        path.resolve(__dirname, "threat_models"),
      ],
    },
  },
});
