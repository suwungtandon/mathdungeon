var gameWidth = (document.documentElement.clientWidth - 20) / 4;
var gameHeight = (document.documentElement.clientHeight - 20) / 4;
// var blockWidth = 60;
// var blockHeight = 20;

var level1 = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize:

        function level1() {
            Phaser.Scene.call(this, { key: 'level1' });
        },

    preload: function preload() {
        // 60x20 16px tiles
        this.load.image('ground', 'assets/ground.png');
        // Need to load walls seperately for collision purposes
        // 60x2 16px tiles
        this.load.image('walls_upper', 'assets/walls_upper.png');
        this.load.image('walls_lower', 'assets/walls_lower.png');
        // 1x18 16px tiles
        this.load.image('walls_left', 'assets/walls_left.png');
        this.load.image('walls_right', 'assets/walls_right.png');
        // 2x18 16px tiles
        this.load.image('walls_mid', 'assets/walls_mid.png');
        // Load the player as a spritesheet
        this.load.spritesheet('player', 'assets/player.png', { frameWidth: 16, frameHeight: 32 });
        // 16px ladder
        this.load.image('ladder', 'assets/ladder.png');
    },

    create: function create() {
        // Add ground
        this.add.image(60*16 / 2, 20*16 / 2, 'ground');

        // Add walls
        walls = this.physics.add.staticGroup();
        walls.create(60 * 16 / 2, 8, 'walls_upper');
        walls.create(8, 20 * 16 / 2, 'walls_left');
        walls.create(60 * 16 - 8, 20 * 16 / 2, 'walls_right');
        walls.create(20 * 16, 20 * 16 / 2, 'walls_mid');
        walls.create(40 * 16, 20 * 16 / 2, 'walls_mid');
        walls.create(60 * 16 / 2, 20*16 - 8, 'walls_lower');

        // Add ladders
        ladders = this.physics.add.staticGroup();
        ladders.create(19 * 16 - 8, 20 * 16 / 2, 'ladder');
        ladders.create(39 * 16 - 8, 20 * 16 / 2, 'ladder');

        // Add level ending ladder
        laddersEnd = this.physics.add.staticGroup();
        laddersEnd.create(59*16-8, 20*16/2, 'ladder');

        // Add player
        player = this.physics.add.sprite(2*16, 10*16, 'player');
        //player.setCollideWorldBounds(true);

        // Add player animations
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('player', { start: 1, end: 3 }),
            frameRate: 10,
        })
        this.anims.create({
            key: 'wait',
            frames: [{ key: 'player', frame: 0 }],
            frameRate: 10
        })

        // Collide player with the walls
        this.physics.add.collider(player, walls);
        // Collide player with the ladder to go to the next level
        this.physics.add.collider(player, ladders, this.nextStage, null, this);
        this.physics.add.collider(player, laddersEnd, this.nextLevel, null, this);

        // Test text
        text = this.add.text(16, 16, 'test', { fontSize: '32px', fill: '#fff' });

        // Camera controls
        this.cameras.main.startFollow(player, true, 0.05, 0, 05);
    },

    update: function update() {
        // Touch controls
        if (this.input.activePointer.isDown) {
            if (this.input.activePointer.x - gameWidth / 2 < 0) {
                player.flipX = true;
            } else {
                player.flipX = false;
            }
            player.setVelocityX((this.input.activePointer.x - gameWidth / 2) * 2);
            player.setVelocityY((this.input.activePointer.y - gameHeight / 2) * 2);
            player.anims.play('right', true);
        } else {
            player.setVelocityX(0);
            player.setVelocityY(0);
            player.anims.play('wait', true);
        }
    },

    nextStage: function nextStage(player, ladders) {
        this.cameras.main.fadeIn(600);
        player.x += 16 * 3;
    },

    nextLevel: function nextLevel(player, laddersEnd) {
        this.scene.start('level1');
    }

})
