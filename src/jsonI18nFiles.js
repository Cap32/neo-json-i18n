import { resolve, dirname, extname, basename } from 'path';
import { ensureDir, readJson, outputJson } from 'fs-extra';
import Ajv from 'ajv';
import schema from './schema';
import jsonI18n from './jsonI18n';

const ajv = new Ajv({ allErrors: true });
const validate = ajv.compile(schema);

export default async function jsonI18nFiles(options = {}) {
	if (!validate(options)) {
		throw validate.errors;
	}

	const { cwd, src, output, pattern, lang: langs, spaces } = options;
	const source = resolve(cwd, src);
	const dist = resolve(cwd, output || dirname(source));
	const extWithDot = extname(source);
	const ext = extWithDot.slice(1);
	const originalName = basename(source, extWithDot);

	const sourceCode = await readJson(source);
	const res = await jsonI18n(sourceCode, { langs });

	await ensureDir(dist);
	await Promise.all(
		Object.keys(res).map(async (lang) => {
			const outputName = pattern
				.replace('$name', originalName)
				.replace('$lang', lang)
				.replace('$ext', ext);
			const outputFile = resolve(dist, outputName);
			await outputJson(outputFile, res[lang], { spaces });
		}),
	);
	console.log('done');
}
