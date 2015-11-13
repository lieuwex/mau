var fs = require('fs');

var languages = {};
fs.readdir(__dirname + 'i18n', function (e, r) {
	if (e) {
		console.error('Error while reading i18n dir.');
		process.exit(1);
	} else {
		r.forEach(function (file) {
			if (file.indexOf('.json') === -1) return;
			var langcode = file.split('.')[0];
			languages[langcode] = require(__dirname + '/i18n/' + file);
		});
	}
});

module.exports = function (langcode) {
	var res = languages[langcode];
	if (!res) {
		throw new Error('No language with code "' + langcode + '" found!');
	}
	return res;
};
