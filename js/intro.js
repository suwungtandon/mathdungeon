var angle = 0;
var zoom  = 1;
var angleA = -0.05;
var zoomA = -0.0025;

var intro = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize:

        function intro() {
            Phaser.Scene.call(this, { key: 'intro' });
        },

    preload: function preload() {
        this.load.image('logo', 'assets/logo.png');
    },
    create: function create() {
        logo = this.physics.add.sprite(gameWidth/2, gameHeight/2, 'logo')
            .setScale(0.4)
            .setInteractive();
        text = this.add.text(gameWidth/2, gameHeight/2 + 30, 'Click to play!');
        this.physics.world.enable(text);
        text.setInteractive();
        text.on('pointerdown', function () {
            this.cameras.main.fadeOut(50);
            this.scene.transition({
                target: 'level1',
                duration: 500,
                moveBelow: true,
                sleep: true
            });
        }, this);
        logo.on('pointerdown', function () {
            this.cameras.main.fadeOut(50);
            this.scene.transition({
                target: 'level1',
                duration: 500,
                moveBelow: true,
                sleep: true
            });
        }, this);
    },

    update: function update() {
        this.cameras.main.setAngle(angle);
        if (angle <= -5 || angle >= 5) {
            angleA = -angleA;
        }
        angle = angle + angleA;
        this.cameras.main.setZoom(zoom);
        if (zoom <= 0.9 || zoom >= 1.2) {
            zoomA = -zoomA;
        }
        zoom = zoom + zoomA;
    },
});