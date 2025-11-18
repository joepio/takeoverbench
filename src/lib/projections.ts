/**
 * Projection utilities for forecasting benchmark trends.
 *
 * Supports two projection methods:
 * - S-curve (logistic): For capabilities approaching saturation (e.g., 100% accuracy)
 * - Exponential: For unbounded growth (e.g., METR time horizon in minutes)
 */

export interface DataPoint {
  x: number; // timestamp
  y: number; // score value
}

export interface ProjectionResult {
  projectedPoints: DataPoint[];
  confidence: number; // 0-1, how confident we are in this projection
}

/**
 * Fit a logistic (S-curve) function to the data and project future values.
 *
 * Logistic function: y = L / (1 + exp(-k * (x - x0)))
 * where L is the maximum value (ceiling), k is the growth rate, x0 is the midpoint
 *
 * This is appropriate for benchmarks that approach a saturation point (like 100% accuracy).
 */
function fitLogisticCurve(
  dataPoints: DataPoint[],
  projectionMonths: number,
  ceiling: number = 100,
): ProjectionResult {
  if (dataPoints.length < 2) {
    return { projectedPoints: [], confidence: 0 };
  }

  // Filter valid points
  const validPoints = dataPoints.filter(
    (p) => p.y !== null && !isNaN(p.y) && p.y >= 0 && p.y <= ceiling,
  );

  if (validPoints.length < 2) {
    return { projectedPoints: [], confidence: 0 };
  }

  // Normalize time to years from first point
  const minTime = Math.min(...validPoints.map((p) => p.x));
  const normalizedPoints = validPoints.map((p) => ({
    x: (p.x - minTime) / (365.25 * 24 * 60 * 60 * 1000), // convert to years
    y: p.y,
  }));

  const n = normalizedPoints.length;
  const first = normalizedPoints[0];
  const last = normalizedPoints[n - 1];
  const L = ceiling; // Max capacity

  // For 2 points, use simple linear projection with S-curve constraints
  if (n === 2) {
    const deltaY = last.y - first.y;
    const deltaX = last.x - first.x;

    if (deltaX <= 0 || deltaY <= 0) {
      return { projectedPoints: [], confidence: 0 };
    }

    const linearSlope = deltaY / deltaX;
    const projectedPoints: DataPoint[] = [];
    const lastTime = last.x;
    const projectionYears = projectionMonths / 12;
    const steps = Math.ceil(projectionYears * 12);

    for (let i = 1; i <= steps; i++) {
      const futureTime = lastTime + i / 12;
      let y = last.y + linearSlope * (futureTime - lastTime);

      // Apply soft ceiling to prevent exceeding L
      y = Math.min(y, L * 0.99);

      const timestamp = minTime + futureTime * 365.25 * 24 * 60 * 60 * 1000;

      if (y > last.y * 0.95 && y < L) {
        projectedPoints.push({ x: timestamp, y });
      }
    }

    const confidence = Math.min(
      0.6, // Lower confidence for 2-point projection
      (deltaX > 0.3 ? 0.6 : deltaX * 2) * // at least ~4 months of data
        (deltaY > 3 ? 1.0 : 0.5),
    );

    return { projectedPoints, confidence };
  }

  // Three or more points: use logistic fit
  const mid = normalizedPoints[Math.floor(n / 2)];

  // Estimate k (growth rate) and x0 (midpoint)
  // Using simplified estimation based on point differences
  let k = 1.0;
  let x0 = mid.x;

  if (mid.y > first.y && mid.y < L * 0.95) {
    // Calculate growth rate from the slope
    const deltaY = last.y - first.y;
    const deltaX = last.x - first.x;
    if (deltaX > 0 && deltaY > 0) {
      k = (4 * deltaY) / (L * deltaX);
    }

    // Estimate midpoint (where y = L/2)
    x0 = first.x + (L / 2 - first.y) / ((k * L) / 4);
  }

  // Generate projection points
  const projectedPoints: DataPoint[] = [];
  const lastTime = normalizedPoints[n - 1].x;
  const projectionYears = projectionMonths / 12;
  const steps = Math.ceil(projectionYears * 12); // monthly steps

  for (let i = 1; i <= steps; i++) {
    const futureTime = lastTime + i / 12;
    const y = L / (1 + Math.exp(-k * (futureTime - x0)));

    // Convert back to timestamp
    const timestamp = minTime + futureTime * 365.25 * 24 * 60 * 60 * 1000;

    // Only add if still growing and below ceiling
    if (y < L * 0.99 && y > normalizedPoints[n - 1].y * 0.95) {
      projectedPoints.push({ x: timestamp, y: Math.min(y, L) });
    }
  }

  // Calculate confidence based on data quality
  const timeSpan = last.x - first.x;
  const valueGrowth = last.y - first.y;
  const confidence = Math.min(
    1.0,
    (validPoints.length / 10) * // more points = more confidence
      (timeSpan > 0.5 ? 1.0 : timeSpan * 2) * // at least 6 months of data
      (valueGrowth > 5 ? 1.0 : 0.5), // meaningful growth
  );

  return { projectedPoints, confidence };
}

/**
 * Fit an exponential function to the data and project future values.
 *
 * Exponential function: y = a * exp(b * x)
 *
 * This is appropriate for unbounded growth like METR time horizon (task length in minutes).
 */
