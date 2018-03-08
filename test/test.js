import jsonI18n from '../src/jsonI18n';

describe('neo json i18n', function () {
	it('test', async () => {
		const input = { text: '星球大战' };
		const output = await jsonI18n(input);
		expect(output).toEqual({ en: { text: 'Star Wars' } });
	});
});
