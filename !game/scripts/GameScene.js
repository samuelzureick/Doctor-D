class GameScene extends Phaser.Scene 
{
    
    countdown
    constructor() {
        super('GameScene')
        //test
    }
    

    preload() {
        this.cursors
        this.cameras.main.setBackgroundColor(0x9900e3)

        //load sprite images//
        this.load.image('tiles', 'assets/Tilemap/16 x 16 codename iso game.png')
        this.load.image('lab-tiles', 'teamAssets/update_1.6/update 1.6/tileset/lab tileset.png')
        
        this.load.tilemapTiledJSON('room0', 'scripts/rooms/room0.json')
        this.load.tilemapTiledJSON('room1', 'scripts/rooms/room1.json')
        this.load.tilemapTiledJSON('room2', 'scripts/rooms/room2.json')
        this.load.tilemapTiledJSON('room3', 'scripts/rooms/room3.json')
        
        this.load.atlas('characters', 'teamAssets/sprites/character.png', 'teamAssets/sprites/character.json')
        this.load.image('health', 'teamAssets/UI/Hearts/hearts_hearts_0.png')       // maybe rename health images to something better 
        this.load.image('health-lost', 'teamAssets/UI/Hearts/hearts_hearts_1.png')  // maybe rename health images to something better 
        var frameNames = this.textures.get('characters').getFrameNames()
        this.load.atlas('enemy', 'assets/sprites/blob.png', 'assets/sprites/blob.json')
        this.load.image('star', 'assets/star.png');
        
        this.load.image('gun', 'teamAssets/PlayerCharacter/Gun/Main Gun/main gun_Gun_0.png')
        this.load.image('bullet', 'teamAssets/PlayerCharacter/Gun/Main Gun/shell_shotgun shell_0.png')
        this.load.image('crosshair', 'teamAssets/PlayerCharacter/Gun/Crosshair/crosshair_Crosshair_0_2x.png')
        this.load.image('reloadText', 'assets/ammo_text/reloading.png')
        this.load.image('noAmmoText', 'assets/ammo_text/noAmmo.png')
        this.load.image('ammoText', 'assets/ammo_text/AMMO.png')
        this.load.image('ammo0', 'assets/ammo_text/ZERO.png')
        this.load.image('ammo1', 'assets/ammo_text/ONE.png')
        this.load.image('ammo2', 'assets/ammo_text/TWO.png')
        this.load.image('ammo3', 'assets/ammo_text/THREE.png')
        this.load.image('ammo4', 'assets/ammo_text/FOUR.png')
        this.load.image('ammo5', 'assets/ammo_text/FIVE.png')
        this.load.image('ammo6', 'assets/ammo_text/SIX.png')
        
        this.load.image('clearedText', 'assets/roomCleared.png')
        this.load.image('pausedText', 'assets/pause_screen_text/PAUSED.png')
        this.load.image('objectivesText', 'assets/pause_screen_text/OBJECTIVES.png')
        this.load.image('restartText', 'assets/pause_screen_text/RESTART.png')
        this.load.image('menuText', 'assets/pause_screen_text/MENU.png')
        this.load.image('gameOverText', 'assets/gameover_screen_text/gameOverText.png')
        this.load.image('blackBlock', 'assets/gameover_screen_text/blackBlock.png')
        this.load.image('gameWonText', 'assets/gameover_screen_text/gameWon.png')
        
        this.load.image('coin0', 'teamAssets/Tilemap/Coin/Spin/Pick Up_spin_0.png')
        this.load.image('coin1', 'teamAssets/Tilemap/Coin/Spin/Pick Up_spin_1.png')
        this.load.image('coin2', 'teamAssets/Tilemap/Coin/Spin/Pick Up_spin_2.png')
        this.load.image('coin3', 'teamAssets/Tilemap/Coin/Spin/Pick Up_spin_3.png')
        this.load.image('coin4', 'teamAssets/Tilemap/Coin/Spin/Pick Up_spin_4.png')
        this.load.image('coin5', 'teamAssets/Tilemap/Coin/Spin/Pick Up_spin_5.png')
        this.load.image('coin6', 'teamAssets/Tilemap/Coin/Spin/Pick Up_spin_6.png')
        this.load.image('coin7', 'teamAssets/Tilemap/Coin/Spin/Pick Up_spin_7.png')
        this.load.image('coin8', 'teamAssets/Tilemap/Coin/Spin/Pick Up_spin_8.png')

        this.load.html('nameform', 'scripts/loginform.html');

        //////////////////////////////////////////////////////////////////////////

        // initialise class variables //    
        this.finalScore
        this.player
        this.keys
        this.enemy
        this.enemies
        this.gun
        this.crosshair
        this.projectiles
        this.lastFiredTime = 0
        this.clearDelay = 0
        this.reloadStatus = false
        this.stars
        this.health_pickups
        this.scoreText = this.add.text(310, 6, 'Score: 0')
        this.ammoText
        this.ammoNumber
        this.pausedText
        this.objectivesText
        this.veilVisible
        this.togglePause = false
        this.timerLabel
        this.isObjective
        this.gameOver = false
        this.roomCleared = false
        this.countdownFinished = false
        this.hasWon

    } // end preload
    create(data) {
        console.log(data)
        var tileset;
        if (Object.getOwnPropertyNames(data).length > 0) {
            this.registry.list.load = parseInt(data) + 1
            console.log(this.registry.list.load)
        } else {
            // create tilemap //
            this.registry.set('load', 0)
            this.registry.set('score', 0)
        }

        this.map = this.make.tilemap({
            key: 'room' + this.registry.list.load
        })

        console.log("MAP", this.map)
        console.log("LEVEL", this.registry.list.load)
        if (this.registry.list.load <=1){
            tileset = this.map.addTilesetImage('tileset', 'tiles')
        } else {
            tileset = this.map.addTilesetImage('lab tileset', 'lab-tiles')
        }
        console.log(tileset)

        // setting up tilemap, layers and collisions //
        // var tileset = this.map.addTilesetImage('tileset', 'tiles')
        
        var belowLayer = this.map.createStaticLayer('below player', tileset, 0, 0)
        var worldLayer = this.map.createStaticLayer('world', tileset, 0, 0)
        var door = this.map.createStaticLayer('door', tileset, 0, 0)

        worldLayer.setCollisionByProperty({
            collides: true
        })
        door.setCollisionByProperty({
            collides: true
        })
        this.physics.world.bounds.width = this.map.widthInPixels
        this.physics.world.bounds.height = this.map.heightInPixels
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels)   
        // for timer //
        this.timerLabel = this.add.text(300, 178, '45').setOrigin(0.5);
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
        this.player.setDepth(1);
        this.physics.add.collider(this.player, worldLayer)
        this.physics.add.collider(this.player, door, this.testForDoor, null, this)
        this.cameras.main.startFollow(this.player, true, 0.8, 0.8)
        this.player.body.setCollideWorldBounds(true)
        
        // initialise gun //
        this.gun = new Gun(this, 200, 120, 6, 'gun')
        this.gun.setDepth(1);
        
        // initialise crosshair //
        this.crosshair = new Crosshair(this, 200, 120, 'crosshair')
        
        // initialise enemies + add collisions //
        this.enemies = this.add.group()
        this.enemies.maxSize = 5
        for (let i = 0; i < this.enemies.maxSize; i++) {
            const e = new Enemy(this, 220 + 20*i, 250, 'enemy')
            e.body.setCollideWorldBounds(true)
            e.setDepth(1);
            this.enemies.add(e)
        }
        this.physics.add.collider(this.enemies, worldLayer)
        
        // Create Score Text //
        this.scoreText.setFontSize('15px')
        this.scoreText.setColor('#FFFFFF')
        this.scoreText.setBackgroundColor('#000000')
        this.scoreText.setDepth(103);  
        
        // Create Ammo Text //
        this.ammoText = this.add.sprite(350, 295, 'ammoText')
        this.ammoText.setDisplaySize(29, 8)
        this.ammoNumber = this.add.sprite(375, 293, 'ammo6')
        this.ammoNumber.setDisplaySize(10, 12)
        
        // Reload Text //
        this.reloadText = this.add.sprite(0,0,'reloadText')
        this.reloadText.setDisplaySize(45,11)
        this.reloadText.setVisible(false)
        
        // Game Over Text //
        this.gameOverText = this.add.sprite(this.cameras.main.worldView.x + this.cameras.main.width / 2, 100, 'gameOverText')
        this.gameOverText.setDisplaySize(472,153)
        this.gameOverText.setDepth(102);
        this.gameOverText.setVisible(false)
        this.blackBlock = this.add.sprite(0, 0, 'blackBlock')
        this.blackBlock.setDisplaySize(1000,1000)
        this.blackBlock.setDepth(100);
        this.blackBlock.setVisible(false)

        // Room Cleared Text //
        this.clearedText = this.add.sprite(200, 90, 'clearedText')
        this.clearedText.setDisplaySize(210, 50)
        this.clearedText.setVisible(false)

        // Username Form //
        this.usernameForm = this.add.dom(this.cameras.main.worldView.x + this.cameras.main.width / 2, 125).createFromCache('nameform');
        this.usernameForm.setInteractive();
        this.usernameForm.addListener('click');
        this.usernameForm.on('click', (event) => this.submitLeaderboard(event));
        this.usernameForm.setVisible(false);

        // Restart Game //
        this.restartButton = this.add.sprite(100,50 ,'restartText');
        this.restartButton.setDisplaySize(142.5,38)
        this.restartButton.setDepth(101);  
        this.restartButton.setInteractive();
        this.restartButton.on('pointerdown', () => this.restartGame());
        this.restartButton.setVisible(false)


        // Return to Menu Button //
        this.menuButton = this.add.sprite(0,0, 'menuText');
        this.menuButton.setDisplaySize(142.5,38)
        this.menuButton.setDepth(101);  
        this.menuButton.setInteractive();
        this.menuButton.on('pointerdown', () => this.mainMenu());
        this.menuButton.setVisible(false)



        ///// Collectible Items /////
        // Coins //
        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 5,
            setXY: {x: 100, y: 200, stepX: 25}
        });
        this.stars.setDepth(1);
        this.coins = this.physics.add.group()
        this.coins.setDepth(1);

        // Health Packs //
        this.health_pickups = this.physics.add.group({
            key: 'health',
            setScale: {x: 0.75, y: 0.75},
            repeat: 2,
            setXY: {x: Phaser.Math.Between(0, 400), y: Phaser.Math.Between(0, 320)}
        })
        this.health_pickups.setDepth(1);

        // Initialise Pause Screen //
        this.createPauseScreen();

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
        this.physics.add.overlap(this.player, this.coins, this.addCoin, null, this)
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

    } //end create
    
    addCoin(player, coin) {
        this.coins.remove(coin, true, true)
        this.player.updateScore(5)
    }
    
    testForDoor(player, door) {
        if (this.roomCleared){
            if (this.registry.list.load == '3') {
                this.hasWon = true;
            } else {
                console.log(this.registry.list.load)
                this.scene.restart(this.registry.list.load.toString())
            }
        }
    }

    // Function to remove enemy from scene. If the enemy is the final one alive set room cleared flag to true
    removeEnemy(enemy) {
        this.enemies.remove(enemy, true, true)
        if (this.enemies.getChildren().length == 0) {
            this.roomCleared = true
        }
    }
    
    handleCountdownFinished()
    {}

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
            projectile.recycle()
            enemy.removeHealth()
            enemy.setTint(0xff0000)
            setTimeout(()=>{enemy.clearTint()}, 75)
            
            if (enemy.health <= 0){
                //get x and y coords
                var coords = enemy.getCenter()
                var x = coords.x
                var y = coords.y
                
                let coin = new Coin(this, Math.round(x), Math.round(y), 'coin0')
                coin.update()
                this.coins.add(coin)
                
                this.time.addEvent({
                    delay: 15,
                    callback: () => {
                        this.player.updateScore(5);
                        this.player.addEnemy()
                        this.removeEnemy(enemy)
                        projectile.recycle()
                    },
                    callbackScope: this,
                    loop: false
                })
            } 
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
        this.removeEnemy(enemy)
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
        if (this.health_pickups.countActive(true) === 0){
            this.health_pickups.children.iterate(function (child){
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
        this.veilVisible = true;
    }

    // Pause & Objectives Screen //
    createPauseScreen() {
        this.createVeil();
        this.pausedText = this.add.sprite(this.cameras.main.worldView.x + this.cameras.main.width / 2, 60, 'pausedText')
        this.pausedText.setDepth(101);
        this.objectivesText = this.add.sprite(120, 110, 'objectivesText')
        this.objectivesText.setDepth(101);
        this.objectivesText.setDisplaySize(172, 21)
        this.CollectObjective = this.add.text(35, 140, 'Collect 5 Stars');
        this.CollectObjective.setDepth(101);
        this.CollectObjective.setScrollFactor(0);
        this.EnemyObjective = this.add.text(35, 170, 'Eliminate 5 Enemies in: ');
        this.EnemyObjective.setDepth(101);
        this.EnemyObjective.setScrollFactor(0);
        this.toggleScreen(this.togglePause, "pause"); //hides
    }
    // displays the 'veil' and then displays the pause screen
    toggleScreen(paused) {
        this.veil.setVisible(paused);
        
        this.pausedText.setVisible(paused);
        this.objectivesText.setVisible(paused);
        this.restartButton.setVisible(paused);
        this.restartButton.setPosition(105, 250);
        this.menuButton.setVisible(paused);
        this.menuButton.setPosition(280, 250)
        
        if (this.countdown.active == true) {
            this.timerLabel.setVisible(paused);
        }
        // check if player has completed either objective.
        if(this.player.getCoin() >= 5) {
            this.CollectObjective.setText('Collect 5 Stars ✓');
        }
        this.CollectObjective.setVisible(paused);
        
        if (this.countdownFinished == false) {
            if(this.player.getEnemy() >= 5 && this.countdown.getDuration() > 0)  {
                this.countdown.stop()
                this.countdownFinished = true;
                this.timerLabel.setVisible(false);
                this.EnemyObjective.setText('Eliminate 5 Enemies ✓')
            }
        } else {
            this.timerLabel.setVisible(false);
            this.EnemyObjective.setText('Eliminate 5 Enemies ✓')
        }
        this.EnemyObjective.setVisible(paused);

        if (paused) {
            this.physics.pause()
            this.anims.pauseAll()
        }
        else {
            this.physics.resume()
            this.anims.resumeAll()
        }
    }

    toggleClearedText(visible) {
        this.clearedText.setVisible(!visible)
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

//    // if player's health = 0 //
//    gameOver() {
//        console.log("GAME OVER - FINAL SCORE: ", this.player.score);
//        //this.scene.start('LoseScene')  use this to change to lose scene on game over
//    }

    submitLeaderboard(event) {
            if (event.target.name == 'submitButton') {
                sessionStorage.setItem("score", this.player.score);
                window.location.href=("../\!game/scripts/processScore.html")
            }
        }
    
    mainMenu() {
        var inputUsername = this.usernameForm.getChildByID('name'); 
        
        window.location.href = "../!website/Menu.html";
        console.log("return to main menu")
    }


    restartGame() {
        this.scene.restart(-1)
    }
 
    // general update class, ran with each game 'tick' //
    update(time, delta) {
        this.scoreText.setText('Score : ' + this.player.score);
        this.scoreText.setX(310 - (this.player.score.toString().length * 8))

        // game over if player's health is 0 //
        if (this.player.health <= 0) {
            //game is over
            this.gameOver = true
        }

        switch (this.gun.ammo){
            case 0:
                this.ammoNumber.setTexture('ammo0')
                break
            case 1:
                this.ammoNumber.setTexture('ammo1')
                break
            case 2:
                this.ammoNumber.setTexture('ammo2')
                break
            case 3:
                this.ammoNumber.setTexture('ammo3')
                break
            case 4:
                this.ammoNumber.setTexture('ammo4')
                break
            case 5:
                this.ammoNumber.setTexture('ammo5')
                break
            case 6:
                this.ammoNumber.setTexture('ammo6')
                break                                        
            default:
                break
        }
        
        // fire projectile on mouse click in mouse direction //
        this.input.setDefaultCursor('url(teamAssets/blank_cursor.png), pointer') //hides cursor by making it a 1 pixel image
        var pointer = this.input.activePointer;
        if(pointer.leftButtonDown() && !this.reloadStatus && !this.gameOver && !this.togglePause){
            if (this.gun.ammo > 0) {
                if (time > this.lastFiredTime) {
                    this.lastFiredTime = time + 200 //set delay between projectile fire
                    this.gun.shoot()
                    this.projectiles.fireProjectile(this.player.x, this.player.y, this, pointer) //call func in "Projectile.js"
                }
            }
        }
        this.gun.update(time, delta, pointer, this)
        this.crosshair.update(time, delta, pointer, this.togglePause, this.gameOver)

        // reloads guns //
        this.reloadText.setPosition(pointer.x, pointer.y - 15)
        if (Phaser.Input.Keyboard.JustDown(this.keys.r) && !pointer.leftButtonDown()) {
            if (this.gun.ammo < this.gun.mag){
                this.reloadText.setTexture("reloadText")
                this.reloadText.setVisible(true)
                this.reloadStatus = true
                this.time.delayedCall(1000, this.reloadFunc, [], this)
            }
        }

        if (this.gun.ammo == 0 && !this.reloadStatus) {
            this.reloadText.setTexture("noAmmoText")
            this.reloadText.setVisible(true)
        }
   
        // Pause //
        if (Phaser.Input.Keyboard.JustDown(this.keys.esc)) {
            this.togglePause = !this.togglePause
            this.toggleScreen(this.togglePause)
        }

        if (!this.roomCleared){
            this.clearedText.setVisible(false)
            this.enemies.children.iterate((child) => {
                child.update(this)
            })
        } 
        else {
            if (time > this.clearDelay) {
                this.clearDelay = time + 650
                this.toggleClearedText(this.clearedText.visible)
            }
        }

        // allows user to increment/decrement health with + and - (test if health function is working correctly - logged to console)
        if (Phaser.Input.Keyboard.JustDown(this.keys.minus)) {
            this.removeHealth()
        } 
        else if (Phaser.Input.Keyboard.JustDown(this.keys.plus)) {
            this.addHealth()
        }

        if (this.hasWon) {
            this.gameOver = true;
            this.gameOverText.setTexture('gameWonText')
            this.gameOverText.setDepth(102);
            this.gameOverText.setPosition(this.cameras.main.worldView.x + this.cameras.main.width / 2, 100).setOrigin(0.5)
        }

        if (this.gameOver) {
            this.veil.setVisible(true);
            this.physics.pause()
            this.anims.pauseAll()
            this.player.setTint(0xff0000);
            this.usernameForm.setVisible(true)
            this.usernameForm.setDepth(103)
            this.usernameForm.setPosition(this.cameras.main.worldView.x + this.cameras.main.width / 2, 220).setOrigin(0.5)     
            this.blackBlock.setVisible(true)
            this.gameOverText.setVisible(true)
            this.scoreText.setPosition(this.cameras.main.worldView.x + this.cameras.main.width / 2, 190).setOrigin(0.5)
            this.scoreText.setDepth(103)
            this.menuButton.setVisible(true)
            this.menuButton.setPosition(320, 270)
            this.restartButton.setVisible(true)
            this.restartButton.setPosition(90, 270)
            this.input.keyboard.enabled = false;
            this.restartButton.setDepth(103);
            this.menuButton.setDepth(103);
            if (this.hasWon){
                if (this.player.score!=0){
                    this.finalScore = this.player.score
                }
                this.restartButton.setVisible(false)
                this.menuButton.setPosition(this.cameras.main.worldView.x + this.cameras.main.width / 2, 270)
                this.scoreText.setText("Your score is " + this.finalScore + "!")
            }
        }
        else { this.input.keyboard.enabled = true }
        
        this.player.update(time, delta, pointer)
        this.countdown.update(this.togglePause);
        
    } //end update


}//end gameScene