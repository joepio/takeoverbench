import type { PageLoad } from "./$types";
import { error } from "@sveltejs/kit";
import { getBenchmarkById, threatModels } from "$lib/data";
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

  // Find threat models that reference this benchmark id.
  // Primary (new) schema: threatModel.benchmarks is an array of benchmark ids.
  // For backward compatibility we also fall back to the older
  // requiredCapabilities[*].benchmarks shape if present.
  const relatedThreatModels = (threatModels ?? [])
    .filter((t) =>
      Array.isArray(t.benchmarks)
        ? t.benchmarks.includes(benchmark.id)
        : ((t as any).requiredCapabilities ?? []).some(
            (rc: any) =>
              Array.isArray(rc.benchmarks) &&
              rc.benchmarks.includes(benchmark.id),
          ),
    )
    .map((t) => ({
      id: t.id,
      name: t.name,
      // Include any matching capability labels for context (if present).
      capabilities: ((t as any).requiredCapabilities ?? [])
        .filter(
          (rc: any) =>
            Array.isArray(rc.benchmarks) &&
            rc.benchmarks.includes(benchmark.id),
        )
        .map((rc: any) => ({ label: rc.label ?? null })),
    }));

  return {
    benchmark,
    relatedThreatModels,
  };
};
