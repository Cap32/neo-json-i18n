export default {
	properties: {
		src: {
			type: 'string',
			description: 'Source file',
		},
		output: {
			alias: 'o',
			describe: 'Output directory',
			type: 'string',
		},
		lang: {
			alias: 'l',
			type: 'array',
			describe: 'Languages',
			default: ['en'],
			items: {
				oneOf: [
					{
						type: 'object',
					},
					{
						type: 'string',
						properties: {
							input: {
								type: 'string',
							},
							output: {
								type: 'string',
							},
						},
						required: ['input', 'output'],
					},
				],
			},
		},
		pattern: {
			alias: 'p',
			type: 'string',
			describe: 'Output file name pattern',
			default: '%name_%lang.%ext',
		},
		cwd: {
			alias: 'd',
			type: 'string',
			describe: 'Current working directory',
			default: process.cwd(),
		},
		spaces: {
			alias: 's',
			type: 'string',
			describe: 'JSON format spaces',
			default: '  ',
		},
	},
	required: ['src'],
};
