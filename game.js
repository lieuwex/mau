var cards = require('cards');
var naampje = require('naampje').name;
var utils = require('./utils.js');

var defaultOptions = {
	jokers: 2,
	cardsPerPlayer: 7,
};

module.exports = (function () {
	var Game = function (options) {
		// set default values for options that aren't given.
		for (var key in defaultOptions) {
			if (!options[key]) {
				options[key] = defaultOptions[key];
			}
		}

		this.id = utils.uniqid();
		this.title = options.title || naampje();
		this.options = options;
		this.deck = new cards.PokerDeck({ jokers: options.jokers });

		// -1 for counter-clockwise, 1 for clockwise.
		this.direction = 1;

		this.players = [];
		this.onTurn = null;

		this._callbacks = {};
	};

	Game.prototype._emit = function (event, value) {
		var self = this;
		var callbacks = this._callbacks[event];
		if (callbacks) {
			callbacks.forEach(function (func) {
				func.apply(self, value);
			});
		}
	};
	Game.prototype.on = function (event, callback) {
		if (!this._callbacks[event]) {
			this._callbacks[event] = [];
		}
		this._callbacks[event].push(callback);
	};

	Game.prototype.cycle = function () {
		this.onTurn = utils.mod(this.onTurn + this.direction, this.players.length);
	};

	Game.prototype.addPlayer = function (player) {
		player.gameId = this.id;
		this.players.push(player);
		if (!this.admin) {
			this.admin = player;
		}
	};

	Game.prototype.removePlayer = function (player) {
		var index = this.players.indexOf(player);
		player.gameId = null;
		delete this.players[index];

		if (this.players.length === 1) {
			this.destroy();
		} else if (this.admin === player) {
			this.admin = index === 0 ? this.players[1] : this.players[index - 1];
		}
	};

	Game.prototype.start = function () {
		var self = this;
		self.deck.shuffleAll();
		self.players.forEach(function (player) {
			player.hand = [];
			for (var i = 0; i < options.cardsPerPlayer; i++) {
				player.hand.insert(self.deck.draw());
			}
		});

		// Put the first card on the deck.
		var card = self.deck.drawToDiscard();

		// Get the player who goes first.
		this.onTurn = utils.randomInt(0, self.players.length - 1);

		this._emit('started', {
			onTurn: this.players[this.onTurn].connection.id,
			direction: this.direction,
			card: card,
		});
	};

	Game.prototype.destroy = function () {
		var self = this;
		if (this._destroyed) throw new Error('game already destroyed.');

		this.players.forEach(function (player) {
			self.removePlayer(player);
		});
		this._destroyed = true;
	};

	return Game;
})();
