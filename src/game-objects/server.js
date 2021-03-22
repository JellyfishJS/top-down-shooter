const {
    Angle,
    Vector,
    game,
    Server,
} = require('jellyfish.js');
const { Enemy } = require('./enemy');
const { getRandomNumber } = require('../utils/random');

export class GameServer extends Server {
    constructor() {
        super();
        this.enemies = [];
    }

    onCreate() {
        this.game().getWorld().gravity = {
            x: 0,
            y: 0,
            scale: 0,
        };
        this.generateEnemies(30);
        this.start();
    }

    removeEnemy(enemyToRemove) {
        enemyToRemove.hide();
        this.enemies = this.enemies.filter(enemy => enemy.id() !== enemyToRemove.id());
    }

    // TODO: create a projectile and give it a force, which can then be detected with collision between enemy/projectile
    onMessage(user, message) {
        const { type, data } = JSON.parse(message);
        switch (type) {
            case 'SHOOT': {
                const { direction, position } = data;
                
                if (direction === 'RIGHT' || direction === 'LEFT') {
                    const enemiesInPath = this.enemies.filter(enemy => {
                        const x = enemy.position.x();
                        const y = enemy.position.y();
                        const radius = enemy.radius;
                        const alignedY = (y - radius) <= position.y && position.y <= (y + radius);
                        const alignedX = direction === 'RIGHT' ? x > position.x : x < position.x;
                        return alignedY && alignedX;
                    });
                    if (!enemiesInPath.length) return;

                    // find enemy closest to player
                    let closestEnemy = enemiesInPath[0];
                    enemiesInPath.forEach(enemy => {
                        if (direction === 'RIGHT' && closestEnemy.position.x() > enemy.position.x()) {
                            closestEnemy = enemy;
                        } else if (direction === 'LEFT' && closestEnemy.position.x() < enemy.position.x()) {
                            closestEnemy = enemy;
                        }
                    });

                    this.removeEnemy(closestEnemy);
                } else if (direction === 'UP' || direction === 'DOWN') { // add to y direction
                    const enemiesInPath = this.enemies.filter(enemy => {
                        const x = enemy.position.x();
                        const y = enemy.position.y();
                        const radius = enemy.radius;
                        const alignedX = (x - radius) <= position.x && position.x <= (x + radius);
                        const alignedY = direction === 'DOWN' ? y > position.y : y < position.y;
                        return alignedY && alignedX;
                    });
                    if (!enemiesInPath.length) return;

                    // find enemy closest to player
                    let closestEnemy = enemiesInPath[0];
                    enemiesInPath.forEach(enemy => {
                        if (direction === 'UP' && closestEnemy.position.y() > enemy.position.y()) {
                            closestEnemy = enemy;
                        } else if (direction === 'DOWN' && closestEnemy.position.y() < enemy.position.y()) {
                            closestEnemy = enemy;
                        }
                    });
                    
                    this.removeEnemy(closestEnemy);
                }
            }
        }
    }

    generateEnemies(amount) {
        // TODO: probably put all of these enemies above some line and spawn the player below the line + stop them from moving above the line
        for (let i = 0; i < amount; i++) {
            const enemy = this.createObject(
                Enemy,
                Vector.xy(
                    getRandomNumber(0, 800),
                    getRandomNumber(0, 600),
                ),
            );
            this.enemies.push(enemy);
        }
    }
}
game.registerClass(GameServer);
