import { log10 } from '../common/Math';

/**
 * Get step size for given range and number of steps.
 *
 * @param {Object} range
 * @param {number} range.min
 * @param {number} range.max
 */
export function getStepSize(range, steps) {
  let minLinearRange = log10(range.min);
  let maxLinearRange = log10(range.max);

  let absoluteLinearRange = Math.abs(minLinearRange) + Math.abs(maxLinearRange);

  return absoluteLinearRange / steps;
}

export function cap(range, scale) {
  return Math.max(range.min, Math.min(range.max, scale));
}
