class GameScene extends Phaser.Scene {
    

    countdown

    constructor() {
        super('GameScene')
    }

    preload() {
        this.cursors
        this.cameras.main.setBackgroundColor(0x9900e3)

        //load sprite images//
        this.load.image('bullet', 'teamAssets/sprites/bullet.png')
        this.load.image('tiles', 'assets/Tilemap/16 x 16 codename iso game.png')
        this.load.tilemapTiledJSON('map', 'scripts/mappp.json')

        this.load.atlas('characters', 'teamAssets/sprites/character.png', 'teamAssets/sprites/character.json')
        this.load.image('health', 'teamAssets/UI/Hearts/hearts_hearts_0.png')       // maybe rename health images to something better 
        this.load.image('health-lost', 'teamAssets/UI/Hearts/hearts_hearts_1.png')  // maybe rename health images to something better 
        var frameNames = this.textures.get('characters').getFrameNames()

        this.load.atlas('enemy', 'teamAssets/sprites/skeleton.png', 'teamAssets/sprites/skeleton.json')
        this.load.image('star', 'assets/star.png');

        this.load.image('crateButton', 'teamAssets/Update 1.4/Destructible Items/Crate/crate_Destroy Crate_00.png')

        //////////////////////

        // initialise class variables //
        this.player
        this.keys
        this.enemy
        this.enemies
        this.projectiles
        this.keys
        this.lastFiredTime = 0
        this.stars
        this.health_pickups
        this.scoreText
        this.toggleObjectives
        this.togglePause
        this.timerLabel
        this.isPause
        this.isObjective

    } //end preload

