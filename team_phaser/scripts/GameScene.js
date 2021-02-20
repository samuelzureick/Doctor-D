class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene')
    }

    preload() {
        this.cursors
        this.cameras.main.setBackgroundColor(0x9900e3)
        this.load.image('tiles', 'assets/Tilemap/purple.png')
        this.load.tilemapTiledJSON('map', 'scripts/purpleMapdemo.json')


        this.load.atlas("characters", "teamAssets/character.png", "teamAssets/character.json");
        var frameNames = this.textures.get('characters').getFrameNames();
        
        this.player
        this.keys

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
        //this.physics.add.collider(this.player, worldLayer)
        //this.cameras.main.startFollow(this.player, true, 0.8, 0.8)
        //this.player.body.setCollideWorldBounds(true)

    } //end create

 
    update(time, delta) {
        this.player.update()
    } //end update


} //end gameScene