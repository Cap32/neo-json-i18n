module.exports = {
	cwd: 'test/fixtures',
	output: 'dist',
	lang: [{ input: 'zh-cn', output: 'zh_CN' }],
	pattern: '%lang.%ext',
	transformOutput(output, options) {
		console.log('transformOutput', output, options);
		return output;
	}
};
