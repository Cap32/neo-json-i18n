import { resolve, dirname, extname, basename } from 'path';
import { ensureDir, exists, readJson, writeFile } from 'fs-extra';
import Ajv from 'ajv';
import schema, { DEFAULT_CONFIG_FILE } from './schema';
import jsonI18n from './jsonI18n';
import ms from 'ms';
import chalk from 'chalk';
import importFile from 'import-file';

const ajv = new Ajv({ allErrors: true });
const validate = ajv.compile(schema);

export default async function jsonI18nFiles(options = {}) {
	const t0 = Date.now();
	const getSpend = () => ms(Date.now() - t0);
	let errors = 0;
	try {
		const { config: configFile } = options;
		let configObj = {};
		const importOptions = {
			cwd: options.cwd || process.cwd(),
		};
		if (configFile === undefined) {
			try {
				configObj = await importFile(DEFAULT_CONFIG_FILE, importOptions);
			}
			catch (err) {}
		}
		else if (configFile) {
			configObj = await importFile(configFile, importOptions);
		}
		const config = { ...options, ...configObj };

		if (!validate(config)) {

			// TODO: should improve error message
			const { message } = validate.errors[0];
			throw new Error(message);
		}

		const {
			cwd,
			src,
			output,
			pattern,
			lang: langs,
			spaces,
			transformOutput,
		} = config;
		const source = resolve(cwd, src);

		const isSourceExists = await exists(source);
		if (!isSourceExists) {
			throw new Error(`src ${src} NOT found`);
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
					await Promise.all(lang.output.map(async (langOutput) => {
						const outputName = pattern
							.replace('%name', originalName)
							.replace('%lang', langOutput)
							.replace('%ext', ext);
						const outputFile = resolve(dist, outputName);
						let finalOutput = output;
						if (typeof transformOutput === 'function') {
							finalOutput = await transformOutput(output, {
								originalName,
								ext,
								langOutput,
								lang,
								dist,
								src,
								cwd,
							});
						}
						try {
							finalOutput = JSON.stringify(output, null, spaces);
						}
						catch (err) {}
						await writeFile(outputFile, finalOutput, 'utf8');
						console.log(
							indicator,
							chalk.yellow(outputFile),
							chalk.gray('created'),
						);
					}));
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
