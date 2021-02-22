class Player extends Entity {
    constructor(scene, x, y, textureKey) {
        super(scene, x, y, textureKey, 'Player')

        const animFrameRate = 8
        const anims = scene.anims
        var reflectImage = true
        this.facing = 'right'

        anims.create({
            key: 'move',
            frames: anims.generateFrameNames(this.textureKey, {
                start: 0,
                end: 7,
                zeroPad: 1,
                prefix: 'run_run_',
                suffix: '.png'
            }),
            frameRate: animFrameRate,
            repeat: -1
        })
        this.idleFrame = {
            down: 49,
            left: 61,
            right: 73,
            up: 85
        }
        this.setFrame(this.idleFrame.down)
        
        // inputs
        // this.cursors = this.input.keyboard.createCursorKeys()
        const {LEFT,RIGHT,UP,DOWN,W,A,S,D} = Phaser.Input.Keyboard.KeyCodes
        this.keys = scene.input.keyboard.addKeys({
            left: LEFT,
            right: RIGHT,
            up: UP,
            down: DOWN,
            w: W,
            a: A,
            s: S,
            d: D
        })
    } //end constructor


    update(time, delta) {
        const {keys} = this //output: this.keys
        const speed = 80
        const previousVelocity = this.body.velocity.clone()

        this.body.setVelocity(0)
        //movement
        if (keys.left.isDown || keys.a.isDown) {
            this.body.setVelocityX(-speed)
        } else if (keys.right.isDown || keys.d.isDown) {
            this.body.setVelocityX(speed)
        }

        if (keys.up.isDown || keys.w.isDown) {
            this.body.setVelocityY(-speed)
        } else if (keys.down.isDown || keys.s.isDown) {
            this.body.setVelocityY(speed)
        }

        this.body.velocity.normalize().scale(speed)

        //animations
        if (keys.up.isDown || keys.w.isDown) {
            this.flipX = this.reflectImage
            this.anims.play('move', true)
        } else if (keys.down.isDown || keys.s.isDown) {
            this.flipX = this.reflectImage
            this.anims.play('move', true)
        } else if (keys.left.isDown || keys.a.isDown) {
            this.reflectImage = true
            this.flipX = this.reflectImage
            this.anims.play('move', true)
            this.facing = "left"
        } else if (keys.right.isDown || keys.d.isDown) {
            this.reflectImage = false
            this.flipX = this.reflectImage
            this.anims.play('move', true)
            this.facing = "right"
        } else {
            this.anims.stop()
        }
 

        /*set idle animations
        if (this.body.velocity.x === 0 && this.body.velocity.y === 0) {
            //show idle anims
            if (previousVelocity.x < 0) {
                this.setFrame(this.idleFrame.left)
            } else if (previousVelocity.x > 0) {
                this.setFrame(this.idleFrame.right)
            } else if (previousVelocity.y < 0) {
                this.setFrame(this.idleFrame.up)
            } else if (previousVelocity.y > 0) {
                this.setFrame(this.idleFrame.down)
            }
        }
        */
    }
}