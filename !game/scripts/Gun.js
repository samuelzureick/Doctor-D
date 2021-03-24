class Gun extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'gun')
        this.x = x
        this.y = y
        this.facing = 'left'
        scene.add.existing(this)
        scene.physics.add.existing(this)
    }

    update(time, delta, pointer, scene) {
        // Rotate Gun to face pointer //
        let angle = Phaser.Math.Angle.BetweenPoints(this, pointer)
        this.rotation = angle

        this.y = scene.player.y + 3

        var pi = 3.14159265359
        if (angle * angle < pi / 2) {
            this.reflectImage = true
            this.flipY = this.reflectImage
            this.facing = "right"
            this.x = scene.player.x + 3  
        }

        else if (angle * angle > pi/2 ) {
            this.reflectImage = false
            this.flipY = this.reflectImage
            this.facing = "left"
            this.x = scene.player.x - 3  
        }
    }
}