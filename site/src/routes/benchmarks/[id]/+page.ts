import type { PageLoad } from "./$types";
import { error } from "@sveltejs/kit";
import { getBenchmarkById, capabilities } from "$lib/data";
import type { Benchmark } from "$lib/types";

/**
 * Load function for the benchmark detail page.
 *
 * Returns:
 * - benchmark: the Benchmark object for the requested id
 * - relatedCapabilities: list of capabilities that reference this benchmark
 *
 * Throws a 404 if the benchmark is not found.
 */
export const load: PageLoad = ({ params }) => {
  const id = params.id;
  const benchmark: Benchmark | undefined = getBenchmarkById(id);

  if (!benchmark) {
    throw error(404, `Benchmark "${id}" not found`);
  }

  // Find capabilities that list this benchmark id
  const relatedCapabilities = (capabilities ?? [])
    .filter((c) => Array.isArray(c.benchmarks) && c.benchmarks.includes(benchmark.id))
    .map((c) => ({ id: c.id, name: c.name }));

  return {
    benchmark,
    relatedCapabilities,
  };
};
