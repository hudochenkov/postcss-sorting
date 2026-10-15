declare module 'postcss-styled-syntax' {
	import type { Syntax } from 'postcss';

	const syntax: Syntax;
	export default syntax;
}

declare var groupTest: (
	testGroups: {
		message?: string;
		options: import('./lib/types.js').PluginOptions;
		cases: {
			description?: string;
			only?: boolean;
			fixture: string;
			expected: string;
		}[];
	}[],
) => void;

declare var runTest: (
	input: string,
	opts?: import('./lib/types.js').PluginOptions,
) => Promise<void>;
