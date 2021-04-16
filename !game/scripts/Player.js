class Player extends Entity {
    constructor(scene, x, y, textureKey) {
        super(scene, x, y, textureKey, 'Player')

        // initialise player variables // 
        const animFrameRate = 8
        const anims = scene.anims
        this.textureKey = textureKey
        var reflectImage = true
        this.health = 5;
        this.maxHealth = 5;
        this.facing = 'right'
        this.score = this.scene.registry.list.score;
        this.coinsCollected = 0;
        this.enemiesEliminated = 0;
        this.body.setSize(10, 10, false).setOffset(15, 20);

        // create animations for player //
        anims.create({
            key: 'move',
            frames: anims.generateFrameNames(this.textureKey, {
                start: 0,
                end: 7,
                zeroPad: 1,
                prefix: 'Player Character/Run/run_run_',
                suffix: '.png'
            }),
            frameRate: animFrameRate,
            repeat: -1
        })
        anims.create({
            key: 'idle',
            frames: anims.generateFrameNames(this.textureKey, {
                start: 0,
                end: 2,
                zeroPad: 1,
                prefix: 'Player Character/Idle/Idle_idle_',
                suffix: '.png'
            }),
            frameRate: 7,
            repeat: -1
        })
        
        // Create Idle Frame //
        this.idleFrame = {
            down: 0,
            left: 0,
            right: 0,
            up: 0
        }
        this.setFrame(this.idleFrame.down)
        
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

    // player update class - ran with every 'tick' of the game //
    update(time, delta, pointer) {
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
        if (keys.up.isDown || keys.w.isDown || 
            keys.down.isDown || keys.s.isDown ||
            keys.left.isDown || keys.a.isDown ||
            keys.right.isDown || keys.d.isDown) {
                this.anims.play('move', true)
            }
        else {
            this.anims.play('idle', true)
        }

        // player face cursor //
        let angle = Phaser.Math.Angle.BetweenPoints(this, pointer)
        var pi = 3.14159265359
        if (angle * angle < pi / 2) {
            this.reflectImage = false
            this.flipX = this.reflectImage
            this.facing = "right"
        }
        else if (angle * angle > pi/2 ) {
            this.reflectImage = true
            this.flipX = this.reflectImage
            this.facing = "left"
        }

        // set idle animations //
        // if (this.body.velocity.x === 0 && this.body.velocity.y === 0) {
        //     //show idle anims
        //     if (previousVelocity.x < 0) {
        //         this.setFrame(this.idleFrame.left)
        //     } else if (previousVelocity.x > 0) {
        //         this.setFrame(this.idleFrame.right)
        //     } else if (previousVelocity.y < 0) {
        //         this.setFrame(this.idleFrame.up)
        //     } else if (previousVelocity.y > 0) {
        //         this.setFrame(this.idleFrame.down)
        //     }
        // }
        
    } // end player update

    // updates the player's score
    updateScore(amount) {
        this.scene.registry.list.score += amount
        this.score = this.scene.registry.list.score;
    }

    // called when the player's health is updated.
    updateHealth(amount) {
        this.health += amount;
        
        if (this.health > this.maxHealth) {
            this.health = this.maxHealth;
            this.updateScore(10);
        }
        
        if (this.health <= 0) {
            this.health = 0;
        }

    }

    // called when a player collides with a coin
    addCoin() {
        this.coinsCollected += 1;
    }

    // returns how many coins the player has collected.
    getCoin() {
        return this.coinsCollected;
    }

    // called when a player eliminates an enemy
    addEnemy() {
        this.enemiesEliminated += 1;
    }

    // returns how many enemies the player has eliminated.
    getEnemy() {
        return this.enemiesEliminated;
    }

}