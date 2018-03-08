import yargs from 'yargs';
import { version, description } from '../package.json';
import jsonI18nFiles from './jsonI18nFiles';
import schema from './schema';

const { src, ...options } = schema.properties;
const { argv } = yargs
	.usage('$0 <src> [options]', description, (yargs) => {
		yargs.positional('src', src);
	})
	.options(options)
	.demandCommand(1, '<src> is required')
	.help()
	.wrap(70)
	.version(version);

jsonI18nFiles(argv);
