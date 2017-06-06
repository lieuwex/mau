const PORT = 1337;

const net = require('net');
const utils = require('./utils.js');

const connections = [];

class Connection {
	/**
	 * @param socket {Socket}
	 */
	constructor(socket) {
		this.id = utils.uniqid();
		this.socket = socket;
	}
}

net.createServer(socket => {
	const connection = new Connection(socket);
	connections.push(connection);
}).listen({
	port: PORT,
}, () => console.log(`listening on port ${PORT}`));

module.exports = {
	/**
	 * @property connections
	 * @type Connection[]
	 */
	connections,
};
