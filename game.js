const cards = require('cards');
const naampje = require('naampje').name;
const utils = require('./utils.js');

const defaultOptions = {
	jokers: 2,
	cardsPerPlayer: (/* player */) => 7,
	title: naampje(),
};

class Game {
	constructor(options) {
		// set default values for options that aren't given.
		for (const key in defaultOptions) {
			if (!options[key]) {
				options[key] = defaultOptions[key];
			}
		}

		this.id = utils.uniqid();
		this.options = options;
		this.deck = new cards.PokerDeck({ jokers: options.jokers });

		// -1 for counter-clockwise, 1 for clockwise.
		this.direction = 1;

		this.players = [];
		this.onTurn = null;

		this._callbacks = {};
	}

	_emit(event, value) {
		const self = this;
		const callbacks = this._callbacks[event];
		if (callbacks) {
			callbacks.forEach(function (func) {
				func.apply(self, value);
			});
		}
	}
	on(event, callback) {
		if (!this._callbacks[event]) {
			this._callbacks[event] = [];
		}
		this._callbacks[event].push(callback);
	}

	cycle() {
		this.onTurn = utils.mod(this.onTurn + this.direction, this.players.length);
	}

	addPlayer(player) {
		player.gameId = this.id;
		this.players.push(player);
		if (!this.admin) {
			this.admin = player;
		}
	}

	removePlayer(player) {
		const index = this.players.indexOf(player);
		player.gameId = null;
		delete this.players[index];

		if (this.players.length === 1) {
			this.destroy();
		} else if (this.admin === player) {
			this.admin = index === 0 ? this.players[1] : this.players[index - 1];
		}
	}

	start() {
		const self = this;
		self.deck.shuffleAll();
		for (const player of self.players) {
			player.hand = [];

			let cardCount = this.options.cardsPerPlayer(player);
			if (isNaN(cardCount)) {
				cardCount = self.deck.deck.length / self.players.length
				cardCount = Math.floor(cardCount);
			}

			for (let i = 0; i < cardCount; i++) {
				player.hand.insert(self.deck.draw());
			}
		}

		// Put the first card on the deck.
		const card = self.deck.drawToDiscard();

		// Get the player who goes first.
		this.onTurn = utils.randomInt(0, self.players.length - 1);

		this._emit('started', {
			onTurn: this.players[this.onTurn].connection.id,
			direction: this.direction,
			card: card,
		});
	}

	destroy() {
		if (this._destroyed) {
			throw new Error('game already destroyed.');
		}

		this.players.forEach(player => self.removePlayer(player));
		this._destroyed = true;
	}
}

module.exports = Game;
