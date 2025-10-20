import type { PageLoad } from './$types';
import { getThreatModelById, getCapabilityById, calculateThreatRisk } from '$lib/data/benchmarks';
import { error } from '@sveltejs/kit';

export const load: PageLoad = ({ params }) => {
    const threatModel = getThreatModelById(params.id);

    if (!threatModel) {
        throw error(404, 'Threat model not found');
    }

    // Get capability details for this threat model
    const capabilities = threatModel.requiredCapabilities.map(req => ({
        ...req,
        capability: getCapabilityById(req.capabilityId)
    })).filter(item => item.capability !== undefined);

    // Calculate current risk
    const currentRisk = calculateThreatRisk(threatModel);

    return {
        threatModel,
        capabilities,
        currentRisk
    };
};
