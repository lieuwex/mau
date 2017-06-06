var connections = require('./connections.js');
var Game = require('./game.js');

games = [];
function createGame () {
	var game = new Game();
	games.push(game);
	return game;
}
