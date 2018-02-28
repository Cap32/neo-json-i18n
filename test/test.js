import { execSync } from 'child_process';
import { resolve } from 'path';
import { bin } from '../package.json';

test('🌚 ', () => {
	const binFile = Object.keys(bin)[0];
	const command = resolve(`bin/${binFile}`);
	console.log(execSync(`${command}`, { encoding: 'utf8' }));
});
