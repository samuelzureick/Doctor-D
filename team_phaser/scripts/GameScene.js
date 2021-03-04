class GameScene extends Phaser.Scene {
    
    constructor() {
        super('GameScene')
    }

    preload() {
        this.cursors
        this.cameras.main.setBackgroundColor(0x9900e3)
        this.load.image('bullet', 'teamAssets/sprites/bullet.png')
        this.load.image('tiles', 'assets/Tilemap/purple.png')
        this.load.tilemapTiledJSON('map', 'scripts/purpleMapdemo.json')

        this.load.atlas('characters', 'teamAssets/sprites/character.png', 'teamAssets/sprites/character.json')
        this.load.image('health', 'teamAssets/UI/Hearts/hearts_hearts_0.png')       // maybe rename health images to something better 
        this.load.image('health-lost', 'teamAssets/UI/Hearts/hearts_hearts_1.png')  // maybe rename health images to something better 
        var frameNames = this.textures.get('characters').getFrameNames()
        
        this.load.atlas('enemy', 'teamAssets/sprites/skeleton.png', 'teamAssets/sprites/skeleton.json')
        this.load.image('star', 'assets/star.png');

        this.player
        this.keys
        this.enemy
        this.enemies
        this.projectiles
        this.keys
        this.lastFiredTime = 0
        this.stars

    } //end preload

    create() {    
        //tilemap
       const map = this.make.tilemap({
            key: 'map'
        })

        const tileset = map.addTilesetImage('purple', 'tiles')
        const belowLayer = map.createStaticLayer('below player', tileset, 0, 0)
        const worldLayer = map.createStaticLayer('world', tileset, 0, 0)
        const aboveLayer = map.createStaticLayer('above player', tileset, 0, 0)

        aboveLayer.setDepth(100)

        worldLayer.setCollisionByProperty({
            collides: true
        })

        this.physics.world.bounds.width = map.widthInPixels
        this.physics.world.bounds.height = map.heightInPixels
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)

        const debugGraphics = this.add.graphics().setAlpha(0.2)
        worldLayer.renderDebug(debugGraphics, {
            tileColor: null,
            collidingTileColor: new Phaser.Display.Color(0, 0, 255),
            faceColor: new Phaser.Display.Color(0, 255, 0, 255)
        })

        ///////////////////////////////
        //player
        this.player = new Player(this, 200, 120, 'characters')

        this.physics.add.collider(this.player, worldLayer)
        this.cameras.main.startFollow(this.player, true, 0.8, 0.8)
        this.player.body.setCollideWorldBounds(true)
        this.enemies = this.add.group()
        this.enemies.maxSize = 5
        for (let i = 0; i < this.enemies.maxSize; i++) {
            const e = new Enemy(this, 220 + 20*i, 250, 'enemy')
            e.body.setCollideWorldBounds(true)
            this.enemies.add(e)
        }
        this.physics.add.collider(this.enemies, worldLayer)

        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 5,
            setXY: {x: 100, y: 200, stepX: 25}
        });
        

        this.keys = this.input.keyboard.addKeys({
            space: 'SPACE',
            plus: 'PLUS',
            minus: 'MINUS'
        })
        this.projectiles = new Projectiles(this)
        
        this.physics.add.collider(this.projectiles, worldLayer, this.handleProjectileWorldCollision, null, this)
        this.physics.add.overlap(this.projectiles, this.enemies, this.handleProjectileEnemyCollision, null, this)
        this.physics.add.overlap(this.player, this.enemies, this.handlePlayerEnemyCollision, null, this)
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);

        // draw player hearts
        this.heart_arr = [];
        
        for (var i=0; i < this.player.health; i++) {
            var heart = this.add.sprite(15 + (27  * i), 15, 'health');
            this.heart_arr.push(heart);
        }

    } //end create

    handleProjectileWorldCollision(p) {
        p.recycle()
        this.projectiles.killAndHide(p)
    }

    handleProjectileEnemyCollision(enemy, projectile) {
        if (projectile.active) {
            enemy.setTint(0xff0000)
            this.time.addEvent({
                delay: 30,
                callback: () => {
                    enemy.explode()
                    projectile.recycle()
                },
                callbackScope: this,
                loop: false
            })
        }
    }

    // function to handle player collision with enemy
    handlePlayerEnemyCollision(player, enemy) {
        this.cameras.main.shake(15, 0.02) // increase to 20 once hitboxes are fixed.
        player.setTint(0xff0000)
        this.time.addEvent({
            delay: 500,
            callback: () => {
                player.clearTint()
            },
            callbackScope: this,
            loop: false
        })
        enemy.explode()

        // decrease health by 1
        this.removeHealth()

    }

    collectStar(player, star) {
        star.disableBody(true, true);

        if (this.stars.countActive(true) === 0) {
            this.stars.children.iterate(function (child) {
                child.enableBody(true, child.x, child.y + 50, true, true);
            });
        }
    }

    removeHealth() {
        this.player.updateHealth(-1)
        console.log(this.player.health)
        this.heart_arr[this.player.health].visible = false
    }

    addHealth() {
        this.player.updateHealth(1)
        this.heart_arr[this.player.health-1].visible = true
    }

    // function to handle game over
    gameOver() {
        console.log("GAME OVER - FINAL HEALTH", this.player.health);
        //this.scene.start('LoseScene')  use this to change to lose scene on game over
    }
 
    update(time, delta) {
        if (this.player.health <= 0) {
            //game is over
            this.gameOver()
        }
        
        if(this.keys.space.isDown){
            if (time > this.lastFiredTime) {
                this.lastFiredTime = time + 500
                this.projectiles.fireProjectile(this.player.x, this.player.y, this.player.facing)
            }
        }

        this.player.update()
        this.enemies.children.iterate((child) => {
            if(!child.isDead) {
                child.update()
                if (!this.enemies.isFull()){
                    const e = new Enemy(this, 220, 250, 'enemy')
                    e.body.setCollideWorldBounds(true)
                    this.enemies.add(e)
                }
            }

        // allows user to increment/decrement health with + and - (test if health function is working correctly - logged to console)
        if (Phaser.Input.Keyboard.JustDown(this.keys.minus)) {
            this.removeHealth()
        } else if (Phaser.Input.Keyboard.JustDown(this.keys.plus)) {
            this.addHealth()
        }

        })
    } //end update


} //end gameScene