import translateJsonValues from '../src/translateJsonValues';

describe('translate json values', function () {
	it('test', async () => {

		// console.log('done');

		console.log(
			'typeof translateJsonValues',
			await translateJsonValues({
				src: 'fixtures/index.json',
				cwd: __dirname,
				lang: ['en'],
				pattern: '$name_$lang.$ext',
			}),
		);

		// const res = await translateJsonValues({ src: 'fixtures/index.json' });
		// console.log('res', res);

		// const binFile = Object.keys(bin)[0];
		// const command = resolve(`bin/${binFile}`);
		// console.log(execSync(`${command}`, { encoding: 'utf8' }));
	});
});
