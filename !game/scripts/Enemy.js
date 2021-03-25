class Enemy extends Entity {
    constructor(scene, x, y, textureKey){
        super(scene, x, y, textureKey, 'Enemy')

        // set up enemy animations
        const anims = scene.anims
        const animFrameRate = 4
        this.textureKey = textureKey
        this.speed = 64

        console.log("hii")

        anims.create({
            key: 'enemyLeft',
            frames: anims.generateFrameNames(this.textureKey, {
                prefix: 'blob-walk-left/',
                suffix: '',
                start: 1,
                end: 3,
                zeroPad: 2
            }),
            frameRate: animFrameRate,
            repeat: -1
        })
        anims.create({
            key: 'enemyRight',
            frames: anims.generateFrameNames(this.textureKey, {
                prefix: 'blob-walk-right/',
                suffix: '',
                start: 1,
                end: 3,
                zeroPad: 2
            }),
            frameRate: animFrameRate,
            repeat: -1
        })
        anims.create({
            key: 'enemyUp',
            frames: anims.generateFrameNames(this.textureKey, {
                prefix: 'blob-walk-up/',
                suffix: '',
                start: 1,
                end: 3,
                zeroPad: 2
            }),
            frameRate: animFrameRate,
            repeat: -1
        })
        anims.create({
            key: 'enemyDown',
            frames: anims.generateFrameNames(this.textureKey, {
                prefix: 'blob-walk-down/',
                suffix: '',
                start: 1,
                end: 3,
                zeroPad: 2
            }),
            frameRate: animFrameRate,
            repeat: -1
        })

        // set up enemy movement and direction
        this.body.setVelocity(0, this.speed)
        let dir = Math.floor(Math.random()*4)
        switch (dir){
            case 0: 
                this.body.setVelocity(0, -this.speed)//up
                this.anims.play('enemyUp')
                break
            case 1:
                this.body.setVelocity(-this.speed, 0)//left
                this.anims.play('enemyLeft')
                break
            case 2:
                this.body.setVelocity(0, this.speed)//down
                this.anims.play('enemyDown')
                break
            case 3:
                this.body.setVelocity(this.speed, 0)//right
                this.anims.play('enemyRight')
                break
            default:
                break
        }

    }//end constructor

    update(){
        const {speed} = this    //this.speed

        // if the enemy is blocked by a wall, then change direction randomly
        const enemyBlocked = this.body.blocked
        if (enemyBlocked.down || enemyBlocked.left || enemyBlocked.up || enemyBlocked.right){

            let possibleDirections = []
            for (const direction in enemyBlocked){
                possibleDirections.push(direction)
            }

            const newDirection = possibleDirections[Math.floor(Math.random()*4)+1]
            switch (newDirection){
                case 'up': 
                    this.body.setVelocity(0, -this.speed)//up
                    this.anims.play('enemyUp')
                    break
                case 'left':
                    this.body.setVelocity(-this.speed, 0)//left
                    this.anims.play('enemyLeft')
                    break
                case 'down':
                    this.body.setVelocity(0, this.speed)//down
                    this.anims.play('enemyDown')
                    break
                case 'right':
                    this.body.setVelocity(this.speed, 0)//right
                    this.anims.play('enemyRight')
                    break
                default:
                    break
            }
        }
    }//end update
}