// Generate random number between 1-100
function rand() {
    return Math.floor((Math.random() * 100) + 1);
}

// Generate random number within the coordinates of a room
function rand2(x1, x2, y1, y2) {
    return {
        x: Math.floor((Math.random() * (x2 - x1)) + x1),
        y: Math.floor((Math.random() * (y2 - y1)) + y1)
    };
}

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
        this.load.spritesheet('player', 'assets/player.png', { frameWidth: 16, frameHeight: 19 });
        // 16px gate
        this.load.image('gate', 'assets/gate.png');
        // Menu icon
        this.load.image('menu', 'assets/menu.png');
        // Box
        this.load.image('box', 'assets/box.png')
        // Zone
        this.load.image('zone', 'assets/place.png');
    },

    create: function create() {
        // Add ground
        this.add.image(60 * 16 / 2, 20 * 16 / 2, 'ground');

        // Add gates
        gates = this.physics.add.staticGroup();
        gates.create(19 * 16 - 8, 20 * 16 / 2, 'gate').setVisible(false); // room 1->2
        gates.create(39 * 16 - 8, 20 * 16 / 2, 'gate').setVisible(false); // room 2->3
        gates.create(59 * 16 - 8, 20 * 16 / 2, 'gate').setVisible(false); // next level

        // Add walls
        walls = this.physics.add.staticGroup();
        walls.create(60 * 16 / 2, 8, 'walls_upper');
        walls.create(2, 20 * 16 / 2, 'walls_left');
        walls.create(60 * 16 - 8, 20 * 16 / 2, 'walls_right');
        walls.create(20 * 16, 20 * 16 / 2, 'walls_mid');
        walls.create(40 * 16, 20 * 16 / 2, 'walls_mid');
        walls.create(60 * 16 / 2, 20 * 16 - 8, 'walls_lower');

        // Add player
        player = this.physics.add.sprite(2 * 16, 10 * 16, 'player');
        var playerCarrying = null;

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

        // Camera controls
        this.cameras.main.startFollow(player, true);

        // --------------------------------------------------------------------------------------
        // ------------------------------=[ ROOM 1 ]=--------------------------------------------
        // --------------------------------------------------------------------------------------
        var success = 4;
        text1 = this.add.text(3, -22, 'Room 1: Complete the additions', {
            fontSize: '16px',
            fill: '#ddd',
            fontFamily: 'Droid Sans',
            backgroundColor: '#88f'
        });

        // Equations
        for (var i = 0; i < 4; i++) {

            // Generate two random numbers between 1-100
            n1 = rand();
            n2 = rand();
            while (n1 + n2 > 100) {
                n1 = rand();
                n2 = rand();
            }

            // Print the equation on the floor
            question = this.add.text(6 * 16, (2 + 5 * i) * 16, n1.toString() + ' + ' + n2.toString() + ' =', {
                fontSize: '20px',
                fontFamily: 'Monospace',
                fill: '#fff'
            });

            // Drop zone for the answer
            zone = this.physics.add.staticGroup();
            zone.create(14 * 16, (2 + 5 * i) * 16 + 12, 'zone');

            // Create the answer in a random coordinate
            var coords = rand2(16, 10 * 16, 16, 18 * 16);
            ans = this.add.text(coords.x, coords.y, (n1 + n2).toString(), {
                fontSize: '20px',
                fontFamily: 'Monospace',
                fill: '#fff',
                backgroundColor: '#000'
            });

            // Enable physics for the answer object
            this.physics.world.enable(ans);

            // Player can pick up the answer object and carry it around
            this.physics.add.overlap(player, ans, function (player, ans) {
                if (!playerCarrying) {
                    playerCarrying = ans;
                } else if (playerCarrying === ans) {
                    ans.setX(player.getCenter().x);
                    ans.setY(player.getCenter().y);
                }
            }, null, this);

            // As soon as the answer overlaps with the correct drop zone,
            // it is destroyed and a new one with green font is created.
            // This was done this way because of engine limitations.
            this.physics.add.overlap(zone, ans, function (ans, zone) {
                playerCarrying = null;

                // Destroy the zone so that success cannot be decremented more than once
                zone.destroy();

                // Get the current player coordinates
                var coords = player.getCenter();

                // Recreate the answer object with green font
                this.add.text(coords.x, coords.y, ans.text, {
                    fontSize: '20px',
                    fontFamily: 'Monospace',
                    fill: '#0f0',
                    backgroundColor: '#000'
                });

                // Destroy the current answer object
                ans.destroy();

                success -= 1;
                if (!success) {
                    // Flash the camera so that the player notices the gate to the next room
                    this.cameras.main.flash();

                    // Set the gate visible
                    gates.children.entries[0].setVisible(true);
                }
            }, null, this); // DONT FORGET THIS!!!

            // Do not let the answers go through walls (Does it even work?)
            this.physics.add.collider(walls, ans);
        }

        // --------------------------------------------------------------------------------------
        // ------------------------------=[ ROOM 2 ]=--------------------------------------------
        // --------------------------------------------------------------------------------------
        var baseX = 20 * 16;
        var success2 = 4;

        text2 = this.add.text(3 + 20 * 16, -22, 'Room 2: Complete the subtractions', {
            fontSize: '16px',
            fill: '#ddd',
            fontFamily: 'Droid Sans',
            backgroundColor: '#88f'
        }).setVisible(false);

        // Equations
        var questions2 = [];
        var answers2 = [];
        zone2 = this.physics.add.staticGroup();
        for (var i = 0; i < 4; i++) {

            // Generate two random numbers between 1-100
            n1 = rand();
            n2 = rand();
            while (n1 <= n2) {
                n1 = rand();
                n2 = rand();
            }

            // Print the equation on the floor
            question = this.add.text(baseX + 6 * 16, (2 + 5 * i) * 16, n1.toString() + ' - ' + n2.toString() + ' =', {
                fontSize: '20px',
                fontFamily: 'Monospace',
                fill: '#fff'
            }).setVisible(false);
            questions2[i] = question;

            // Drop zone for the answer
            zone2.create(baseX + 14 * 16, (2 + 5 * i) * 16 + 12, 'zone').setVisible(false);

            // Create the answer in a random coordinate
            var coords = rand2(baseX + 16, baseX + 10 * 16, 16, 18 * 16);
            ans = this.add.text(coords.x, coords.y, (n1 - n2).toString(), {
                fontSize: '20px',
                fontFamily: 'Monospace',
                fill: '#fff',
                backgroundColor: '#000'
            }).setVisible(false);
            answers2[i] = ans;

            // Enable physics for the answer object
            this.physics.world.enable(ans);

            // Player can pick up the answer object and carry it around
            this.physics.add.overlap(player, ans, function (player, ans) {
                if (!playerCarrying) {
                    playerCarrying = ans;
                } else if (playerCarrying === ans) {
                    ans.setX(player.getCenter().x);
                    ans.setY(player.getCenter().y);
                }
            }, null, this);

            // As soon as the answer overlaps with the correct drop zone,
            // it is destroyed and a new one with green font is created.
            // This was done this way because of engine limitations.
            this.physics.add.overlap(zone2.children.entries[i], ans, function (zone, ans) {
                playerCarrying = null;

                // Destroy the zone so that success cannot be decremented more than once
                zone.destroy();

                // Get the current player coordinates
                var coords = player.getCenter();

                // Recreate the answer object with green font
                this.add.text(coords.x, coords.y, ans.text, {
                    fontSize: '20px',
                    fontFamily: 'Monospace',
                    fill: '#0f0',
                    backgroundColor: '#000'
                });

                // Destroy the current answer object
                ans.destroy();

                success2 -= 1;
                if (!success2) {
                    // Flash the camera so that the player notices the gate to the next room
                    this.cameras.main.flash();

                    // Set the gate visible
                    gates.children.entries[1].setVisible(true);
                }
            }, null, this); // DONT FORGET THIS!!!

            // Do not let the answers go through walls (Does it even work?)
            this.physics.add.collider(walls, ans);
        }

        // --------------------------------------------------------------------------------------
        // ------------------------------=[ ROOM 3 ]=--------------------------------------------
        // --------------------------------------------------------------------------------------
        text3 = this.add.text(3 + 40 * 16, -22, 'Room 3: Complete the equations', {
            fontSize: '16px',
            fill: '#ddd',
            fontFamily: 'Droid Sans',
            backgroundColor: '#88f'
        }).setVisible(false);

        var success3 = 4;
        var baseX_2 = 40 * 16;

        // Equations
        var questions3 = [];
        var answers3 = [];
        zone3 = this.physics.add.staticGroup();
        for (var i = 0; i < 4; i++) {

            // First two equations are addition, the remaining two are subtractions
            if (i < 2) {
                var op = ' + ';
                // Generate two random numbers between 1-100
                n1 = rand();
                n2 = rand();
                while (n1 + n2 > 100) {
                    n1 = rand();
                    n2 = rand();
                }
                var result = n1 + n2;
            } else {
                var op = ' - ';
                // Generate two random numbers between 1-100
                n1 = rand();
                n2 = rand();
                while (n1 <= n2) {
                    n1 = rand();
                    n2 = rand();
                }
                var result = n1 - n2;
            }

            if (i % 2) {
                var qstring = '  ' + op + n2.toString() + ' = ' + result.toString();
                var dropZoneX = baseX_2 + 7 * 16;
            } else {
                var qstring = n1.toString() + op + '  ' + ' = ' + result.toString();
                var dropZoneX = baseX_2 + 11 * 16;
            }

            // Print the equation on the floor
            question = this.add.text(baseX_2 + 6 * 16, (2 + 5 * i) * 16, qstring, {
                fontSize: '20px',
                fontFamily: 'Monospace',
                fill: '#fff'
            }).setVisible(false);
            questions3[i] = question;

            // Drop zone for the answer
            zone3.create(dropZoneX, (2 + 5 * i) * 16 + 12, 'zone').setVisible(false);

            // Create the answer in a random coordinate
            var coords = rand2(baseX_2 + 3 * 16, baseX_2 + 17 * 16, 9 * 16, 11 * 16);
            ans = this.add.text(coords.x, coords.y, (i % 2) ? n1.toString() : n2.toString(), {
                fontSize: '20px',
                fontFamily: 'Monospace',
                fill: '#fff',
                backgroundColor: '#000'
            }).setVisible(false);
            answers3[i] = ans;

            // Enable physics for the answer object
            this.physics.world.enable(ans);

            // Player can pick up the answer object and carry it around
            this.physics.add.overlap(player, ans, function (player, ans) {
                if (!playerCarrying) {
                    playerCarrying = ans;
                } else if (playerCarrying === ans) {
                    ans.setX(player.getCenter().x);
                    ans.setY(player.getCenter().y);
                }
            }, null, this);

            // As soon as the answer overlaps with the correct drop zone,
            // it is destroyed and a new one with green font is created.
            // This was done this way because of engine limitations.
            this.physics.add.overlap(zone3.children.entries[i], ans, function (zone, ans) {
                playerCarrying = null;

                // Destroy the zone so that success cannot be decremented more than once
                zone.destroy();

                // Get the current player coordinates
                var coords = player.getCenter();

                // Recreate the answer object with green font
                this.add.text(coords.x, coords.y, ans.text, {
                    fontSize: '20px',
                    fontFamily: 'Monospace',
                    fill: '#0f0',
                    backgroundColor: '#000'
                });

                // Destroy the current answer object
                ans.destroy();

                success3 -= 1;
                if (!success3) {
                    // Flash the camera so that the player notices the gate to the next room
                    this.cameras.main.flash();

                    // Set the gate visible
                    gates.children.entries[2].setVisible(true);
                }
            }, null, this); // DONT FORGET THIS!!!

            // Do not let the answers go through walls (Does it even work?)
            this.physics.add.collider(walls, ans);
        }

        // --------------------------------------------------------------------------------------
        // --------------------------=[ ROOM TRANSITIONS ]---------------------------------------
        // --------------------------------------------------------------------------------------

        // Saving clear times of rooms
        var initTime = new Date();

        // Collider for room 1->2
        this.physics.add.collider(player, gates.children.entries[0], function (player, gate) {
            if (!success) {
                success = 1;

                // Get clear time
                var currTime = new Date();
                clearTimes[0][0] = (currTime - initTime) / 1000;
                initTime = currTime;

                this.cameras.main.fadeIn(600);
                text1.destroy();

                // Get the player across
                player.x += 16 * 3;

                // Make next room's challenge visible
                text2.setVisible(true);
                for (var i = 0; i < 4; i++) {
                    questions2[i].setVisible(true);
                    answers2[i].setVisible(true);
                    zone2.children.entries[i].setVisible(true);
                }
            }
        }, null, this);

        // Collider for room 2->3
        this.physics.add.collider(player, gates.children.entries[1], function (player, gate) {
            if (!success2) {
                success2 = 1;

                // Get clear time
                currTime = new Date();
                clearTimes[0][1] = (currTime - initTime) / 1000;
                initTime = currTime;

                this.cameras.main.fadeIn(600);
                text2.destroy();

                // Get the player across
                player.x += 16 * 3;

                // Make next room's challenge visible
                text3.setVisible(true);
                for (var i = 0; i < 4; i++) {
                    questions3[i].setVisible(true);
                    answers3[i].setVisible(true);
                    zone3.children.entries[i].setVisible(true);
                }
            }
        }, null, this);

        // Collide player with the last gate to go to the next level
        this.physics.add.collider(player, gates.children.entries[2], function (player, gate) {
            if (!success3) {
                success3 = 1;

                // Get clear time
                currTime = new Date();
                clearTimes[0][2] = (currTime - initTime) / 1000;
                initTime = currTime;
                // console.log(clearTimes[0]);

                this.add.text(50 * 16, 8 * 16, 'Level Complete!', {
                    fontSize: '32px',
                    fill: '#cfc',
                    fontFamily: 'Droid Sans',
                    backgroundColor: '#222'
                });
                this.cameras.main.fadeOut(1000);
                this.scene.transition({
                    target: 'level2',
                    duration: 2000,
                    moveBelow: true
                });
            }
        }, null, this);
    },

    update: function update() {
        // Touch controls
        if (this.input.activePointer.isDown) {
            if (this.input.activePointer.x - gameWidth / 2 < 0) {
                player.flipX = true;
            } else {
                player.flipX = false;
            }
            player.setVelocityX((this.input.activePointer.x - gameWidth / 2));
            player.setVelocityY((this.input.activePointer.y - gameHeight / 2));
            player.anims.play('right', true);
        } else {
            player.setVelocityX(0);
            player.setVelocityY(0);
            player.anims.play('wait', true);
        }
    },
})
