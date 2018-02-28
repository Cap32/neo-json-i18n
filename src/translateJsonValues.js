import translate from 'google-translate-api';
import { resolve, dirname, extname, basename } from 'path';

export default function translateJsonValues(options = {}) {
	const { cwd, src, output, pattern, lang: langs } = options;
	const source = resolve(cwd, src);
	const dist = resolve(cwd, output || dirname(source));
	const extWithDot = extname(source);
	const ext = extWithDot.slice(1);
	const originalName = basename(source, extWithDot);


	langs.map((lang) => {
		const outputName = pattern
			.replace('$name', originalName)
			.replace('$lang', lang)
			.replace('$ext', ext);
		const outputFile = resolve(dist, outputName);
		console.log('outputFile', outputFile);
	});

	console.log('options', source, dist, langs);
}
