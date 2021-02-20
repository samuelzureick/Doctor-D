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
        var frameNames = this.textures.get('characters').getFrameNames()
        this.load.image('bullet', 'assets/bullet.png')
        this.load.atlas('enemy', 'teamAssets/sprites/skeleton.png', 'teamAssets/sprites/skeleton.json')

        this.player
        this.keys
        this.enemy
        this.projectiles
        this.keys
        this.lastFiredTime = 0

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
     //   this.physics.add.collider(this.player, worldLayer)
        this.cameras.main.startFollow(this.player, true, 0.8, 0.8)
    //    this.player.body.setCollideWorldBounds(true)

        this.enemy = new Enemy(this, 250, 200, 'enemy')
        this.physics.add.collider(this.enemy, worldLayer)


        this.keys = this.input.keyboard.addKeys({
            space: 'SPACE'
        })
        this.projectiles = new Projectiles(this)
        this.physics.add.collider(this.projectiles, worldLayer, this.handleProjectileWorldCollision, null, this)
        this.physics.add.overlap(this.projectiles, this.enemy, this.handleProjectileEnemyCollision, null, this)
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
 
    update(time, delta) {
        if(this.keys.space.isDown){
            if (time > this.lastFiredTime) {
                this.lastFiredTime = time + 500
                this.projectiles.fireProjectile(this.player.x, this.player.y, this.player.facing)
            }
        }
        this.player.update()
        this.enemy.update()
    } //end update


} //end gameScene