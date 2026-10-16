import { configs } from 'eslint-config-hudochenkov';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';

export default [
	{
		ignores: ['**/fixtures/*.js', 'dev/', 'coverage/'],
	},
	...configs.main,
	eslintConfigPrettier,
	{
		languageOptions: {
			globals: {
				...Object.fromEntries(Object.entries(globals.browser).map(([key]) => [key, 'off'])),
				...globals.node,
				...globals.jest,
				groupTest: true,
				runTest: true,
			},
		},
	},
	{
		files: ['benchmark/**/*.js'],
		rules: {
			'no-console': 'off',
			'no-await-in-loop': 'off',
			'no-bitwise': 'off',
			'import/no-extraneous-dependencies': 'off',
		},
	},
	{
		files: ['eslint.config.js', 'index.js'],
		rules: {
			'import/no-default-export': 'off',
		},
	},
];
