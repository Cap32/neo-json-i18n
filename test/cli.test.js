import { execSync } from 'child_process';
import { resolve } from 'path';
import { readJson, remove } from 'fs-extra';

describe('cli', function () {
	jest.setTimeout(20000);

	afterEach(async () => {
		await remove(resolve('test/fixtures/dist'));
	});

	test('should cli work', async () => {
		const src = 'src/a.json';
		const bin = resolve('bin/neo-json-i18n');
		const cwd = 'test/fixtures';
		execSync(`${bin} ${src} -l=zh-cn -o=dist -d=${cwd}`);
		const dist = resolve('test/fixtures/dist/a_zh-cn.json');
		expect(await readJson(dist)).toEqual({
			film: '星球大战',
		});
	});

	test('should `--config` work', async () => {
		const src = 'src/a.json';
		const bin = resolve('bin/neo-json-i18n');
		execSync(`${bin} ${src} -c=test/fixtures/src/i18nconfig.json`);
		const dist = resolve('test/fixtures/dist/zh_CN.json');
		expect(await readJson(dist)).toEqual({
			film: '星球大战',
		});
	});
});
