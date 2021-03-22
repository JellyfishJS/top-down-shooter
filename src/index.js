const {
    Client,
    isServer,
    game,
    serve
} = require('jellyfish.js');
const { Player } = require('./game-objects/player');
const { GameServer } = require('./game-objects/server');

if (!isServer) {
    (window || {}).game = game;
}

class GameClient extends Client {
    onCreate() {
        this.connect();
    }
    onRegistered() {
        const player = this.createObject(Player);
        player.setOwner(this.user());
    }
}
game.registerClass(GameClient);

if (isServer) {
    game.createObject(GameServer);
} else {
    game.createObject(GameClient);
}

game.setCanvasByID("game");
game.start();
serve();
