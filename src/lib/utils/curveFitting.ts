import { SimpleLinearRegression } from "ml-regression-simple-linear";
import { ExponentialRegression } from "ml-regression-exponential";
import { levenbergMarquardt } from 'ml-levenberg-marquardt';

export type FitType = "linear" | "exponential" | "sigmoid";

export interface DataPoint {
	x: number;
	y: number;
}

/**
 * Performs curve fitting on data points and returns Chart.js-compatible fitted line data
 *
 * @param points - Array of {x, y} data points
 * @param fitType - Type of fit: "linear", "exponential", or "sigmoid"
 * @param pointCount - Number of points to generate for the fitted line (default: 100)
 * @param lockSigmoidL - For sigmoid fits, lock L to 100 if true (default: true)
 * @returns Array of {x, y} points suitable for Chart.js
 */
export function fitCurve(
	points: DataPoint[],
	fitType: FitType,
	pointCount: number = 100,
	lockSigmoidL: boolean = true,
): DataPoint[] {
	if (points.length < 2) return [];

	// Filter out null values and sort by x
	const validPoints = points
		.filter((p) => p.x != null && p.y != null && typeof p.y === "number")
		.sort((a, b) => a.x - b.x);

	if (validPoints.length < 2) return [];

	const xs = validPoints.map((p) => p.x);
	const ys = validPoints.map((p) => p.y);
	const xMin = Math.min(...xs);
	const xMax = Math.max(...xs);

	let fittedFn: (x: number) => number;

	try {
		switch (fitType) {
			case "linear": {
				const regression = new SimpleLinearRegression(xs, ys);
				fittedFn = (x: number) => regression.predict(x);
				break;
			}
			case "exponential": {
				const regression = new ExponentialRegression(xs, ys);
				fittedFn = (x: number) => regression.predict(x);
				break;
			}
			case "sigmoid": {
				fittedFn = fitSigmoid(validPoints, lockSigmoidL);
				break;
			}
			default:
				return [];
		}
	} catch (error) {
		console.warn(`Curve fitting failed for ${fitType}:`, error);
		return [];
	}

	// Generate points along the fitted curve
	const step = (xMax - xMin) / (pointCount - 1);
	const fittedPoints: DataPoint[] = [];

	for (let i = 0; i < pointCount; i++) {
		const x = xMin + i * step;
		const y = fittedFn(x);
		// Guard against NaN or Infinity
		if (!Number.isFinite(y)) continue;
		fittedPoints.push({ x, y });
	}

	return fittedPoints;
}

/**
 * Sigmoid fit: y = A + (L - A) / (1 + e^(-k*(x-x0)))
 * Uses Levenberg-Marquardt algorithm
 * Parameters: [A (lower asymptote), L (upper asymptote), k (steepness), x0 (midpoint)]
 * @param lockL - If true, locks L to 100 and doesn't optimize it
 */
function fitSigmoid(points: DataPoint[], lockL: boolean = true): (x: number) => number {
	const xs = points.map((p) => p.x);
	const ys = points.map((p) => p.y);

	// Original data bounds
	const xMin = Math.min(...xs);
	const xMax = Math.max(...xs);
	const minY = Math.min(...ys);
	const L = 100; // Upper asymptote

	// Normalize x and y to [0, 1] range for better numerical stability
	const xRange = xMax - xMin;
	const yRange = L - minY;

	const xsNorm = xs.map((x) => (x - xMin) / xRange);
	const ysNorm = ys.map((y) => (y - minY) / yRange);

	// Initial parameter estimates in normalized space
	const A_norm = 0; // Lower asymptote in normalized space (minY maps to 0)
	const L_norm = 1; // Upper asymptote in normalized space (100 maps to 1)
	const x0_norm = 0.5; // Midpoint in normalized space

	// Estimate k in normalized space
	let k_norm = 1;
	const maxY_norm = Math.max(...ysNorm);
	const minY_norm = Math.min(...ysNorm);
	if (maxY_norm > minY_norm) {
		const slope_norm = (maxY_norm - minY_norm) / 1; // x-range is normalized to 1
		k_norm = slope_norm / 4;
		if (!Number.isFinite(k_norm) || k_norm < 1e-10) {
			k_norm = 1;
		}
	}

	let sigmoidFunction: (params: number[]) => (x: number) => number;
	let initialValues: number[];
	let minValues: number[];

	if (lockL) {
		sigmoidFunction = ([A_norm, k_norm, x0_norm]: number[]) => {
			return (x_norm: number) =>
				A_norm + (L_norm - A_norm) / (1 + Math.exp(-k_norm * (x_norm - x0_norm)));
		};
		initialValues = [A_norm, k_norm, x0_norm];
		minValues = [0, 1e-10, -1]; // A_norm, k_norm (positive), x0_norm
	} else {
		sigmoidFunction = ([A_norm, L_norm, k_norm, x0_norm]: number[]) => {
			return (x_norm: number) =>
				A_norm + (L_norm - A_norm) / (1 + Math.exp(-k_norm * (x_norm - x0_norm)));
		};
		initialValues = [A_norm, L_norm, k_norm, x0_norm];
		minValues = [0, 0.5, 1e-10, -1]; // A_norm, L_norm, k_norm (positive), x0_norm
	}

	const data = {
		x: xsNorm,
		y: ysNorm,
	};

	const options = {
		initialValues,
		minValues,
		damping: 1.5,
		maxIterations: 100,
		errorTolerance: 1e-6,
	};

	try {
		const result = levenbergMarquardt(data, sigmoidFunction, options) as any;
		const params = result.parameterValues;

		if (lockL) {
			// Parameters in normalized space: [A_norm, k_norm, x0_norm]
			const [A_norm2, k_norm2, x0_norm2] = params;
			// Transform back to original space
			return (x: number) => {
				const x_norm = (x - xMin) / xRange;
				const y_norm =
					A_norm2 + (L_norm - A_norm2) / (1 + Math.exp(-k_norm2 * (x_norm - x0_norm2)));
				return y_norm * yRange + minY;
			};
		} else {
			// Parameters in normalized space: [A_norm, L_norm, k_norm, x0_norm]
			const [A_norm2, L_norm2, k_norm2, x0_norm2] = params;
			// Transform back to original space
			return (x: number) => {
				const x_norm = (x - xMin) / xRange;
				const y_norm =
					A_norm2 + (L_norm2 - A_norm2) / (1 + Math.exp(-k_norm2 * (x_norm - x0_norm2)));
				return y_norm * yRange + minY;
			};
		}
	} catch (error) {
		console.warn("Sigmoid fitting failed, using fallback:", error);
		// Fallback: simple linear-like function
		return (x: number) => {
			const x_norm = (x - xMin) / xRange;
			return minY + x_norm * yRange;
		};
	}
}