    create() {    
        // create tilemap //

        const map = this.make.tilemap({
            key: 'map'
        })

        // setting up tilemap, layers and collisions //
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

        //for timer
        this.timerLabel = this.add.text(100, 50 , '45').setOrigin(0.5);
        this.timerLabel.setDepth(101);


        this.countdown = new CountdownController(this, this.timerLabel);
        this.countdown.start(this.handleCountdownFinsihed.bind(this)); 
        this.timerLabel.setVisible(false)


        const debugGraphics = this.add.graphics().setAlpha(0.2)
        worldLayer.renderDebug(debugGraphics, {
            tileColor: null,
            collidingTileColor: new Phaser.Display.Color(0, 0, 255),
            faceColor: new Phaser.Display.Color(0, 255, 0, 255)
        })
        
        // initialise player + collisions //
        this.player = new Player(this, 200, 120, 'characters')
        this.physics.add.collider(this.player, worldLayer)
        this.cameras.main.startFollow(this.player, true, 0.8, 0.8)
        this.player.body.setCollideWorldBounds(true)

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
        this.scoreText = this.add.text(275, 6, 'Score: 0')
        this.scoreText.setFontSize('15px')
        this.scoreText.setColor('#FFFFFF')
        this.scoreText.setBackgroundColor('#000000')

        // Create Collectible Items //
        // Coins
        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 5,
            setXY: {x: 100, y: 200, stepX: 25}
        });

        // Health Packs
        this.health_pickups = this.physics.add.group({
            key: 'health',
            setScale: {x: 0.75, y: 0.75},
            repeat: 2,
            setXY: {x: Phaser.Math.Between(0, 400), y: Phaser.Math.Between(0, 320)}
        })

        // Initialise Objectives and Pause Screen
        this.createObjectivesScreen();
        this.createPauseScreen();

        // Draw Objective Button //
        this.add.image(15, 40, 'crateButton').setInteractive();
        this.input.on('gameobjectup', this.clickObjective, this);

        // Add keys for inputs + projectiles //
        const {Q} = Phaser.Input.Keyboard.KeyCodes
        this.keys = this.input.keyboard.addKeys({
            space: 'SPACE',
            plus: 'PLUS',
            minus: 'MINUS',
            esc: 'ESC',
            q: Q
        })
        this.projectiles = new Projectiles(this)

        // Create collision methods //
        this.physics.add.collider(this.projectiles, worldLayer, this.handleProjectileWorldCollision, null, this)
        this.physics.add.overlap(this.projectiles, this.enemies, this.handleProjectileEnemyCollision, null, this)
        this.physics.add.overlap(this.player, this.enemies, this.handlePlayerEnemyCollision, null, this)
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this)
        this.physics.add.overlap(this.player, this.health_pickups, this.collectHealth, null, this)

        // draw player hearts //
        this.heart_arr = [];
        
        for (var i=0; i < this.player.health; i++) {
            var heart = this.add.sprite(15 + (27  * i), 15, 'health');
            this.heart_arr.push(heart);
        }

    } //end create

    handleCountdownFinsihed()
    {

    }

    // if projectile collides with map: //
    handleProjectileWorldCollision(p) {
        p.recycle()
        this.projectiles.killAndHide(p)
    }

    // if projectile collides with enemy: //
    handleProjectileEnemyCollision(enemy, projectile) {
        if (projectile.active) {
            enemy.setTint(0xff0000)
            this.time.addEvent({
                delay: 10,
                callback: () => {
                    this.player.updateScore(5);
                    this.player.addEnemy();
                    enemy.explode()
                    projectile.recycle()
                },
                callbackScope: this,
                loop: false
            })
        }
    }

    // if player collides with enemy: //
    handlePlayerEnemyCollision(player, enemy) {
        player.updateScore(-5);
        this.cameras.main.shake(15, 0.02)
        player.setTint(0xff0000)
        this.time.addEvent({
            delay: 500,
            callback: () => {
                player.clearTint()
                // player.addEnemy()
            },
            callbackScope: this,
            loop: false
        })
        enemy.explode()

        this.removeHealth()

    }

    // if player collides with star //
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

    // if player collides with health pack //
    collectHealth(player, heart) {
        heart.disableBody(true, true);
        this.addHealth()
        if (this.health_pickups.countActive(true) === 0) {
            this.health_pickups.children.iterate(function (child) {
                child.enableBody(true, Phaser.Math.Between(0, 400), Phaser.Math.Between(0, 320), true, true);
            });
        }
    }

    // creates the dark background for the objectives and pause screen
    createVeil() {
        this.veil = this.add.graphics({x : 0, y: 0});
        this.veil.fillStyle('0x000000', 0.75);
        this.veil.fillRect(0, 0, 400, 320);
        this.veil.setDepth(100);
        this.veil.setScrollFactor(0);
    }

    // creates an objectives screen, then 'hides' it
    createObjectivesScreen() {
        this.createVeil();
        this.textObjective = this.add.text(150, 45, 'OBJECTIVES');
        this.textObjective.setDepth(101);
        this.textObjective.setScrollFactor(0);

        this.CollectObjective = this.add.text(100, 100, 'Collect 5 Stars');
        this.CollectObjective.setDepth(101);
        this.CollectObjective.setScrollFactor(0);

        this.EnemyObjective = this.add.text(100, 130, 'Eliminate 5 Enemies');
        this.EnemyObjective.setDepth(101);
        this.EnemyObjective.setScrollFactor(0);

        this.toggleScreen(false, "objectives");
    }
    
    // creates a pause screen, then 'hides' it
    createPauseScreen() {
        this.createVeil()
        this.textPause = this.add.text(175, 45, 'PAUSE');
        this.textPause.setDepth(101);
        this.textPause.setScrollFactor(0);

        this.toggleScreen(false, "pause");
    }

    // displays the 'veil' and then displays either the pause / objectives screen
    toggleScreen(isVisible, whichScreen) {
        this.veil.setVisible(isVisible);

        // need an if-statement so the objectives page and pause page can't be displayed at the same time
        if (whichScreen == "objectives") {
            this.textObjective.setVisible(isVisible);
            this.timerLabel.setVisible(isVisible);

            // check if player has completed either objective.
            if(this.player.getCoin() >= 5) {
                this.CollectObjective.setText('Collect 5 Stars ✓');
            }
            this.CollectObjective.setVisible(isVisible);
            
            if(this.player.getEnemy() >= 5) {
                console.log("hi")
                this.EnemyObjective.setText('Eliminate 5 Enemies ✓')
            }
            this.EnemyObjective.setVisible(isVisible);
        } else if (whichScreen == "pause") {
            this.textPause.setVisible(isVisible);
        }
    }

    // is called when the user clicks the objective button / presses q
    clickObjective() {
        this.isObjective = !this.isObjective
        this.toggleScreen(this.isObjective, "objectives");
    }

    // is called when the user clicks the pause button / presses esc
    clickPause() {
        this.isPause = !this.isPause
        this.toggleScreen(this.isPause, "pause")
    }

    // class to decrease and increase player's health //
    removeHealth() {
        this.player.updateHealth(-1)
        console.log(this.player.health)
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

        // game over if player's health is 0
        if (this.player.health <= 0) {
            //game is over
            this.gameOver()
        }
        
        // fire projectile if player presses space
        if(this.keys.space.isDown){
            if (time > this.lastFiredTime) {
                this.lastFiredTime = time + 500
                this.projectiles.fireProjectile(this.player.x, this.player.y, this.player.facing)
            }
        }

        // open objectives menu if player presses q
        if(this.keys.q.isDown) {
            if (!this.toggleObjectives && !this.isPause) {
                this.toggleObjectives = true;
                this.clickObjective();
            }
        }

        if(this.keys.q.isUp) {
            this.toggleObjectives = false;
        }

        // open pause menu if player presses pause
        if(this.keys.esc.isDown) {
            if (!this.togglePause && !this.isObjective) {
                this.togglePause = true;
                this.clickPause();
            }
        }

        if (this.keys.esc.isUp) {
            this.togglePause = false;
        }

        this.player.update()
        // update enemy group so 5 enemies are always alive 
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

        //timer
        this.countdown.update();
    } //end update


} //end gameScene