import translate from 'google-translate-api';
import { resolve, dirname, extname, basename } from 'path';
import { ensureDir, readJson, outputJson } from 'fs-extra';

export default async function translateJsonValues(options = {}) {
	try {
		const { cwd, src, output, pattern, lang: langs } = options;
		const source = resolve(cwd, src);
		const dist = resolve(cwd, output || dirname(source));
		const extWithDot = extname(source);
		const ext = extWithDot.slice(1);
		const originalName = basename(source, extWithDot);

		const sourceJson = await readJson(source);

		const execTranslate = async function execTranslate(json, lang) {
			const traverse = async function traverse(json) {
				if (Array.isArray(json)) {
					return Promise.all(json.map(traverse));
				}
				else if (typeof json === 'object') {
					const acc = {};
					await Promise.all(
						Object.keys(json).map(async (key) => {
							acc[key] = await traverse(json[key]);
						}),
					);
					return acc;
				}
				else if (typeof json === 'string') {
					console.log('json', json);
					return 'hello';

					const { text } = translate(json, { to: lang });
					return text;
				}
				else {
					return json;
				}
			};
			return traverse(json);
		};

		await ensureDir(dist);

		const res = {};

		await Promise.all(
			langs.map(async (lang) => {
				const outputName = pattern
					.replace('$name', originalName)
					.replace('$lang', lang)
					.replace('$ext', ext);
				const outputFile = resolve(dist, outputName);
				const resData = await execTranslate(sourceJson, lang);
				await outputJson(outputFile, resData, { spaces: '\t' });
				res[lang] = resData;
			}),
		);

		console.log('done');
		return res;
	}
	catch (err) {
		console.log('fork?');
		console.error(err);

		// process.exit(1);
	}
}