function fitExponentialCurve(
  dataPoints: DataPoint[],
  projectionMonths: number,
): ProjectionResult {
  if (dataPoints.length < 2) {
    return { projectedPoints: [], confidence: 0 };
  }

  // Filter valid points with positive values (required for log transform)
  const validPoints = dataPoints.filter(
    (p) => p.y !== null && !isNaN(p.y) && p.y > 0,
  );

  if (validPoints.length < 2) {
    return { projectedPoints: [], confidence: 0 };
  }

  // Normalize time to years from first point
  const minTime = Math.min(...validPoints.map((p) => p.x));
  const normalizedPoints = validPoints.map((p) => ({
    x: (p.x - minTime) / (365.25 * 24 * 60 * 60 * 1000), // convert to years
    y: p.y,
  }));

  const n = normalizedPoints.length;
  const lastTime = normalizedPoints[n - 1].x;
  const lastValue = normalizedPoints[n - 1].y;

  // For exponential with few points, use recent growth rate
  // Calculate growth rate from last few points (or all if < 5)
  const recentCount = Math.min(5, n);
  const recentPoints = normalizedPoints.slice(-recentCount);

  // Fit exponential using linear regression on log-transformed recent data
  const logPoints = recentPoints.map((p) => ({
    x: p.x,
    y: Math.log(Math.max(0.001, p.y)), // prevent log(0)
  }));

  // Calculate linear regression coefficients
  const sumX = logPoints.reduce((sum, p) => sum + p.x, 0);
  const sumY = logPoints.reduce((sum, p) => sum + p.y, 0);
  const sumXY = logPoints.reduce((sum, p) => sum + p.x * p.y, 0);
  const sumXX = logPoints.reduce((sum, p) => sum + p.x * p.x, 0);

  const b =
    (logPoints.length * sumXY - sumX * sumY) /
    (logPoints.length * sumXX - sumX * sumX);
  const lnA = (sumY - b * sumX) / logPoints.length;
  const a = Math.exp(lnA);

  // If growth rate is too aggressive, dampen it
  const doublingTime = Math.log(2) / b;
  let adjustedB = b;
  if (doublingTime < 0.3) {
    // If doubling faster than ~4 months, slow it down
    adjustedB = Math.log(2) / 0.3;
  } else if (doublingTime > 3) {
    // If doubling slower than 3 years, speed it up slightly
    adjustedB = Math.log(2) / 2;
  }

  // Generate projection points with smoother growth
  const projectedPoints: DataPoint[] = [];
  const projectionYears = projectionMonths / 12;
  const steps = Math.ceil(projectionYears * 4); // quarterly steps for smoother curve

  for (let i = 1; i <= steps; i++) {
    const futureTime = lastTime + i / 4;
    const timeDelta = futureTime - lastTime;

    // Project from last known value using adjusted growth rate
    const y = lastValue * Math.exp(adjustedB * timeDelta);

    // Convert back to timestamp
    const timestamp = minTime + futureTime * 365.25 * 24 * 60 * 60 * 1000;

    // More conservative limits: 3x growth in a year is already aggressive
    const maxGrowth = lastValue * (1 + 3 * (timeDelta / 1.0));
    const constrainedY = Math.min(y, maxGrowth);

    if (constrainedY > lastValue * 0.98) {
      projectedPoints.push({ x: timestamp, y: constrainedY });
    }
  }

  // Calculate confidence
  const r2 = calculateR2(logPoints, lnA, b);
  const timeSpan = normalizedPoints[n - 1].x - normalizedPoints[0].x;

  const confidence = Math.min(
    0.8, // Lower max confidence for exponential
    r2 *
      0.9 * // how well the exponential fits
      (validPoints.length / 8) * // more points = more confidence
      (timeSpan > 0.5 ? 1.0 : timeSpan * 2), // at least 6 months of data
  );

  return { projectedPoints, confidence };
}

/**
 * Calculate R² (coefficient of determination) for linear regression fit
 */
function calculateR2(
  points: DataPoint[],
  intercept: number,
  slope: number,
): number {
  const meanY = points.reduce((sum, p) => sum + p.y, 0) / points.length;

  let ssRes = 0; // residual sum of squares
  let ssTot = 0; // total sum of squares

  for (const point of points) {
    const predicted = intercept + slope * point.x;
    ssRes += Math.pow(point.y - predicted, 2);
    ssTot += Math.pow(point.y - meanY, 2);
  }

  return ssTot === 0 ? 0 : 1 - ssRes / ssTot;
}

/**
 * Generate projections for a benchmark based on its projection type.
 *
 * @param dataPoints Historical data points (x: timestamp in ms, y: score value)
 * @param projectionType Type of projection to use
 * @param projectionMonths How many months ahead to project (default: 12)
 * @param ceiling Maximum value for s-curve projections (default: 100)
 */
export function generateProjection(
  dataPoints: DataPoint[],
  projectionType: "s-curve" | "exponential" | "none",
  projectionMonths: number = 12,
  ceiling: number = 100,
): ProjectionResult {
  if (projectionType === "none" || dataPoints.length < 2) {
    return { projectedPoints: [], confidence: 0 };
  }

  if (projectionType === "exponential") {
    return fitExponentialCurve(dataPoints, projectionMonths);
  }

  // Default to s-curve
  return fitLogisticCurve(dataPoints, projectionMonths, ceiling);
}
