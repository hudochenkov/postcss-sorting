import { execFileSync } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { parseArgs, styleText } from 'node:util';
import process from 'node:process';

import postcss from 'postcss';
import { Bench } from 'tinybench';

import postcssSorting from '../index.js';
import {
	deepNesting,
	manyAtRules,
	manyComments,
	manyRules,
	vendorPrefixed,
	wideRule,
} from './inputs.js';
import { heading, renderComparison, renderResults } from './reporter.js';
import { loadSources } from './sources.js';
import { microScenarios, pluginScenarios } from './scenarios.js';
import { summarize } from './stats.js';

/** @import { Helpers, Root } from 'postcss' */
/** @import { ScenarioResult } from './reporter.js' */
/** @import { InputName } from './scenarios.js' */

const DEFAULT_ITERATIONS = 20;
const DEFAULT_WARMUP = 3;

const HELP = `Usage: pnpm benchmark [options]

Times only the plugin. Parsing the input and cloning it before each iteration
happen outside of the measured region.

Options:
  --scenarios=a,b      Run scenarios whose name or group contains one of the values.
                       Groups: real, synthetic, micro.
  --iterations=N       Measured iterations per scenario (default: ${DEFAULT_ITERATIONS}).
  --warmup=N           Warmup iterations to discard (default: ${DEFAULT_WARMUP}).
  --save=FILE          Save results to a JSON file.
  --show=FILE          Display results from a saved JSON file.
  --compare=FILE       Compare the current run against a saved baseline.
  --compare-to=FILE    Compare --compare against this file without running benchmarks.
  --list               List scenarios.
  --help, -h           Show this message.

Examples:
  pnpm benchmark --save=baseline.json
  pnpm benchmark --compare=baseline.json
  pnpm benchmark --scenarios=real --iterations=40`;

const { values: args } = parseArgs({
	options: {
		scenarios: { type: 'string' },
		iterations: { type: 'string', default: String(DEFAULT_ITERATIONS) },
		warmup: { type: 'string', default: String(DEFAULT_WARMUP) },
		save: { type: 'string' },
		show: { type: 'string' },
		compare: { type: 'string' },
		'compare-to': { type: 'string' },
		list: { type: 'boolean', default: false },
		help: { type: 'boolean', short: 'h', default: false },
	},
});

/**
 * @param {string} file
 * @returns {Promise<{ timestamp?: string, node?: string, commit?: string, results: ScenarioResult[] }>}
 */
async function readReport(file) {
	return JSON.parse(await readFile(file, 'utf8'));
}

function getCommit() {
	try {
		const sha = execFileSync('git', ['rev-parse', '--short', 'HEAD'], {
			encoding: 'utf8',
		}).trim();
		const dirty = execFileSync('git', ['status', '--porcelain'], { encoding: 'utf8' }).trim();

		return dirty ? `${sha}-dirty` : sha;
	} catch {
		return null;
	}
}

/** @type {Map<string, { css: string, root: Root }>} */
const inputCache = new Map();

const inputFactories = {
	real: async () => {
		const sources = await loadSources();

		return sources.map((source) => source.css).join('\n');
	},
	'wide-rule': () => wideRule(),
	'deep-nesting': () => deepNesting(),
	'many-comments': () => manyComments(),
	'many-rules': () => manyRules(),
	'vendor-prefixed': () => vendorPrefixed(),
	'many-at-rules': () => manyAtRules(),
};

/**
 * @param {InputName} name
 */
async function getInput(name) {
	const cached = inputCache.get(name);

	if (cached) {
		return cached;
	}

	const css = await inputFactories[name]();
	const input = { css, root: postcss.parse(css, { from: undefined }) };

	inputCache.set(name, input);

	return input;
}

/**
 * @param {Bench} bench
 * @returns {number[]}
 */
function getSamples(bench) {
	const result = bench.tasks[0]?.result;
	const samples = result && 'latency' in result ? result.latency.samples : undefined;

	if (!samples) {
		throw new Error('Benchmark produced no samples.');
	}

	return [...samples];
}

/**
 * @param {number} iterations
 * @param {number} warmup
 */
function createBench(iterations, warmup) {
	return new Bench({
		time: 0,
		iterations,
		warmupTime: 0,
		warmupIterations: warmup,
		retainSamples: true,
		throws: true,
	});
}

/**
 * @param {(typeof pluginScenarios)[number]} scenario
 * @param {{ iterations: number, warmup: number }} settings
 * @returns {Promise<ScenarioResult>}
 */
