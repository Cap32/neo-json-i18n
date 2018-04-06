import translate from 'google-translate-api';
import AggregateError from 'aggregate-error';

export default async function jsonI18n(sourceCode, options = {}) {
	if (typeof sourceCode === 'string') {
		sourceCode = JSON.parse(sourceCode);
	}

	if (typeof sourceCode !== 'object') {
		throw new Error('Missing param `sourceCode`');
	}

	const langs = options.langs || options.lang || ['en'];
	const { onProgress } = options;

	const performTranslate = async function performTranslate(input, lang) {
		const traverse = async function traverse(input) {
			if (Array.isArray(input)) {
				return Promise.all(input.map(traverse));
			}
			else if (
				typeof input === 'object' &&
				!(input instanceof Date) &&
				input !== null
			) {
				const acc = {};
				await Promise.all(
					Object.keys(input).map(async (key) => {
						acc[key] = await traverse(input[key]);
					}),
				);
				return acc;
			}
			else if (typeof input === 'string') {
				const res = await translate(input, { to: lang });
				return res.text;
			}
			else {
				return input;
			}
		};
		return traverse(input);
	};

	const input = sourceCode;
	const res = {};
	const languages = []
		.concat(langs)
		.reduce((acc, lang) => {
			if (typeof lang === 'string') {
				lang = lang.split(',');
			}
			acc.push(...[].concat(lang));
			return acc;
		}, [])
		.filter(Boolean)
		.map((lang) => {
			if (typeof lang === 'string') {
				lang = { input: lang, output: [lang] };
			}
			if (!Array.isArray(lang.output)) {
				lang.output = [lang.output];
			}
			lang.input = lang.input.trim();
			lang.output = lang.output.map((o) => o.trim());
			return lang;
		});
	const total = languages.length;
	const errors = [];

	for (let index = 0; index < total; index++) {
		const lang = languages[index];
		const { input: langInput, output: langOutputs } = lang;
		let output = {};
		let error;
		try {
			output = await performTranslate(input, langInput);
		}
		catch (err) {
			error = err;
			errors.push(err);
		}
		langOutputs.forEach((lang) => {
			res[lang] = output;
		});
		if (typeof onProgress === 'function') {
			await onProgress({ index, output, lang, total, error, langs: languages });
		}
	}

	/* istanbul ignore next */
	if (errors.length) {
		throw new AggregateError(errors);
	}

	return res;
}
