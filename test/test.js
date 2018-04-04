import jsonI18n from '../src/jsonI18n';

describe('neo json i18n', function () {
	it('should throw error if missing param `input`', async () => {
		expect(jsonI18n()).rejects.toThrow();
	});

	it('should object work', async () => {
		const input = { text: '星球大战' };
		const output = await jsonI18n(input);
		expect(output).toEqual({ en: { text: 'Star Wars' } });
	});

	it('should string work', async () => {
		const input = '{ "text": "星球大战" }';
		const output = await jsonI18n(input);
		expect(output).toEqual({ en: { text: 'Star Wars' } });
	});

	it('should array work', async () => {
		const input = ['星球大战'];
		const output = await jsonI18n(input);
		expect(output).toEqual({ en: ['Star Wars'] });
	});

	it('should multi languages work', async () => {
		const input = '{ "text": "星球大战" }';
		const output = await jsonI18n(input, {
			langs: ['en', 'ja'],
		});
		expect(output).toEqual({
			en: { text: 'Star Wars' },
			ja: { text: 'スターウォーズ' },
		});
	});

	it('should multi languages via comma work', async () => {
		const input = '{ "text": "星球大战" }';
		const output = await jsonI18n(input, { lang: 'en, ja' });
		expect(output).toEqual({
			en: { text: 'Star Wars' },
			ja: { text: 'スターウォーズ' },
		});
	});

	it('should languages object work', async () => {
		const input = '{ "text": "Star Wars" }';
		const output = await jsonI18n(input, {
			lang: [
				{ input: 'zh-cn', output: 'zh_CN' },
				{ input: 'es', output: 'es_ES' },
			],
		});
		expect(output).toEqual({
			zh_CN: { text: '星球大战' },
			es_ES: { text: 'Guerra de las Galaxias' },
		});
	});

	it('should not translate date object', async () => {
		const now = new Date();
		const input = { now };
		const output = await jsonI18n(input);
		expect(output).toEqual({ en: { now } });
	});

	it('should not translate null', async () => {
		const nullObject = null;
		const input = { nullObject };
		const output = await jsonI18n(input);
		expect(output).toEqual({ en: { nullObject } });
	});

	it('should throw error if lang is not supported', async () => {
		const input = '{ "text": "星球大战" }';
		expect(jsonI18n(input, { lang: 'unknown' })).rejects.toThrowError('Error');
	});

	it('should onProgress work', async () => {
		const input = '{ "text": "星球大战" }';
		const onProgress = jest.fn();
		await jsonI18n(input, { langs: ['en', 'ja'], onProgress });
		expect(onProgress).toHaveBeenCalledTimes(2);
	});
});
