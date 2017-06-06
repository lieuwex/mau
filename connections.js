var net = require('net');
var utils = require('./utils.js');

var connections = [];

/**
 * Wrapper thingy for a Socket.
 * @class Connection
 * @constructor
 * @param socket {Socket}
 */
var Connection = (function () {
	var Connection = function (socket) {
		this.id = utils.uniqid();
		this.socket = socket;
	};

	return Connection;
})();

net.createServer(function (socket) {
	var connection = new Connection(socket);
	connections.push(connection);
}).listen({
	port: 1337,
})

module.exports = {
	/**
	 * @property connections
	 * @type Connection[]
	 */
	connections: connections,
};
