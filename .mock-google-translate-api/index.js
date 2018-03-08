/* Mocking google translate api server */

const request = require('request');
const { stringify } = require('querystring');

const mockingServerURL = 'https://MOCKING_SERVER.com';

module.exports = function googleTranslateApi(q, options = {}) {
	const { from: langFrom, to: langTo = 'en' } = options;
	return new Promise((resolve, reject) => {
		const query = { q, to: langTo };
		if (langFrom) {
			query.from = langFrom;
		}
		const uri = `${mockingServerURL}?${stringify(query)}`;
		request(uri, (err, res, body) => {
			if (err) {
				reject(err);
			}
			else if (res.statusCode !== 200) {
				reject(new Error(body.reason));
			}
			else {
				resolve(JSON.parse(body));
			}
		});
	});
};
