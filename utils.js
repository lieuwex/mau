/**
 * Generates an unique id.
 * @method uniqid
 * @return {Number}
 */
const uniqid = (function () {
	let index = 0;
	return function () {
		return index++;
	};
})();

module.exports = {
	uniqid,
	randomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	},
	mod(a, b) {
		return (a % b + b) % b;
	},
};
