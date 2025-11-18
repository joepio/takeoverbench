import type { PageLoad } from "./$types";
import { getThreatModelById } from "$lib/data";
import { error } from "@sveltejs/kit";

/**
 * Locate any threat markdown/svx files in the repository-level `threat_models`
 * directory. We return the matching module key (string) so the page component
 * can dynamically import it on the client.
 */
const threatMdGlob = import.meta.glob("../../../../threat_models/*.{md,svx}", {
  eager: false,
});

export const load: PageLoad = async ({ params }) => {
  const threatModel = getThreatModelById(params.id);

  if (!threatModel) {
    throw error(404, "Threat model not found");
  }

  // Use the threat model's top-level `benchmarks` array directly.
  // Backwards compatibility fallback removed — the app now relies on the
  // simplified ThreatModel schema where `benchmarks` is authoritative.
  const benchmarkIds = Array.from(new Set(threatModel.benchmarks ?? []));

  // Find matching markdown module (prefer .svx or .md file named after the id)
  const mdKey = Object.keys(threatMdGlob).find(
    (k) => k.endsWith(`${params.id}.md`) || k.endsWith(`${params.id}.svx`),
  );

  return {
    threatModel,
    benchmarkIds,
    mdPath: mdKey ?? null,
  };
};
