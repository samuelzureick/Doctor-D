// parent 'entity' class for player and enemies to inherit from
class Entity extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, textureKey, type) {
        super(scene, x, y, textureKey)

        // initialise entity variables //
        this.scene = scene
        this.textureKey = textureKey
        this.scene.add.existing(this)
        this.scene.physics.world.enableBody(this, 0)
        this.type = type
        this.isDead = false
        ////////////////////////////////
    } // end entity constructor

    // if enemy is dead:
    explode() {
        if (!this.isDead) {
            this.isDead = true
            this.destroy()
        }
    }
}