/**
 * Mean with the top and bottom 10% of samples removed, plus spread of the kept samples.
 *
 * @param {number[]} samples Durations in ms.
 */
export function summarize(samples) {
	const sorted = [...samples].sort((a, b) => a - b);
	const trim = Math.floor(sorted.length * 0.1);
	const kept = sorted.slice(trim, sorted.length - trim);
	const trimmedMean = average(kept);
	const variance =
		kept.length > 1
			? kept.reduce((sum, value) => sum + (value - trimmedMean) ** 2, 0) / (kept.length - 1)
			: 0;

	return {
		iterations: sorted.length,
		min: sorted[0] ?? 0,
		max: sorted.at(-1) ?? 0,
		median: sorted[Math.floor(sorted.length / 2)] ?? 0,
		mean: average(sorted),
		trimmedMean,
		// Coefficient of variation, in percent.
		cv: trimmedMean === 0 ? 0 : (Math.sqrt(variance) / trimmedMean) * 100,
	};
}

/**
 * @param {number[]} values
 */
function average(values) {
	return values.length === 0 ? 0 : values.reduce((sum, value) => sum + value, 0) / values.length;
}
