import { styleText } from 'node:util';

/** @typedef {{ name: string, group: string, kb: number | null, nodes: number | null, iterations: number, trimmedMean: number, mean: number, median: number, min: number, max: number, cv: number }} ScenarioResult */

/**
 * @param {number} ms
 * @returns {string}
 */
export function formatDuration(ms) {
	if (ms < 1) {
		return `${(ms * 1000).toFixed(1)}µs`;
	}

	if (ms < 1000) {
		return `${ms.toFixed(2)}ms`;
	}

	return `${(ms / 1000).toFixed(2)}s`;
}

/**
 * @param {number} value
 * @returns {string}
 */
function formatSigned(value, suffix = '') {
	return `${value >= 0 ? '+' : '-'}${Math.abs(value).toFixed(1)}${suffix}`;
}

/**
 * @param {{ text: string, style?: Parameters<typeof styleText>[0] }[][]} rows
 * @param {string[]} headers
 * @returns {string}
 */
function renderTable(headers, rows) {
	const widths = headers.map((header, column) =>
		Math.max(header.length, ...rows.map((row) => row[column]?.text.length ?? 0)),
	);
	const line = '─'.repeat(widths.reduce((sum, width) => sum + width + 2, 0));

	/**
	 * @param {string} text
	 * @param {number} column
	 */
	function pad(text, column) {
		return column === 0 ? text.padEnd(widths[column] ?? 0) : text.padStart(widths[column] ?? 0);
	}

	const head = headers.map((header, column) => pad(header, column)).join('  ');
	const body = rows.map((row) =>
		row
			.map((cell, column) => {
				const padded = pad(cell.text, column);

				return cell.style ? styleText(cell.style, padded) : padded;
			})
			.join('  '),
	);

	return [line, styleText('bold', head), line, ...body, line].join('\n');
}

/**
 * @param {ScenarioResult[]} results
 * @returns {string}
 */
export function renderResults(results) {
	const headers = ['Scenario', 'Input', 'Nodes', 'Time', '±CV', 'Median', 'ms/KB'];
	const rows = results.map((result) => [
		{ text: result.name },
		{ text: result.kb === null ? '-' : `${result.kb.toFixed(0)} KB` },
		{ text: result.nodes === null ? '-' : String(result.nodes) },
		{ text: formatDuration(result.trimmedMean), style: /** @type {const} */ ('cyan') },
		{
			text: `${result.cv.toFixed(1)}%`,
			style: result.cv > 15 ? /** @type {const} */ ('yellow') : undefined,
		},
		{ text: formatDuration(result.median) },
		{ text: result.kb ? (result.trimmedMean / result.kb).toFixed(3) : '-' },
	]);

	return renderTable(headers, rows);
}

/**
 * The threshold grows with the noise of both runs to avoid false positives.
 *
 * @param {ScenarioResult[]} baseline
 * @param {ScenarioResult[]} current
 * @returns {string}
 */
export function renderComparison(baseline, current) {
	const headers = ['Scenario', 'Baseline', 'Current', 'Diff', 'Change', 'Status'];
	const baselineByName = new Map(baseline.map((result) => [result.name, result]));
	/** @type {Parameters<typeof renderTable>[1]} */
	const rows = [];

	for (const result of current) {
		const base = baselineByName.get(result.name);

		if (!base) {
			rows.push([
				{ text: result.name },
				{ text: '-' },
				{ text: formatDuration(result.trimmedMean) },
				{ text: '-' },
				{ text: '-' },
				{ text: 'new', style: 'dim' },
			]);
			continue;
		}

		const diff = result.trimmedMean - base.trimmedMean;
		const change = (diff / base.trimmedMean) * 100;
		const threshold = Math.max(3, 2 * Math.max(base.cv, result.cv));

		/** @type {{ text: string, style?: Parameters<typeof styleText>[0] }} */
		let status = { text: '≈ Same' };

		if (change > threshold) {
			status = { text: '✗ Slower', style: 'red' };
		} else if (change < -threshold) {
			status = { text: '✓ Faster', style: 'green' };
		}

		rows.push([
			{ text: result.name },
			{ text: formatDuration(base.trimmedMean) },
			{ text: formatDuration(result.trimmedMean) },
			{ text: `${diff >= 0 ? '+' : '-'}${formatDuration(Math.abs(diff))}` },
			{ text: formatSigned(change, '%') },
			status,
		]);
	}

	return renderTable(headers, rows);
}

/**
 * @param {string} text
 * @returns {string}
 */
export function heading(text) {
	return styleText('bold', text);
}
