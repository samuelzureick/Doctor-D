class Crosshair extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'crosshair')
        this.x = x
        this.y = y
        this.setDepth(10)
        this.setScale(0.5, 0.5)
        scene.add.existing(this)
        scene.physics.add.existing(this)
    }

    update(time, delta, pointer) {
        this.x = pointer.x
        this.y = pointer.y + 2

    }
}