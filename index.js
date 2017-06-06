const connections = require('./connections.js');
const Game = require('./game.js');

const games = [];
function createGame () {
	const game = new Game();
	games.push(game);
	return game;
}
