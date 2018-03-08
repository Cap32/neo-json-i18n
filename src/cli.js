import yargs from 'yargs';
import { version } from '../package.json';
import jsonI18nFiles from './jsonI18nFiles';
import schema from './schema';

const { src, ...options } = schema.properties;
const { argv } = yargs
	.usage('$0 <src>', 'Translate JSON values', (yargs) => {
		yargs.positional('src', src);
	})
	.options(options)
	.demandCommand(1, '<src> is required')
	.help()
	.version(version);

jsonI18nFiles(argv);
