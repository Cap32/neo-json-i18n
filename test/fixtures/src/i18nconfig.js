module.exports = {
	cwd: 'test/fixtures',
	output: 'dist',
	lang: [{ input: 'zh-cn', output: 'zh_CN' }],
	pattern: '%lang.%ext',
	transformOutput(output, options) {
		const res = {
			lang: options.langOutput,
			data: output,
		};
		return res;
	},
};
