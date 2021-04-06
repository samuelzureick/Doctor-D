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

    update(time, delta, pointer, gameOver, paused) {
        if (gameOver || paused) {
            this.setActive(false)
            this.setVisible(false)
        }
        else {
            this.setActive(true)
            this.setVisible(true)
        }
        this.x = pointer.x
        this.y = pointer.y + 2
    }
}