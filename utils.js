/**
 * Generates an unique id.
 * @method uniqid
 * @return {Number}
 */
var uniqid = (function () {
	var index = 0;
	return function () {
		return index++;
	};
})();

module.exports = {
	uniqid: uniqid,
	randomInt: function (min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	},
	mod: function (a, b) {
		return (a % b + b) % b;
	},
};
