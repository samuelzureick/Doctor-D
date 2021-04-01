class GameScene extends Phaser.Scene {
    
    countdown
    constructor() {
        super('GameScene')
    }

    preload() {
        this.cursors
        this.cameras.main.setBackgroundColor(0x9900e3)

        //load sprite images//
        this.load.image('gun', 'teamAssets/PlayerCharacter/Gun/Main Gun/main gun_Gun_0.png')
        this.load.image('bullet', 'teamAssets/PlayerCharacter/Gun/Main Gun/shell_shotgun shell_0.png')
        this.load.image('crosshair', 'teamAssets/PlayerCharacter/Gun/Crosshair/crosshair_Crosshair_0_2x.png')
        this.load.image('tiles', 'assets/Tilemap/16 x 16 codename iso game.png')
        this.load.tilemapTiledJSON('room0', 'scripts/room0.json')
        this.load.tilemapTiledJSON('room1', 'scripts/room1.json')
        this.load.atlas('characters', 'teamAssets/sprites/character.png', 'teamAssets/sprites/character.json')
        this.load.image('health', 'teamAssets/UI/Hearts/hearts_hearts_0.png')       // maybe rename health images to something better 
        this.load.image('health-lost', 'teamAssets/UI/Hearts/hearts_hearts_1.png')  // maybe rename health images to something better 
        var frameNames = this.textures.get('characters').getFrameNames()
        this.load.atlas('enemy', 'assets/sprites/blob.png', 'assets/sprites/blob.json')
        this.load.image('star', 'assets/star.png');
        this.load.image('crateButton', 'teamAssets/Update 1.4/Destructible Items/Crate/crate_Destroy Crate_00.png')

        this.load.image('coin0', 'teamAssets/Tilemap/Coin/Spin/Pick Up_spin_0.png')
        this.load.image('coin1', 'teamAssets/Tilemap/Coin/Spin/Pick Up_spin_1.png')
        this.load.image('coin2', 'teamAssets/Tilemap/Coin/Spin/Pick Up_spin_2.png')
        this.load.image('coin3', 'teamAssets/Tilemap/Coin/Spin/Pick Up_spin_3.png')
        this.load.image('coin4', 'teamAssets/Tilemap/Coin/Spin/Pick Up_spin_4.png')
        this.load.image('coin5', 'teamAssets/Tilemap/Coin/Spin/Pick Up_spin_5.png')
        this.load.image('coin6', 'teamAssets/Tilemap/Coin/Spin/Pick Up_spin_6.png')
        this.load.image('coin7', 'teamAssets/Tilemap/Coin/Spin/Pick Up_spin_7.png')
        this.load.image('coin8', 'teamAssets/Tilemap/Coin/Spin/Pick Up_spin_8.png')


        //////////////////////////////////////////////////////////////////////////

        // initialise class variables //
        this.player
        this.keys
        this.enemy
        this.enemies
        this.gun
        this.crosshair
        this.projectiles
        this.lastFiredTime = 0
        this.reloadStatus = false
        this.stars
        this.health_pickups
        this.scoreText
        this.ammoText
        this.toggleObjectives
        this.togglePause
        this.timerLabel
        this.isPause
        this.isObjective

    } // end preload

    create(data) {
        console.log(data)
        if (Object.getOwnPropertyNames(data).length > 0) {
            this.map = this.make.tilemap({
                key: data
            })
            this.registry.list.load = this.registry.list.load ^ 1
        } else {
            // create tilemap //
            this.registry.set('load', 0)
            this.map = this.make.tilemap({
                key: 'room0'
            })

        }

        // setting up tilemap, layers and collisions //
        const tileset = this.map.addTilesetImage('tileset', 'tiles')
        const belowLayer = this.map.createStaticLayer('below player', tileset, 0, 0)
        const worldLayer = this.map.createStaticLayer('world', tileset, 0, 0)
        console.log(this.registry.list.load)

        worldLayer.setCollisionByProperty({
            collides: true
        })

        this.physics.world.bounds.width = this.map.widthInPixels
        this.physics.world.bounds.height = this.map.heightInPixels
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels)   

        // for timer //
        this.timerLabel = this.add.text(340, 137, '45').setOrigin(0.5);
        this.timerLabel.setDepth(101);
        this.countdown = new CountdownController(this, this.timerLabel);
        this.countdown.start(this.handleCountdownFinished.bind(this)); 
        this.timerLabel.setVisible(false)

        // const debugGraphics = this.add.graphics().setAlpha(0.2)
        // worldLayer.renderDebug(debugGraphics, {
        //     tileColor: null,
        //     collidingTileColor: new Phaser.Display.Color(0, 0, 255),
        //     faceColor: new Phaser.Display.Color(0, 255, 0, 255)
        // })
        
        // initialise player + collisions //
        this.player = new Player(this, 200, 120, 'characters')
        this.physics.add.collider(this.player, worldLayer, this.testForDoor, null, this)
        this.cameras.main.startFollow(this.player, true, 0.8, 0.8)
        this.player.body.setCollideWorldBounds(true)

        // initialise gun //
        this.gun = new Gun(this, 200, 120, 6, 'gun')
        // initialise crosshair //
        this.crosshair = new Crosshair(this, 200, 120, 'crosshair')

        // initialise enemies + add collisions //
        this.enemies = this.add.group()
        this.enemies.maxSize = 5
        for (let i = 0; i < this.enemies.maxSize; i++) {
            const e = new Enemy(this, 220 + 20*i, 250, 'enemy')
            e.body.setCollideWorldBounds(true)
            this.enemies.add(e)
        }
        this.physics.add.collider(this.enemies, worldLayer)

        // Create Score Text //
        this.scoreText = this.add.text(310, 6, 'Score: 0')
        this.scoreText.setFontSize('15px')
        this.scoreText.setColor('#FFFFFF')
        this.scoreText.setBackgroundColor('#000000')

        // Create Ammo Text //
        this.ammoText = this.add.text(315, 286, 'Ammo: ' + this.gun.ammo)
        this.ammoText.setFontSize('15px')
        this.ammoText.setColor('#FFFFFF')
        this.ammoText.setBackgroundColor('#000000')

        // Reload Text //
        this.reloadText = this.add.text(275, 286, 'Reloading', { fontFamily: 'Oswald, sans-serif'})
        this.reloadText.setFontSize('7px')
        this.reloadText.setColor('#d40000')
        this.reloadText.setVisible(false)

        ///// Collectible Items /////
        // Coins //
        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 5,
            setXY: {x: 100, y: 200, stepX: 25}
        });
        // Health Packs //
        this.health_pickups = this.physics.add.group({
            key: 'health',
            setScale: {x: 0.75, y: 0.75},
            repeat: 2,
            setXY: {x: Phaser.Math.Between(0, 400), y: Phaser.Math.Between(0, 320)}
        })

        // Initialise Objectives and Pause Screen //
        this.createObjectivesScreen();
        this.createPauseScreen();

        // Draw Objective Button //
        this.add.image(15, 40, 'crateButton').setInteractive();
        this.input.on('gameobjectup', this.clickObjective, this);

        // Add keys for inputs + projectiles //
        const {Q} = Phaser.Input.Keyboard.KeyCodes
        const {R} = Phaser.Input.Keyboard.KeyCodes
        this.keys = this.input.keyboard.addKeys({
            space: 'SPACE',
            plus: 'PLUS',
            minus: 'MINUS',
            esc: 'ESC',
            q: Q,
            r: R
        })
        this.projectiles = new Projectiles(this)

        // Create collision methods //
        this.physics.add.collider(this.projectiles, worldLayer, this.handleProjectileWorldCollision, null, this)
        this.physics.add.collider(this.enemies)
        this.physics.add.overlap(this.projectiles, this.enemies, this.handleProjectileEnemyCollision, null, this)
        this.physics.add.overlap(this.player, this.enemies, this.handlePlayerEnemyCollision, null, this)
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this)
        this.physics.add.overlap(this.player, this.health_pickups, this.collectHealth, null, this)

        // Draw Player Hearts //
        this.heart_arr = [];
        
        for (var i=0; i < this.player.health; i++) {
            var heart = this.add.sprite(15 + (27  * i), 15, 'health');
            this.heart_arr.push(heart);
        }

        console.log(this.cameras.main)

    } //end create

    testForDoor(player, world) {
        //get properties of world collision
        let data = world.properties
        if (data.door) {
            this.scene.restart('room' + (this.registry.list.load ^ 1))
        }
    }
    
    handleCountdownFinished()
    {
        this.player.active = false
    }

    // Func for delayed reload // 
    reloadFunc() {
        this.gun.reload();
        this.reloadText.setVisible(false);
        this.reloadStatus = false
    }

    // Projectile-Map Collision //
    handleProjectileWorldCollision(p) {
        p.recycle()
        this.projectiles.killAndHide(p)
    }

    // Projectile-Enemy Collision //
    handleProjectileEnemyCollision(enemy, projectile) {
        if (projectile.active) {
            enemy.setTint(0xff0000)
            //get x and y coords
            var coords = enemy.getCenter()
            var x = coords.x
            var y = coords.y
            
            let coin = new Coin(this, Math.round(x), Math.round(y), 'coin0')
            this.physics.add.existing(coin)
            coin.update()
            this.time.addEvent({
                delay: 15,
                callback: () => {
                    this.player.updateScore(5);
                    this.player.addEnemy()
                    enemy.explode()
                    projectile.recycle()
                },
                callbackScope: this,
                loop: false
            })
        }
    }

    // Player-Enemy Collision //
    handlePlayerEnemyCollision(player, enemy) {
        player.updateScore(-5);
        this.cameras.main.shake(15, 0.02)
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
        this.removeHealth()
    }

    // Player-Star Collision //
    collectStar(player, star) {
        star.disableBody(true, true);

        this.player.updateScore(5);
        this.player.addCoin()
        if (this.stars.countActive(true) === 0) {
            this.stars.children.iterate(function (child) {
                child.enableBody(true, child.x, child.y + 50, true, true);
            });
        }
    }

    // Player-Health Pack Collision //
    collectHealth(player, heart) {
        heart.disableBody(true, true);
        this.addHealth()
        if (this.health_pickups.countActive(true) === 0) {
            this.health_pickups.children.iterate(function (child) {
                child.enableBody(true, Phaser.Math.Between(0, 400), Phaser.Math.Between(0, 320), true, true);
            });
        }
    }

    // Dark background for objectives and pause screen //
    createVeil() {
        this.veil = this.add.graphics({x : 0, y: 0});
        this.veil.fillStyle('0x000000', 0.75);
        this.veil.fillRect(0, 0, 400, 320);
        this.veil.setDepth(100);
        this.veil.setScrollFactor(0);
    }

    // Objectives Screen //
    createObjectivesScreen() {
        this.createVeil();
        this.textObjective = this.add.text(150, 45, 'OBJECTIVES');
        this.textObjective.setDepth(101);
        this.textObjective.setScrollFactor(0);

        this.CollectObjective = this.add.text(75, 100, 'Collect 5 Stars');
        this.CollectObjective.setDepth(101);
        this.CollectObjective.setScrollFactor(0);

        this.EnemyObjective = this.add.text(75, 130, 'Eliminate 5 Enemies in: ');
        this.EnemyObjective.setDepth(101);
        this.EnemyObjective.setScrollFactor(0);

        this.toggleScreen(false, "objectives"); //hides
    }
    
    // Pause Screen //
    createPauseScreen() {
        this.createVeil()
        this.textPause = this.add.text(175, 45, 'PAUSE');
        this.textPause.setDepth(101);
        this.textPause.setScrollFactor(0);

        this.toggleScreen(false, "pause"); //hides
    }

    // displays the 'veil' and then displays either the pause / objectives screen
    toggleScreen(isVisible, whichScreen) {
        this.veil.setVisible(isVisible);
        
        // need an if-statement so the objectives page and pause page can't be displayed at the same time
        if (whichScreen == "objectives") {
            this.textObjective.setVisible(isVisible);
            if (this.countdown.active == true) {
                this.timerLabel.setVisible(isVisible);
            }

            // check if player has completed either objective.
            if(this.player.getCoin() >= 5) {
                this.CollectObjective.setText('Collect 5 Stars ✓');
            }
            this.CollectObjective.setVisible(isVisible);
            
            // set to 1, for the purpose of testing.
            if(this.player.getEnemy() >= 5 && this.countdown.getDuration() > 0)  {
                this.countdown.stop()
                this.timerLabel.setVisible(false);
                this.EnemyObjective.setText('Eliminate 5 Enemies ✓')
            }
            this.EnemyObjective.setVisible(isVisible);
        } else if (whichScreen == "pause") {
            this.textPause.setVisible(isVisible);
        }
    }

    // Shows screen on CRATE BUTTON click OR on key press "Q" //
    clickObjective() {
        this.isObjective = !this.isObjective
        this.toggleScreen(this.isObjective, "objectives");
    }

    // Pause on button press OR on key press "esc" //
    clickPause() {
        this.isPause = !this.isPause
        this.toggleScreen(this.isPause, "pause")
    }

    // Decrease/increase player health //
    removeHealth() {
        this.player.updateHealth(-1)
        this.heart_arr[this.player.health].visible = false
    }

    addHealth() {
        this.player.updateHealth(1)
        this.heart_arr[this.player.health-1].visible = true
    }

    // if player's health = 0 //
    gameOver() {
        console.log("GAME OVER - FINAL SCORE: ", this.player.score);
        //this.scene.start('LoseScene')  use this to change to lose scene on game over
    }
 
    // general update class, ran with each game 'tick' //
    update(time, delta) {
        this.scoreText.setText('Score : ' + this.player.score);
        this.scoreText.setX(310 - (this.player.score.toString().length * 8))
        this.ammoText.setText('Ammo: ' + this.gun.ammo);

        // game over if player's health is 0 //
        if (this.player.health <= 0) {
            //game is over
            this.gameOver()
        }
        
        // fire projectile on mouse click in mouse direction //
        this.input.setDefaultCursor('url(teamAssets/blank_cursor.png), pointer') //hides cursor by making it a 1 pixel image
        var pointer = this.input.activePointer;
        if(pointer.leftButtonDown() && !this.reloadStatus){
            if (this.gun.ammo > 0) {
                if (time > this.lastFiredTime) {
                    this.lastFiredTime = time + 200 //set delay between projectile fire
                    this.gun.shoot()
                    this.projectiles.fireProjectile(this.player.x, this.player.y, this, pointer) //call func in "Projectile.js"
                }
            }
        }
        this.gun.update(time, delta, pointer, this)
        this.crosshair.update(time, delta, pointer)

        // reloads guns //
        this.reloadText.setPosition(pointer.x - 16, pointer.y - 20)
        if (Phaser.Input.Keyboard.JustDown(this.keys.r) && !pointer.leftButtonDown()) {
            if (this.gun.ammo < this.gun.mag){
                this.reloadText.setText("Reloading")
                this.reloadText.setVisible(true)
                this.reloadStatus = true
                this.time.delayedCall(1000, this.reloadFunc, [], this)
            }
        }

        if (this.gun.ammo == 0 && !this.reloadStatus) {
            this.reloadText.setText("No Ammo")
            this.reloadText.setVisible(true)
        }

        // Open objectives on key press "Q" //
        if (this.keys.q.isDown) {
            if (!this.toggleObjectives && !this.isPause) {
                this.toggleObjectives = true;
                this.clickObjective();
            }
        }
        if(this.keys.q.isUp) {
            this.toggleObjectives = false;
        }

        // Pause //
        if(this.keys.esc.isDown) {
            if (!this.togglePause && !this.isObjective) {
                this.togglePause = true;
                this.clickPause();
            }
        }
        if (this.keys.esc.isUp) {
            this.togglePause = false;
        }

        this.player.update(time, delta, pointer)

        // update enemy group so 5 enemies are always alive //
        this.enemies.children.iterate((child) => {
            if(!child.isDead) {
                child.update(this)
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
        //timer
        this.countdown.update();
    } //end update


} //end gameScene