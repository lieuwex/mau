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
};
