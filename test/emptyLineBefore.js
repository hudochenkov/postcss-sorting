import postcss from 'postcss';
import test from 'ava';
import plugin from '../';

const testGroups = [
	{
		options: {
			'custom-property-empty-line-before': true
		},
		cases: [
			{
				fixture: 'a{\n --custom-prop: value; }',
				expected: 'a{\n\n --custom-prop: value; }',
			},
			{
				fixture: 'a {\n --custom-prop: value;\n}',
				expected: 'a {\n\n --custom-prop: value;\n}',
			},
			{
				fixture: 'a {\r\n --custom-prop: value;\r\n}',
				expected: 'a {\n\r\n --custom-prop: value;\r\n}',
			},
			{
				fixture: 'a{\n\n --custom-prop: value; \n --custom-prop2: value;}',
				expected: 'a{\n\n --custom-prop: value;\n \n --custom-prop2: value;}',
			},
			{
				fixture: 'a{\r\n\r\n --custom-prop: value;\r\n --custom-prop2: value;}',
				expected: 'a{\r\n\r\n --custom-prop: value;\n\r\n --custom-prop2: value;}',
			},
			{
				fixture: 'a{\n top: 10px;\n --custom-prop: value;}',
				expected: 'a{\n top: 10px;\n\n --custom-prop: value;}',
			},
			{
				fixture: 'a{\n @extends .class;\r\n --custom-prop: value;}',
				expected: 'a{\n @extends .class;\n\r\n --custom-prop: value;}',
			},
			{
				fixture: 'a{\n $var: value;\n --custom-prop: value;}',
				expected: 'a{\n $var: value;\n\n --custom-prop: value;}',
			},
		],
	},
	{
		options: {
			'custom-property-empty-line-before': [true, { ignore: ['after-comment'] }]
		},
		cases: [
			{
				fixture: 'a {\n --custom-prop: value;\n}',
				expected: 'a {\n\n --custom-prop: value;\n}',
			},
			{
				fixture: 'a {\n/* comment */ --custom-prop: value;\n}',
				expected: 'a {\n/* comment */ --custom-prop: value;\n}',
			},
			{
				fixture: 'a {\n/* comment */\n--custom-prop: value;\n}',
				expected: 'a {\n/* comment */\n--custom-prop: value;\n}',
			},
			{
				fixture: 'a {\r\n/* comment */\r\n--custom-prop: value;\r\n}',
				expected: 'a {\r\n/* comment */\r\n--custom-prop: value;\r\n}',
			},
		],
	},
	{
		options: {
			'custom-property-empty-line-before': [true, { ignore: ['inside-single-line-block'] }]
		},
		cases: [
			{
				fixture: 'a { --custom-prop: value; }',
				expected: 'a { --custom-prop: value; }',
			},
			{
				fixture: 'a {\n\n --custom-prop: value;\n}',
				expected: 'a {\n\n --custom-prop: value;\n}',
			},
			{
				fixture: 'a {\n --custom-prop: value;\n}',
				expected: 'a {\n\n --custom-prop: value;\n}',
			},
		],
	},
	{
		options: {
			'custom-property-empty-line-before': [true, { except: ['first-nested'] }]
		},
		cases: [
			{
				fixture: 'a { --custom-prop: value;\n}',
				expected: 'a { --custom-prop: value;\n}',
			},
			{
				fixture: 'a {\n --custom-prop: value;\n}',
				expected: 'a {\n --custom-prop: value;\n}',
			},
			{
				fixture: 'a {\r\n --custom-prop: value;\r\n}',
				expected: 'a {\r\n --custom-prop: value;\r\n}',
			},
			{
				fixture: 'a {\n\n --custom-prop: value;\n}',
				expected: 'a {\n\n --custom-prop: value;\n}',
			},
			{
				fixture: 'a {\r\n\r\n --custom-prop: value;\r\n}',
				expected: 'a {\r\n\r\n --custom-prop: value;\r\n}',
			},
		],
	},
	{
		options: {
			'custom-property-empty-line-before': [true, { except: ['after-comment'] }]
		},
		cases: [
			{
				fixture: 'a {\n\n --custom-prop: value;\n}',
				expected: 'a {\n\n --custom-prop: value;\n}',
			},
			{
				fixture: 'a {/* I am a comment */ \n --custom-prop2: value;}',
				expected: 'a {/* I am a comment */ \n --custom-prop2: value;}',
			},
			{
				fixture: 'a {/* I am a comment */ \r\n --custom-prop2: value;}',
				expected: 'a {/* I am a comment */ \r\n --custom-prop2: value;}',
			},
			{
				fixture: 'a {\n\n --custom-prop: value;\n /* I am a comment */ \n\n --custom-prop2: value;}',
				expected: 'a {\n\n --custom-prop: value;\n /* I am a comment */ \n\n --custom-prop2: value;}',
			},
			{
				fixture: 'a {\n /* I am a comment */ \r\n\r\n --custom-prop2: value;}',
				expected: 'a {\n /* I am a comment */ \r\n\r\n --custom-prop2: value;}',
			},
		],
	},
	{
		options: {
			'custom-property-empty-line-before': [true, { except: ['after-custom-property'] }]
		},
		cases: [
			{
				fixture: 'a {\n\n --custom-prop: value;\n}',
				expected: 'a {\n\n --custom-prop: value;\n}',
			},
			{
				fixture: 'a {\n\n --custom-prop:value; \n --custom-prop2: value;}',
				expected: 'a {\n\n --custom-prop:value; \n --custom-prop2: value;}',
			},
			{
				fixture: 'a {\n\n --custom-prop:value; \r\n --custom-prop2: value;}',
				expected: 'a {\n\n --custom-prop:value; \r\n --custom-prop2: value;}',
			},
			{
				fixture: 'a {\n\n --custom-prop:value;\n\n --custom-prop2: value;}',
				expected: 'a {\n\n --custom-prop:value;\n\n --custom-prop2: value;}',
			},
			{
				fixture: 'a {\n\n --custom-prop: value;\r\n\r\n --custom-prop2: value;}',
				expected: 'a {\n\n --custom-prop: value;\r\n\r\n --custom-prop2: value;}',
			},
		],
	},
	{
		options: {
			'custom-property-empty-line-before': [true, { except: ['first-nested', 'after-comment', 'after-custom-property'] }]
		},
		cases: [
			{
				fixture: `a {\n --custom-prop: value; \n --custom-prop2: value; \n /* comment */ \n --custom-prop3: value;\n\n @extends 'x';\n\n --custom-prop4: value; \n & b {\n prop: value;\n } \n\n --custom-prop5: value; \n }`,
				expected: `a {\n --custom-prop: value; \n --custom-prop2: value; \n /* comment */ \n --custom-prop3: value;\n\n @extends 'x';\n\n --custom-prop4: value; \n & b {\n prop: value;\n } \n\n --custom-prop5: value; \n }`,
			},
		],
	},
	{
		options: {
			'custom-property-empty-line-before': [false]
		},
		cases: [
			{
				fixture: 'a {\n --custom-prop: value;\n}',
				expected: 'a {\n --custom-prop: value;\n}',
			},
			{
				fixture: 'a {\r\n --custom-prop: value;\r\n}',
				expected: 'a {\r\n --custom-prop: value;\r\n}',
			},
			{
				fixture: `a {\n --custom-prop: value; \n --custom-prop2: value; \n\n /* comment */ \n --custom-prop3: value; \n\n @extends 'x'; \n --custom-prop4: value; \n\n & b {\n prop: value; \n } \n --custom-prop5: value;\n }`,
				expected: `a {\n --custom-prop: value; \n --custom-prop2: value; \n\n /* comment */ \n --custom-prop3: value; \n\n @extends 'x'; \n --custom-prop4: value; \n\n & b {\n prop: value; \n } \n --custom-prop5: value;\n }`,
			},
			{
				fixture: 'a{\n top: 10px;\n --custom-prop: value;}',
				expected: 'a{\n top: 10px;\n --custom-prop: value;}',
			},
			{
				fixture: 'a{\n @extends .class;\n --custom-prop: value;}',
				expected: 'a{\n @extends .class;\n --custom-prop: value;}',
			},
			{
				fixture: 'a{\n $var: value;\n --custom-prop: value;}',
				expected: 'a{\n $var: value;\n --custom-prop: value;}',
			},
			{
				fixture: 'a {\n\n --custom-prop: value;\n}',
				expected: 'a {\n\n --custom-prop: value;\n}',
			},
			{
				fixture: 'a {\r\n\r\n --custom-prop: value;\r\n}',
				expected: 'a {\r\n\r\n --custom-prop: value;\r\n}',
			},
			{
				fixture: 'a{\n top: 10px;\n\n --custom-prop: value;}',
				expected: 'a{\n top: 10px;\n\n --custom-prop: value;}',
			},
			{
				fixture: 'a{\n @extends .class;\n\r\n --custom-prop: value;}',
				expected: 'a{\n @extends .class;\n\r\n --custom-prop: value;}',
			},
			{
				fixture: 'a{\n $var: value;\n\n --custom-prop: value;}',
				expected: 'a{\n $var: value;\n\n --custom-prop: value;}',
			},
		],
	},
	{
		options: {
			'custom-property-empty-line-before': [false, { except: ['first-nested'] }]
		},
		cases: [
			{
				fixture: 'a {\n\n --custom-prop: value;\n}',
				expected: 'a {\n\n --custom-prop: value;\n}',
			},
			{
				fixture: 'a {\n\n --custom-prop: value;\n}',
				expected: 'a {\n\n --custom-prop: value;\n}',
			},
			{
				fixture: 'a {\r\n\r\n --custom-prop: value;\r\n}',
				expected: 'a {\r\n\r\n --custom-prop: value;\r\n}',
			},
			{
				fixture: 'a {\n --custom-prop: value;\n}',
				expected: 'a {\n\n --custom-prop: value;\n}',
			},
			{
				fixture: 'a {\r\n --custom-prop: value;\r\n}',
				expected: 'a {\n\r\n --custom-prop: value;\r\n}',
			},
		],
	},
	{
		options: {
			'custom-property-empty-line-before': [false, { except: ['after-comment'] }]
		},
		cases: [
			{
				fixture: 'a {\n --custom-prop: value;\n}',
				expected: 'a {\n --custom-prop: value;\n}',
			},
			{
				fixture: 'a {/* I am a comment */ \n\n --custom-prop2: value;}',
				expected: 'a {/* I am a comment */ \n\n --custom-prop2: value;}',
			},
			{
				fixture: 'a {/* I am a comment */ \r\n\r\n --custom-prop2: value;}',
				expected: 'a {/* I am a comment */ \r\n\r\n --custom-prop2: value;}',
			},
			{
				fixture: 'a {\n --custom-prop: value;\n /* I am a comment */ \n --custom-prop2: value;}',
				expected: 'a {\n --custom-prop: value;\n /* I am a comment */\n \n --custom-prop2: value;}',
			},
			{
				fixture: 'a {\n /* I am a comment */ \r\n --custom-prop2: value;}',
				expected: 'a {\n /* I am a comment */\n \r\n --custom-prop2: value;}',
			},
		],
	},
	{
		options: {
			'custom-property-empty-line-before': [false, { except: ['after-custom-property'] }]
		},
		cases: [
			{
				fixture: 'a {\n --custom-prop: value;\n}',
				expected: 'a {\n --custom-prop: value;\n}',
			},
			{
				fixture: 'a {\n --custom-prop:value; \n\n --custom-prop2: value;}',
				expected: 'a {\n --custom-prop:value; \n\n --custom-prop2: value;}',
			},
			{
				fixture: 'a {\n --custom-prop:value; \r\n\r\n --custom-prop2: value;}',
				expected: 'a {\n --custom-prop:value; \r\n\r\n --custom-prop2: value;}',
			},
			{
				fixture: 'a {\n --custom-prop: value;\n --custom-prop2: value;}',
				expected: 'a {\n --custom-prop: value;\n\n --custom-prop2: value;}',
			},
		],
	},
	{
		options: {
			'custom-property-empty-line-before': [false, { except: ['first-nested', 'after-comment', 'after-custom-property'] }]
		},
		cases: [
			{
				fixture: `a {\n\n --custom-prop: value; \n\n --custom-prop2: value; \n /* comment */ \n\n --custom-prop3: value;\n\n @extends 'x';\n --custom-prop4: value; \n & b {\n prop: value;\n } \n --custom-prop5: value; \n }`,
				expected: `a {\n\n --custom-prop: value; \n\n --custom-prop2: value; \n /* comment */ \n\n --custom-prop3: value;\n\n @extends 'x';\n --custom-prop4: value; \n & b {\n prop: value;\n } \n --custom-prop5: value; \n }`,
			},
		],
	},
	{
		options: {
			'dollar-variable-empty-line-before': true
		},
		cases: [
			{
				fixture: 'a{\n $dollar-variable: value; }',
				expected: 'a{\n\n $dollar-variable: value; }',
			},
			{
				fixture: 'a {\n $dollar-variable: value;\n}',
				expected: 'a {\n\n $dollar-variable: value;\n}',
			},
			{
				fixture: 'a {\r\n $dollar-variable: value;\r\n}',
				expected: 'a {\n\r\n $dollar-variable: value;\r\n}',
			},
			{
				fixture: 'a{\n\n $dollar-variable: value; \n $dollar-variable2: value;}',
				expected: 'a{\n\n $dollar-variable: value;\n \n $dollar-variable2: value;}',
			},
			{
				fixture: 'a{\r\n\r\n $dollar-variable: value;\r\n $dollar-variable2: value;}',
				expected: 'a{\r\n\r\n $dollar-variable: value;\n\r\n $dollar-variable2: value;}',
			},
			{
				fixture: 'a{\n top: 10px;\n $dollar-variable: value;}',
				expected: 'a{\n top: 10px;\n\n $dollar-variable: value;}',
			},
			{
				fixture: 'a{\n @extends .class;\r\n $dollar-variable: value;}',
				expected: 'a{\n @extends .class;\n\r\n $dollar-variable: value;}',
			},
			{
				fixture: 'a{\n --custom-prop: value;\n $dollar-variable: value;}',
				expected: 'a{\n --custom-prop: value;\n\n $dollar-variable: value;}',
			},
		],
	},
	{
		options: {
			'dollar-variable-empty-line-before': [true, { ignore: ['after-comment'] }]
		},
		cases: [
			{
				fixture: 'a {\n $dollar-variable: value;\n}',
				expected: 'a {\n\n $dollar-variable: value;\n}',
			},
			{
				fixture: 'a {\n/* comment */ $dollar-variable: value;\n}',
				expected: 'a {\n/* comment */ $dollar-variable: value;\n}',
			},
			{
				fixture: 'a {\n/* comment */\n$dollar-variable: value;\n}',
				expected: 'a {\n/* comment */\n$dollar-variable: value;\n}',
			},
			{
				fixture: 'a {\r\n/* comment */\r\n$dollar-variable: value;\r\n}',
				expected: 'a {\r\n/* comment */\r\n$dollar-variable: value;\r\n}',
			},
		],
	},
	{
		options: {
			'dollar-variable-empty-line-before': [true, { ignore: ['inside-single-line-block'] }]
		},
		cases: [
			{
				fixture: 'a { $dollar-variable: value; }',
				expected: 'a { $dollar-variable: value; }',
			},
			{
				fixture: 'a {\n\n $dollar-variable: value;\n}',
				expected: 'a {\n\n $dollar-variable: value;\n}',
			},
			{
				fixture: 'a {\n $dollar-variable: value;\n}',
				expected: 'a {\n\n $dollar-variable: value;\n}',
			},
		],
	},
	{
		options: {
			'dollar-variable-empty-line-before': [true, { except: ['first-nested'] }]
		},
		cases: [
			{
				fixture: 'a { $dollar-variable: value;\n}',
				expected: 'a { $dollar-variable: value;\n}',
			},
			{
				fixture: 'a {\n $dollar-variable: value;\n}',
				expected: 'a {\n $dollar-variable: value;\n}',
			},
			{
				fixture: 'a {\r\n $dollar-variable: value;\r\n}',
				expected: 'a {\r\n $dollar-variable: value;\r\n}',
			},
			{
				fixture: 'a {\n\n $dollar-variable: value;\n}',
				expected: 'a {\n\n $dollar-variable: value;\n}',
			},
			{
				fixture: 'a {\r\n\r\n $dollar-variable: value;\r\n}',
				expected: 'a {\r\n\r\n $dollar-variable: value;\r\n}',
			},
		],
	},
	{
		options: {
			'dollar-variable-empty-line-before': [true, { except: ['after-comment'] }]
		},
		cases: [
			{
				fixture: 'a {\n\n $dollar-variable: value;\n}',
				expected: 'a {\n\n $dollar-variable: value;\n}',
			},
			{
				fixture: 'a {/* I am a comment */ \n $dollar-variable2: value;}',
				expected: 'a {/* I am a comment */ \n $dollar-variable2: value;}',
			},
			{
				fixture: 'a {/* I am a comment */ \r\n $dollar-variable2: value;}',
				expected: 'a {/* I am a comment */ \r\n $dollar-variable2: value;}',
			},
			{
				fixture: 'a {\n\n $dollar-variable: value;\n /* I am a comment */ \n\n $dollar-variable2: value;}',
				expected: 'a {\n\n $dollar-variable: value;\n /* I am a comment */ \n\n $dollar-variable2: value;}',
			},
			{
				fixture: 'a {\n /* I am a comment */ \r\n\r\n $dollar-variable2: value;}',
				expected: 'a {\n /* I am a comment */ \r\n\r\n $dollar-variable2: value;}',
			},
		],
	},
	{
		options: {
			'dollar-variable-empty-line-before': [true, { except: ['after-dollar-variable'] }]
		},
		cases: [
			{
				fixture: 'a {\n\n $dollar-variable: value;\n}',
				expected: 'a {\n\n $dollar-variable: value;\n}',
			},
			{
				fixture: 'a {\n\n $dollar-variable:value; \n $dollar-variable2: value;}',
				expected: 'a {\n\n $dollar-variable:value; \n $dollar-variable2: value;}',
			},
			{
				fixture: 'a {\n\n $dollar-variable:value; \r\n $dollar-variable2: value;}',
				expected: 'a {\n\n $dollar-variable:value; \r\n $dollar-variable2: value;}',
			},
			{
				fixture: 'a {\n\n $dollar-variable:value;\n\n $dollar-variable2: value;}',
				expected: 'a {\n\n $dollar-variable:value;\n\n $dollar-variable2: value;}',
			},
			{
				fixture: 'a {\n\n $dollar-variable: value;\r\n\r\n $dollar-variable2: value;}',
				expected: 'a {\n\n $dollar-variable: value;\r\n\r\n $dollar-variable2: value;}',
			},
		],
	},
	{
		options: {
			'dollar-variable-empty-line-before': [true, { except: ['first-nested', 'after-comment', 'after-dollar-variable'] }]
		},
		cases: [
			{
				fixture: `a {\n $dollar-variable: value; \n $dollar-variable2: value; \n /* comment */ \n $dollar-variable3: value;\n\n @extends 'x';\n\n $dollar-variable4: value; \n & b {\n prop: value;\n } \n\n $dollar-variable5: value; \n }`,
				expected: `a {\n $dollar-variable: value; \n $dollar-variable2: value; \n /* comment */ \n $dollar-variable3: value;\n\n @extends 'x';\n\n $dollar-variable4: value; \n & b {\n prop: value;\n } \n\n $dollar-variable5: value; \n }`,
			},
		],
	},
	{
		options: {
			'dollar-variable-empty-line-before': [false]
		},
		cases: [
			{
				fixture: 'a {\n $dollar-variable: value;\n}',
				expected: 'a {\n $dollar-variable: value;\n}',
			},
			{
				fixture: 'a {\r\n $dollar-variable: value;\r\n}',
				expected: 'a {\r\n $dollar-variable: value;\r\n}',
			},
			{
				fixture: `a {\n $dollar-variable: value; \n $dollar-variable2: value; \n\n /* comment */ \n $dollar-variable3: value; \n\n @extends 'x'; \n $dollar-variable4: value; \n\n & b {\n prop: value; \n } \n $dollar-variable5: value;\n }`,
				expected: `a {\n $dollar-variable: value; \n $dollar-variable2: value; \n\n /* comment */ \n $dollar-variable3: value; \n\n @extends 'x'; \n $dollar-variable4: value; \n\n & b {\n prop: value; \n } \n $dollar-variable5: value;\n }`,
			},
			{
				fixture: 'a{\n top: 10px;\n $dollar-variable: value;}',
				expected: 'a{\n top: 10px;\n $dollar-variable: value;}',
			},
			{
				fixture: 'a{\n @extends .class;\n $dollar-variable: value;}',
				expected: 'a{\n @extends .class;\n $dollar-variable: value;}',
			},
			{
				fixture: 'a{\n $var: value;\n $dollar-variable: value;}',
				expected: 'a{\n $var: value;\n $dollar-variable: value;}',
			},
			{
				fixture: 'a {\n\n $dollar-variable: value;\n}',
				expected: 'a {\n\n $dollar-variable: value;\n}',
			},
			{
				fixture: 'a {\r\n\r\n $dollar-variable: value;\r\n}',
				expected: 'a {\r\n\r\n $dollar-variable: value;\r\n}',
			},
			{
				fixture: 'a{\n top: 10px;\n\n $dollar-variable: value;}',
				expected: 'a{\n top: 10px;\n\n $dollar-variable: value;}',
			},
			{
				fixture: 'a{\n @extends .class;\n\r\n $dollar-variable: value;}',
				expected: 'a{\n @extends .class;\n\r\n $dollar-variable: value;}',
			},
			{
				fixture: 'a{\n $var: value;\n\n $dollar-variable: value;}',
				expected: 'a{\n $var: value;\n\n $dollar-variable: value;}',
			},
		],
	},
	{
		options: {
			'dollar-variable-empty-line-before': [false, { except: ['first-nested'] }]
		},
		cases: [
			{
				fixture: 'a {\n\n $dollar-variable: value;\n}',
				expected: 'a {\n\n $dollar-variable: value;\n}',
			},
			{
				fixture: 'a {\n\n $dollar-variable: value;\n}',
				expected: 'a {\n\n $dollar-variable: value;\n}',
			},
			{
				fixture: 'a {\r\n\r\n $dollar-variable: value;\r\n}',
				expected: 'a {\r\n\r\n $dollar-variable: value;\r\n}',
			},
			{
				fixture: 'a {\n $dollar-variable: value;\n}',
				expected: 'a {\n\n $dollar-variable: value;\n}',
			},
			{
				fixture: 'a {\r\n $dollar-variable: value;\r\n}',
				expected: 'a {\n\r\n $dollar-variable: value;\r\n}',
			},
		],
	},
	{
		options: {
			'dollar-variable-empty-line-before': [false, { except: ['after-comment'] }]
		},
		cases: [
			{
				fixture: 'a {\n $dollar-variable: value;\n}',
				expected: 'a {\n $dollar-variable: value;\n}',
			},
			{
				fixture: 'a {/* I am a comment */ \n\n $dollar-variable2: value;}',
				expected: 'a {/* I am a comment */ \n\n $dollar-variable2: value;}',
			},
			{
				fixture: 'a {/* I am a comment */ \r\n\r\n $dollar-variable2: value;}',
				expected: 'a {/* I am a comment */ \r\n\r\n $dollar-variable2: value;}',
			},
			{
				fixture: 'a {\n $dollar-variable: value;\n /* I am a comment */ \n $dollar-variable2: value;}',
				expected: 'a {\n $dollar-variable: value;\n /* I am a comment */\n \n $dollar-variable2: value;}',
			},
			{
				fixture: 'a {\n /* I am a comment */ \r\n $dollar-variable2: value;}',
				expected: 'a {\n /* I am a comment */\n \r\n $dollar-variable2: value;}',
			},
		],
	},
	{
		options: {
			'dollar-variable-empty-line-before': [false, { except: ['after-dollar-variable'] }]
		},
		cases: [
			{
				fixture: 'a {\n $dollar-variable: value;\n}',
				expected: 'a {\n $dollar-variable: value;\n}',
			},
			{
				fixture: 'a {\n $dollar-variable:value; \n\n $dollar-variable2: value;}',
				expected: 'a {\n $dollar-variable:value; \n\n $dollar-variable2: value;}',
			},
			{
				fixture: 'a {\n $dollar-variable:value; \r\n\r\n $dollar-variable2: value;}',
				expected: 'a {\n $dollar-variable:value; \r\n\r\n $dollar-variable2: value;}',
			},
			{
				fixture: 'a {\n $dollar-variable: value;\n $dollar-variable2: value;}',
				expected: 'a {\n $dollar-variable: value;\n\n $dollar-variable2: value;}',
			},
		],
	},
	{
		options: {
			'dollar-variable-empty-line-before': [false, { except: ['first-nested', 'after-comment', 'after-dollar-variable'] }]
		},
		cases: [
			{
				fixture: `a {\n\n $dollar-variable: value; \n\n $dollar-variable2: value; \n /* comment */ \n\n $dollar-variable3: value;\n\n @extends 'x';\n $dollar-variable4: value; \n & b {\n prop: value;\n } \n $dollar-variable5: value; \n }`,
				expected: `a {\n\n $dollar-variable: value; \n\n $dollar-variable2: value; \n /* comment */ \n\n $dollar-variable3: value;\n\n @extends 'x';\n $dollar-variable4: value; \n & b {\n prop: value;\n } \n $dollar-variable5: value; \n }`,
			},
		],
	},
];

testGroups.forEach((group) => {
	const message = group.message || `Should work with ${JSON.stringify(group.options)}`;

	group.cases.forEach((item) => {
		const testFn = (item.only) ? test.only : test;

		testFn(
			message,
			(t) => postcss(plugin(group.options))
				.process(item.fixture)
				.then(({ css }) => {
					t.deepEqual(css, item.expected);
				})
		);
	});
});
