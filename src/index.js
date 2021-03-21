const {
    GameObject,
    ImageSprite,
    Vector,
    Server,
    Client,
    isServer,
    game,
    serve
} = require('jellyfish.js');

class Player extends GameObject {
    onCreate() {
        this.position = Vector.xy(100, 300);
        this.sprite = this.createSprite(ImageSprite, '/assets/player.png');
        this.sprite.following = this;
    }

    keyHeld(keycode) {
        if (!this.isOwnedByCurrentUser()) { return; }

        let movement = Vector.zero;
        switch (keycode) {
            case 40: movement = Vector.up; break;
            case 38: movement = Vector.down; break;
            case 37: movement = Vector.left; break;
            case 39: movement = Vector.right; break;
        }

        this.position = this.position.plus(movement);
    }
}
game.registerClass(Player);

class GameServer extends Server {
    onCreate() { this.start(); }
}
game.registerClass(GameServer);

class GameClient extends Client {
    onCreate() { this.connect(); }
    onRegistered() {
        const player = this.createObject(Player);
        player.setOwner(this.user());
    }
}
game.registerClass(GameClient);

if (isServer) { game.createObject(GameServer); }
else { game.createObject(GameClient); }

game.setCanvasByID("game");
game.start();
serve();