async function runPluginScenario(scenario, { iterations, warmup }) {
	const input = await getInput(scenario.input);
	const { Root: processRoot } = postcssSorting(scenario.options);

	/** @param {Root} root */
	function run(root) {
		// The plugin ignores helpers.
		processRoot?.(root, /** @type {Helpers} */ ({}));
	}

	let pristine = input.root;

	if (scenario.sorted) {
		pristine = input.root.clone();
		run(pristine);
	}

	// Without this a misconfigured scenario would silently benchmark a no-op.
	if (!scenario.sorted) {
		const checked = pristine.clone();

		run(checked);

		if (checked.toString() === pristine.toString()) {
			throw new Error(`Scenario "${scenario.name}" did not change the input.`);
		}
	}

	let nodes = 0;

	pristine.walk(() => {
		nodes++;
	});

	// tinybench calls the task once outside of `beforeEach`, so it must not touch `pristine`.
	let root = pristine.clone();
	const bench = createBench(iterations, warmup);

	bench.add(scenario.name, () => run(root), {
		beforeEach() {
			root = pristine.clone();
		},
	});

	await bench.run();

	return {
		name: scenario.name,
		group: scenario.group,
		kb: input.css.length / 1024,
		nodes,
		...summarize(getSamples(bench)),
	};
}

/**
 * @param {(typeof microScenarios)[number]} scenario
 * @param {{ iterations: number, warmup: number }} settings
 * @returns {Promise<ScenarioResult>}
 */
async function runMicroScenario(scenario, { iterations, warmup }) {
	const bench = createBench(iterations, warmup);

	bench.add(scenario.name, scenario.run);

	await bench.run();

	return {
		name: scenario.name,
		group: 'micro',
		kb: null,
		nodes: null,
		...summarize(getSamples(bench)),
	};
}

async function main() {
	if (args.help) {
		console.log(HELP);

		return;
	}

	if (args.list) {
		for (const scenario of pluginScenarios) {
			console.log(`${scenario.group.padEnd(10)} ${scenario.name}`);
		}

		for (const scenario of microScenarios) {
			console.log(`${'micro'.padEnd(10)} ${scenario.name}`);
		}

		return;
	}

	if (args.show) {
		const report = await readReport(args.show);

		console.log(
			heading(
				`${args.show} (${report.timestamp ?? 'unknown date'}, ${report.commit ?? 'unknown commit'})`,
			),
		);
		console.log(renderResults(report.results));

		return;
	}

	if (args.compare && args['compare-to']) {
		const [baseline, current] = await Promise.all([
			readReport(args.compare),
			readReport(args['compare-to']),
		]);

		console.log(renderComparison(baseline.results, current.results));

		return;
	}

	const iterations = Number.parseInt(args.iterations, 10);
	const warmup = Number.parseInt(args.warmup, 10);
	const filters = args.scenarios?.split(',').map((value) => value.trim().toLowerCase());

	/**
	 * @param {string} name
	 * @param {string} group
	 */
	function isSelected(name, group) {
		return (
			!filters ||
			filters.some((filter) => name.toLowerCase().includes(filter) || group === filter)
		);
	}

	const plugins = pluginScenarios.filter((scenario) => isSelected(scenario.name, scenario.group));
	const micros = microScenarios.filter((scenario) => isSelected(scenario.name, 'micro'));

	if (plugins.length + micros.length === 0) {
		throw new Error(`No scenarios match "${args.scenarios}". Use --list to see them.`);
	}

	console.log(heading(`postcss-sorting benchmark (Node ${process.version})`));
	console.log(`Warmup: ${warmup}, iterations: ${iterations}\n`);

	/** @type {ScenarioResult[]} */
	const results = [];

	for (const scenario of plugins) {
		console.log(styleText('dim', `Running ${scenario.name}...`));
		results.push(await runPluginScenario(scenario, { iterations, warmup }));
	}

	for (const scenario of micros) {
		console.log(styleText('dim', `Running ${scenario.name}...`));
		results.push(await runMicroScenario(scenario, { iterations, warmup }));
	}

	console.log(`\n${renderResults(results)}`);

	if (args.save) {
		const report = {
			timestamp: new Date().toISOString(),
			node: process.version,
			commit: getCommit(),
			settings: { iterations, warmup },
			results,
		};

		await mkdir(dirname(args.save), { recursive: true });
		await writeFile(args.save, `${JSON.stringify(report, null, '\t')}\n`);
		console.log(`\nSaved to ${args.save}`);
	}

	if (args.compare) {
		const baseline = await readReport(args.compare);

		console.log(
			`\n${heading(`Comparison with ${args.compare} (${baseline.commit ?? 'unknown commit'})`)}`,
		);
		console.log(renderComparison(baseline.results, results));
	}
}

// eslint-disable-next-line unicorn/prefer-top-level-await -- The ESLint parser setup does not accept it.
main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
