/**
 * Projection utilities for forecasting benchmark trends.
 *
 * Uses pre-fitted parameters from Python curve fitting (data/fitted_projections.json).
 * Supports two projection methods:
 * - S-curve (logistic): For capabilities approaching saturation (e.g., 100% accuracy)
 * - Exponential: For unbounded growth (e.g., METR time horizon)
 */

import fittedProjections from "../../data/fitted_projections.json";

export interface DataPoint {
  x: number; // timestamp
  y: number; // score value
}

export interface ProjectionResult {
  projectedPoints: DataPoint[];
}

interface LogisticParams {
  type: "logistic";
  k: number;
  k_std: number | null;
  L_0: number;
  L_1: number;
  anchor_date: string;
  anchor_y: number;
  date_origin: string;
  n_points: number;
}

interface ExponentialParams {
  type: "exponential";
  b: number;
  b_std: number | null;
  date_origin: string;
  anchor_date: string;
  anchor_y: number;
  n_points: number;
}

type FittedParams = LogisticParams | ExponentialParams;

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Generate projection using pre-fitted logistic parameters.
 *
 * Uses anchored logistic formula that passes through (anchor_date, anchor_y):
 * y = L_0 + (L_1 - L_0) * (y_a - L_0) / ((y_a - L_0) + (L_1 - y_a) * exp(-k * (t - t_a)))
 */
function projectLogistic(
  params: LogisticParams,
  projectionMonths: number,
): ProjectionResult {
  const { k, L_0, L_1, anchor_date, anchor_y, date_origin, n_points } = params;

  const dateOriginMs = new Date(date_origin).getTime();
  const anchorDateMs = new Date(anchor_date).getTime();
  const anchorT = (anchorDateMs - dateOriginMs) / MS_PER_DAY;

  // Clamp anchor_y away from bounds for numerical stability
  const y_a = Math.max(L_0 + 1e-6, Math.min(L_1 - 1e-6, anchor_y));

  const projectedPoints: DataPoint[] = [];
  const projectionDays = projectionMonths * 30;
  const pointsPerMonth = 1; // weekly resolution
  const steps = projectionMonths * pointsPerMonth;

  for (let i = 1; i <= steps; i++) {
    const futureDays = (i / steps) * projectionDays;
    const t = anchorT + futureDays;
    const timestamp = dateOriginMs + t * MS_PER_DAY;

    // Anchored logistic formula
    const numerator = y_a - L_0;
    const denominator =
      numerator + (L_1 - y_a) * Math.exp(-k * (t - anchorT));
    const y = L_0 + (L_1 - L_0) * (numerator / denominator);

    // Stop if we're very close to ceiling
    if (y >= L_1 * 0.995) break;

    projectedPoints.push({ x: timestamp, y });
  }

  return { projectedPoints };
}

/**
 * Generate projection using pre-fitted exponential parameters.
 *
 * Anchored exponential formula: y = anchor_y * exp(b * (t - t_anchor))
 * This ensures the curve passes through (anchor_date, anchor_y).
 */
function projectExponential(
  params: ExponentialParams,
  projectionMonths: number,
): ProjectionResult {
  const { b, date_origin, anchor_date, anchor_y } = params;

  const dateOriginMs = new Date(date_origin).getTime();
  const anchorDateMs = new Date(anchor_date).getTime();
  const anchorT = (anchorDateMs - dateOriginMs) / MS_PER_DAY;

  const projectedPoints: DataPoint[] = [];
  const projectionDays = projectionMonths * 30;
  const pointsPerMonth = 4; // weekly resolution
  const steps = projectionMonths * pointsPerMonth;

  for (let i = 1; i <= steps; i++) {
    const futureDays = (i / steps) * projectionDays;
    const t = anchorT + futureDays;
    const timestamp = dateOriginMs + t * MS_PER_DAY;

    // Anchored exponential formula
    const y = anchor_y * Math.exp(b * (t - anchorT));

    projectedPoints.push({ x: timestamp, y });
  }

  return { projectedPoints };
}

/**
 * Generate projections for a benchmark using pre-fitted parameters.
 *
 * @param benchmarkId The benchmark ID to get fitted params for
 * @param projectionMonths How many months ahead to project (default: 12)
 */
export function generateProjection(
  benchmarkId: string,
  projectionMonths: number = 12,
): ProjectionResult {
  const params = (fittedProjections as Record<string, FittedParams>)[
    benchmarkId
  ];

  if (!params) {
    return { projectedPoints: [] };
  }

  if (params.type === "logistic") {
    return projectLogistic(params, projectionMonths);
  } else if (params.type === "exponential") {
    return projectExponential(params, projectionMonths);
  }

  return { projectedPoints: [] };
}

/**
 * Get the fitted parameters for a benchmark (useful for debugging/display).
 */
export function getFittedParams(
  benchmarkId: string,
): FittedParams | undefined {
  return (fittedProjections as Record<string, FittedParams>)[benchmarkId];
}
