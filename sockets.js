var net = require('net');
var utils = require('./utils.js');

var connections = [];

var Connection = (function () {
	var Connection = function (socket) {
		this.id = utils.uniqid();
		this.socket = socket;
	};

	return Connection;
})();

var server = net.createServer(function (socket) {
	var connection = new Connection(socket);
	connections.push(connection);
	socket.pipe(socket);
});

server.listen({
	port: 1337,
});

module.exports = {

};
