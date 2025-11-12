import type { PageLoad } from "./$types";
import {
  getThreatModelById,
  getCapabilityById,
  calculateThreatRisk,
} from "$lib/data";
import { error } from "@sveltejs/kit";

/**
 * Find a matching markdown/svx file for the threat model and return its import path.
 *
 * IMPORTANT:
 * - We don't import the component here because page data must be serializable.
 * - Instead we return the module path (string) that +page.svelte can use with
 *   import.meta.glob to dynamically import the Svelte component on the client or in
 *   the component (this avoids returning non-serializable values from load()).
 *
 * The glob pattern targets the repository-level `site/threat_models` directory
 * (relative path from this file).
 */
const threatMdGlob = import.meta.glob("../../../../threat_models/*.svx", {
  eager: false,
});

export const load: PageLoad = async ({ params }) => {
  const threatModel = getThreatModelById(params.id);

  if (!threatModel) {
    throw error(404, "Threat model not found");
  }

  // Get capability details for this threat model
  const capabilities = threatModel.requiredCapabilities
    .map((req) => ({
      ...req,
      capability: getCapabilityById(req.capabilityId),
    }))
    .filter((item) => item.capability !== undefined);

  // Calculate current risk
  const currentRisk = calculateThreatRisk(threatModel);

  // Find a markdown file that matches the threat model id.
  // We return the matching module key (path string), not the module value.
  const mdKey = Object.keys(threatMdGlob).find(
    (k) => k.endsWith(`${params.id}.md`) || k.endsWith(`${params.id}.svx`),
  );

  return {
    threatModel,
    capabilities,
    currentRisk,
    // `mdPath` is the module path string for the threat markdown component.
    // The page component can use the same glob (import.meta.glob) to import it.
    mdPath: mdKey ?? null,
  };
};
