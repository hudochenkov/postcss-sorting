import { options } from './config.js';

// Seeded so every run benchmarks identical CSS.
function createRandom(seed = 42) {
	let state = seed;

	return () => {
		state = (state + 0x6d2b79f5) | 0;

		let t = Math.imul(state ^ (state >>> 15), 1 | state);

		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;

		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

const properties = options['properties-order'];

/**
 * @param {() => number} random
 * @param {number} count
 * @returns {string}
 */
function declarations(random, count) {
	let css = '';

	for (let index = 0; index < count; index++) {
		const property = properties[Math.floor(random() * properties.length)];

		css += `\t${property}: ${index}px;\n`;
	}

	return css;
}

/** One rule with a huge number of declarations. */
export function wideRule(count = 5000) {
	return `.wide {\n${declarations(createRandom(), count)}}\n`;
}

/** Plain CSS nesting, each level with its own declarations and a nested media query. */
export function deepNesting(depth = 40) {
	const random = createRandom();
	let css = '';

	for (let level = 0; level < depth; level++) {
		css += `.level-${level} {\n${declarations(random, 15)}@media (min-width: ${level}px) { color: red; }\n`;
	}

	return css + '}\n'.repeat(depth);
}

/** Every declaration is surrounded by comments. */
export function manyComments(count = 3000) {
	const random = createRandom();
	let css = '.commented {\n';

	for (let index = 0; index < count; index++) {
		css += `\t/* before ${index} */\n${declarations(random, 1)}\t/* after ${index} */\n`;
	}

	return `${css}}\n`;
}

/** A flat stylesheet with a huge number of small rules. */
export function manyRules(count = 15000) {
	const random = createRandom();
	let css = '';

	for (let index = 0; index < count; index++) {
		css += `.rule-${index} {\n${declarations(random, 3)}}\n`;
	}

	return css;
}
