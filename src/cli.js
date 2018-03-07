import yargs from 'yargs';
import { name, version } from '../package.json';
import translateJsonValues from './translateJsonValues';

const { argv } = yargs
	.usage('$0 <src>', 'Translate JSON values', (yargs) => {
		yargs.positional('src', {
			describe: 'Source file',
			type: 'string',
		});
	})
	.options({
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
		},
		pattern: {
			alias: 'p',
			type: 'string',
			describe: 'Output file name pattern',
			default: '$name_$lang.$ext',
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
	})
	.demandCommand(1, '<src> is required')
	.help()
	.version(version);

translateJsonValues(argv);
