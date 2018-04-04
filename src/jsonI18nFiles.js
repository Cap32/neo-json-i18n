import { resolve, dirname, extname, basename } from 'path';
import { ensureDir, exists, readJson, outputJson } from 'fs-extra';
import Ajv from 'ajv';
import schema from './schema';
import jsonI18n from './jsonI18n';
import ms from 'ms';
import chalk from 'chalk';

const ajv = new Ajv({ allErrors: true });
const validate = ajv.compile(schema);

export default async function jsonI18nFiles(options = {}) {
	const t0 = Date.now();
	const getSpend = () => ms(Date.now() - t0);
	let errors = 0;
	try {
		const { config: configFile } = options;
		const configObj = configFile ? await readJson(configFile) : {};
		const config = { ...options, ...configObj };

		if (!validate(config)) {
			const { message } = validate.errors[0];
			throw new Error(message);
		}

		const { cwd, src, output, pattern, lang: langs, spaces } = config;
		const source = resolve(cwd, src);

		const isSourceExists = await exists(source);
		if (!isSourceExists) {
			throw new Error(`src ${src} NOT found ${JSON.stringify(configObj)}`);
		}
		const dist = resolve(cwd, output || dirname(source));
		const extWithDot = extname(source);
		const ext = extWithDot.slice(1);
		const originalName = basename(source, extWithDot);

		const sourceCode = await readJson(source);
		await ensureDir(dist);

		await jsonI18n(sourceCode, {
			langs,
			async onProgress({ index, total, lang, output, error }) {
				const indicator = chalk.gray(`[${index + 1}/${total}]`);
				if (error) {
					errors++;
					console.error(indicator, chalk.red(error.message));
				}
				else {
					const outputName = pattern
						.replace('%name', originalName)
						.replace('%lang', lang.output)
						.replace('%ext', ext);
					const outputFile = resolve(dist, outputName);
					await outputJson(outputFile, output, { spaces });
					console.log(
						indicator,
						chalk.yellow(outputFile),
						chalk.gray('created'),
					);
				}
			},
		});
		console.log(chalk.green(`Done in ${getSpend()}`));
	}
	catch (err) {
		if (errors) {
			const errorWord = `error${errors > 1 ? 's' : ''}`;
			console.error(
				chalk.red(
					`Done in ${getSpend()} with ${errors} ${errorWord} occurred.`,
				),
			);
		}
		else {
			console.error(err.message);
		}
		process.exit(1);
	}
}
