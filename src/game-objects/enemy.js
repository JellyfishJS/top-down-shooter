const { Body, game, GameObject, Sprite, Vector } = require('jellyfish.js');
const { Bodies } = require('matter-js');

class EnemySprite extends Sprite {
    initializeSprite(pixi, container) {
        const sprite = new pixi.Graphics();
        container.addChild(sprite);
        return sprite;
    }

    draw(pixi, sprite) {
        sprite.clear();
        sprite.beginFill(0xFF0000);
        sprite.drawCircle(this.position.x(), this.position.y(), 10);
    }
}
game.registerClass(EnemySprite);

export class Enemy extends GameObject {
    constructor(position) {
        super();
        this.position = position;
        this.radius = 10;
    }

    onCreate() {
        this.sprite = this.createSprite(EnemySprite);
        this.body = this.createBody(EnemyBody, this.position, this.radius);
        this.sprite.following = this.body;
        this.sprite.position = this.position;
    }

    hide() {
        // TODO: temporary while we don't have a way to delete
        this.position = Vector.xy(-50, -50);
        this.sprite.position = Vector.xy(-50, -50);
    }
}
game.registerClass(Enemy);

class EnemyBody extends Body {
    constructor(position, radius) {
        super();
        this.position = position;
        this.radius = radius;
    }

    initializeBody() {
        return Bodies.circle(
            this.position.x(),
            this.position.y(),
            this.radius,
            {
                // TODO: give it some initial movement
            },
        );
    }

}
game.registerClass(EnemyBody);
