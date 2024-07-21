import { createAnimations } from "./animations.js";

/* gloabl Phaser */ //Window.Phaser
const config = {
    type: Phaser.AUTO, //webgl, canvas
    width: 256,
    height: 244,
    backgroundColor: '#049cd8',
    parent: 'game',
    physics: {
        default: 'arcade', //que se comporte como diferentes tipos de juegos; arcade, impact, matter; valores preconfigurados de gravedad, etc
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload, //se ejecuta para precargar recursos
        create, //se ejecuta cuando el juego comienza
        update //se ejecuta en cada frame
    }
}

new Phaser.Game(config);
//this -> game -> el juego que estamos construyendo

function preload() {

    this.load.image(
        'cloud1',
        'assets/scenery/overworld/cloud1.png'
    );

    this.load.image(
        'floorbricks',
        'assets/scenery/overworld/floorbricks.png'
    )

    this.load.spritesheet(
        'mario',
        'assets/entities/mario.png',
        { frameWidth: 18, frameHeight: 16 }
    )

    /* sounds */
    this.load.audio('gameover', 'assets/sound/music/gameover.mp3')

}

function create() {
    //image(x, y, id-del-asset)
    this.add.image(0, 0, 'cloud1')
        .setOrigin(0, 0) //cambio el punto de origen (por defecto es el centro de la imagen), lo ponemos en la esquina superior izq
        .setScale(0.15);

    /* Suelo */
    //necesitamos poner una especie de textura para el suelo
    /* this.add.tileSprite(0, config.height-32, config.width, 32, 'floorbricks')
    .setOrigin(0,0) */ //cogemos todo el área del suelo //without physics

    /* this.add.tileSprite(0, config.height-32, 64, 32, 'floorbricks')
    .setOrigin(0,0)

    this.add.tileSprite(100, config.height-32, 64, 32, 'floorbricks')
    .setOrigin(0,0) */ //without physics


    this.floor = this.physics.add.staticGroup()

    this.floor
        .create(0, config.height - 16, 'floorbricks')
        .setOrigin(0, 0.5)
        .refreshBody()

    this.floor
        .create(150, config.height - 16, 'floorbricks')
        .setOrigin(0, 0.5)
        .refreshBody()


    /* Mario */

    /* this.mario = this.add.sprite(50,210,'mario')
    .setOrigin(0,1) */ //without physics

    //With physics
    this.mario = this.physics.add.sprite(50, 210, 'mario')
        .setOrigin(0, 1)
        .setGravityY(600)
        .setCollideWorldBounds(true)

    /* mundo */
    this.physics.world.setBounds(0, 0, 2000, config.height) //le añadimos 2000px de mundo a la derecha

    /* camara */
    this.cameras.main.setBounds(0,0, 2000, config.height) //límites de la cámara los mismos que los del mundo
    this.cameras.main.startFollow(this.mario) //la cámara sigue a Mario

    /* Collisions */
    this.physics.add.collider(this.mario, this.floor)


    /* animations */

    /* this.anims.create({
        key: 'mario-walk',
        frames: this.anims.generateFrameNumbers(
            'mario',
            { start: 1, end: 3 }
        ),
        framerate: 12,
        repeat: -1 //se repite infinitamente
    })

    this.anims.create({
        key: 'mario-idle',
        frames: [{ key: 'mario', frame: 0 }]
    })

    this.anims.create({
        key: 'mario-jump',
        frames: [{ key: 'mario', frame: 5 }]
    }) */ //Lo cambiamos a un archivo js ya que se va a meter más animaciones

    createAnimations(this)


    /* Keys */

    //método para poder visualizar lass teclas en la función update()
    this.keys = this.input.keyboard.createCursorKeys()

}

function update() {
    if(this.mario.isDead) return

    if (this.keys.left.isDown) {
        this.mario.anims.play('mario-walk', true)
        this.mario.x -= 1.15
        this.mario.flipX = true;
    } else if (this.keys.right.isDown) {
        this.mario.anims.play('mario-walk', true)
        this.mario.x += 1.15
        this.mario.flipX = false;
    } else {
        /* this.mario.anims.stop()
        this.mario.setFrame(0) */
        this.mario.anims.play('mario-idle', true);
    }

    if (this.keys.up.isDown && this.mario.body.touching.down) {
        this.mario.setVelocityY(-300) //with physics
        this.mario.anims.play('mario-jump', true);
        /* this.mario.y -= 3 */ //without physics
    }

    if(this.mario.y >= config.height){
        this.mario.isDead = true
        this.mario.anims.play('mario-dead')
        this.mario.setCollideWorldBounds(false)
        /* this.sound.play('gameover') */
        this.sound.add('gameover', { volume: 0.1}).play()

        setTimeout(()=>{
            this.mario.setVelocityY(-350 )
        },100)
        setTimeout(()=>{
            this.scene.restart()
        },2000)
    }
}