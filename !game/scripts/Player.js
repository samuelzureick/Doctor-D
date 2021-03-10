// player class inherits from entity
class Player extends Entity {
    constructor(scene, x, y, textureKey) {
        super(scene, x, y, textureKey, 'Player')

        // initialise player variables // 
        const animFrameRate = 8
        const anims = scene.anims
        var reflectImage = true
        this.health = 5;
        this.maxHealth = 5;
        this.facing = 'right'
        this.score = 0;
        this.coinsCollected = 0;
        this.body.setSize(15, 20, false).setOffset(10, 9);

        // create animations for player //
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
        //this.setFrame(this.idleFrame.down)
        
        // player inputs //
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

    // player update class - ran with every 'tick' of the game.
    update(time, delta) {
        const {keys} = this //output: this.keys
        const speed = 80
        const previousVelocity = this.body.velocity.clone()

        // player movement with keypress //
        this.body.setVelocity(0)
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

        // update player animations // 
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
    } // end player update

    // called when the player's health is updated.
    updateHealth(amount) {
        this.health += amount;
        
        if (this.health > this.maxHealth) {
            this.health = this.maxHealth;
            this.score += 10;
        }
        
        if (this.health <= 0) {
            this.health = 0;
        }

    }

    addCoin() {
        this.coinsCollected += 1;
    }

    getCoin() {
        return this.coinsCollected;
    }

    updateScore(amount) {
        this.score += amount;
    }
}