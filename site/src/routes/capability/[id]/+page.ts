import type { PageLoad } from "./$types";
import { error } from "@sveltejs/kit";
import { getCapabilityById, getBenchmarkById } from "$lib/data";
import type { Capability, Benchmark } from "$lib/types";

/**
 * Load function for capability detail page.
 *
 * Returns:
 * - capability: the capability object for the requested id
 * - relevantBenchmarkIds: string[] of benchmark ids that measure this capability
 * - relevantBenchmarks: Benchmark[] the resolved benchmark objects (filtered to existing ones)
 *
 * Throws a 404 if the capability is not found.
 */
export const load: PageLoad = ({ params }) => {
  const id = params.id;
  const capability: Capability | undefined = getCapabilityById(id);

  if (!capability) {
    throw error(404, `Capability "${id}" not found`);
  }

  const relevantBenchmarkIds: string[] = capability.benchmarks ?? [];
  const relevantBenchmarks: Benchmark[] = relevantBenchmarkIds
    .map((bid) => getBenchmarkById(bid))
    .filter((b): b is Benchmark => !!b);

  return {
    capability,
    relevantBenchmarkIds,
    relevantBenchmarks,
  };
};
