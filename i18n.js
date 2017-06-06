const fs = require('fs');
const path = require('path');

const languages = {};
fs.readdir(path.join(__dirname, 'i18n'), function (e, r) {
	if (e) {
		console.error('Error while reading i18n dir.');
		process.exit(1);
	} else {
		r.forEach(function (file) {
			if (file.indexOf('.json') === -1) {
				return;
			}
			const langcode = file.split('.')[0];
			languages[langcode] = require(path.join(__dirname, 'i18n', file));
		});
	}
});

module.exports = function (langcode) {
	const res = languages[langcode];
	if (!res) {
		throw new Error('No language with code "' + langcode + '" found!');
	}
	return res;
};
