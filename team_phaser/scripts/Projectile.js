class Bullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'bullet');
        this.x = 200;
        this.y = 200;
    }

    fire(x, y, dir) {
        this.body.reset(x, y);
        this.setActive(true);
        this.setVisible(true);
        this.setVelocityY(-300);
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        if(this.y <= -32) {
            this.setActive(false);
            this.setVisible(false);
        }
    }
}