const {
    Angle,
    GameObject,
    ImageSprite,
    Vector,
    game,
} = require('jellyfish.js');

export class Player extends GameObject {
    onCreate() {
        this.position = Vector.xy(100, 300);
        this.angle = Angle.right;
        this.sprite = this.createSprite(ImageSprite, '/assets/player.png');
        this.sprite.following = this;
    }

    keyReleased(keycode) {
        if (!this.isOwnedByCurrentUser()) return;
        switch (keycode) {
            case 32:
            case 13:
                console.log('Shooting from client');
                let direction;
                switch(this.angle.radians()) {
                    case Angle.right.radians():
                        direction = 'RIGHT';
                        break;
                    case Angle.left.radians():
                        direction = 'LEFT';
                        break;
                    case Angle.down.radians():
                        direction = 'UP';
                        break;
                    case Angle.up.radians():
                        direction = 'DOWN';
                        break;
                }
                this.parent().sendMessage(JSON.stringify({
                    type: 'SHOOT',
                    data: {
                        direction,
                        position: {
                            x: this.position.x(),
                            y: this.position.y(),
                        },
                    },
                }));
        }
    }

    keyHeld(keycode) {
        if (!this.isOwnedByCurrentUser()) return;

        // TODO: if two keys are being held at the same time, do a 45 degree angle

        let movement = Vector.zero;
        switch (keycode) {
            case 40:
            case 83:
                movement = Vector.up;
                this.angle = Angle.up;
                // this.angle = Angle.left;
                break;
            case 38:
            case 87:
                movement = Vector.down;
                this.angle = Angle.down;
                // this.angle = Angle.right;
                break;
            case 37:
            case 65:
                movement = Vector.left;
                this.angle = Angle.left;
                // this.angle = Angle.down;
                break;
            case 39:
            case 68:
                movement = Vector.right;
                // this.angle = Angle.up;
                this.angle = Angle.right;
                break;
        }

        this.position = this.position.plus(movement);
    }
}

game.registerClass(Player);
