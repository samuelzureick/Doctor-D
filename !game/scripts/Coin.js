class Coin extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture)

        // Initialise variables
        this.scene = scene
        this.scene.add.existing(this)

        // Create idle anim
        this.scene.anims.create({
            key: 'coin-idle',
            frames: [
                {key: 'coin0'},
                {key: 'coin1'},
                {key: 'coin2'},
                {key: 'coin3'},
                {key: 'coin4'},
                {key: 'coin5'},
                {key: 'coin6'},
                {key: 'coin7'},
                {key: 'coin8'}
            ],
            frameRate: 17,
            repeat: -1
        })
    }

    update() {
        this.anims.play('coin-idle', true)
    }
}