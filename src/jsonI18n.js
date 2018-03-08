import translate from 'google-translate-api';

export default async function jsonI18n(sourceCode, options = {}) {
	if (typeof sourceCode === 'string') {
		sourceCode = JSON.parse(sourceCode);
	}

	if (typeof sourceCode !== 'object') {
		throw new Error('Missing param `sourceCode`');
	}

	const langs = options.langs || options.lang || ['en'];

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
	const languages = [].concat(langs).reduce((acc, lang) => {
		acc.push(...lang.split(','));
		return acc;
	}, []);
	await Promise.all(
		languages.map(async (lang) => {
			lang = lang.trim();
			res[lang] = await performTranslate(input, lang);
		}),
	);
	return res;
}
