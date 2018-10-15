function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

var level3 = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize:

        function level3() {
            Phaser.Scene.call(this, { key: 'level3' });
        },

    preload: function preload() {
        // 80x20 16px tiles
        this.load.image('ground', 'assets/ground.png');
        // Need to load walls seperately for collision purposes
        // 80x2 16px tiles
        this.load.image('walls_upper', 'assets/walls_upper.png');
        this.load.image('walls_lower', 'assets/walls_lower.png');
        // 1x18 16px tiles
        this.load.image('walls_left', 'assets/walls_left.png');
        this.load.image('walls_right', 'assets/walls_right.png');
        // 2x18 16px tiles
        this.load.image('walls_mid', 'assets/walls_mid.png');
        // Load the player as a spritesheet
        this.load.spritesheet('player', 'assets/player.png', { frameWidth: 16, frameHeight: 19 });
        // 16px ladder
        this.load.image('ladder', 'assets/ladder.png');
        // Menu icon
        this.load.image('menu', 'assets/menu.png');
        // Zone
        this.load.image('mark', 'assets/place.png');
        this.load.image('mark_red','assets/place2.png');
        this.load.image('zone_triangle', 'assets/level3/zone_triangle.png');
        this.load.image('zone_rectangle', 'assets/level3/zone_rectangle.png');
        this.load.image('zone_square', 'assets/level3/zone_square.png');
        this.load.image('zone_circle', 'assets/level3/zone_circle.png');
        this.load.image('zone_r', 'assets/level3/red_zone.png');
        this.load.image('zone_b', 'assets/level3/blue_zone.png');
        this.load.image('zone_g', 'assets/level3/green_zone.png');
        //Shapes
        this.load.image('triangle', 'assets/level3/triangle.png');
        this.load.image('rectangle', 'assets/level3/rectangle.png');
        this.load.image('square', 'assets/level3/square.png');
        this.load.image('circle', 'assets/level3/circle.png');
        //Colors
        this.load.image('circle_r', 'assets/level3/pearl_red.png');
        this.load.image('circle_b', 'assets/level3/pearl_blue.png');
        this.load.image('circle_g', 'assets/level3/pearl_green.png');
        this.load.image('rect_r', 'assets/level3/book_red.png');
        this.load.image('rect_b', 'assets/level3/book_blue.png');
        this.load.image('rect_g', 'assets/level3/book_green.png');
    },

    create: function create() {
        // Add ground
        this.add.image(60 * 16 / 2, 20 * 16 / 2, 'ground');

        // Add ladders
        ladders = this.physics.add.staticGroup();
        ladders.create(19 * 16 - 8, 20 * 16 / 2, 'ladder').setVisible(false); // room 1->2
        ladders.create(39 * 16 - 8, 20 * 16 / 2, 'ladder').setVisible(false); // room 2->3
        ladders.create(59 * 16 - 8, 20 * 16 / 2, 'ladder').setVisible(false); // room 3->4
        
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
        my_cameras = this.cameras.main
        my_cameras.startFollow(player, true);

        // --------------------------------------------------------------------------------------
        // ------------------------------=[ ROOM 1 ]=--------------------------------------------
        // --------------------------------------------------------------------------------------
        var success = 4;
        text1 = this.add.text(3, -22, "Room 1: Let's learn basic shapes! ", {
            fontSize: '16px',
            fill: '#fff',
            fontFamily: 'Droid Sans',
            backgroundColor: '#000'
        });

        
        shape = this.physics.add.group();
        zone = this.physics.add.staticGroup();

        var shape_names = ["circle", "square", "rectangle", "triangle"];
        var arr = shuffle([0, 1, 2, 3]);

        // Creating shapes
        for (var i = 0; i < 4; i++) {
            shape.create(4 * 16 - 8 + arr[i] * 16 * 4, 11*16 / 2, shape_names[i]);

            // Drop zone for the answer
            zone.create(4 * 16 + i * 16 * 4, 16 * 16, 'zone_' + shape_names[i]);

            // Player can pick up the answer object and carry it around
            this.physics.add.overlap(player, shape, function (player, shape) {
                shape.setX(player.getCenter().x);
                shape.setY(player.getCenter().y);
            }, null, this);

            // As soon as the answer overlaps with the correct drop zone,
            // it is destroyed and a new one with green font is created.
            // This was done this way because of engine limitations.
            this.physics.add.overlap(zone.children.entries[i], shape.children.entries[i], function (zone, shape) {

                // Destroy the zone so that success cannot be decremented more than once
                zone.destroy();

                // Get the current player coordinates
                var coords = player.getCenter();

                // Recreate the answer object with green font
                this.add.image(coords.x, coords.y, shape.texture.key);

                // Destroy the current answer object
                shape.destroy();

                success -= 1;
                if (!success) {
                    // Flash the camera so that the player notices the ladder to the next room
                    this.cameras.main.flash();

                    // Set the ladder visible
                    ladders.children.entries[0].setVisible(true);
                }
            }, null, this); // DONT FORGET THIS!!!

            // Do not let the answers go through walls (Does it even work?)
            this.physics.add.collider(walls, shape);
        }

        // --------------------------------------------------------------------------------------
        // ------------------------------=[ ROOM 2 ]=--------------------------------------------
        // --------------------------------------------------------------------------------------
        
        text2 = this.add.text(3 + 20 * 16, -22, 'Room 2: Sort the shapes from small to big', {
            fontSize: '16px',
            fill: '#ddd',
            fontFamily: 'Droid Sans',
            //backgroundColor: '#88f'
        }).setVisible(false)

        mark = this.physics.add.staticGroup();
        for( var i =0;i<3;i++){
            mark.create(i*60+ 25*16+8,5*16+8,'mark')
        }

        var arr = shuffle([0, 60, 120])

        square = this.physics.add.group()
        for( var i = 0; i < arr.length; i++){
            square.create(arr[i] + 25 * 16 + 8,10*16+8,'square').setScale(i+1)
        }

        //Colliders
        this.physics.add.collider(player,square,this.squarePlaced);
        this.physics.add.collider(square,square);
        this.physics.add.collider(player, walls);


        // --------------------------------------------------------------------------------------
        // ------------------------------=[ ROOM 3 ]=--------------------------------------------
        // --------------------------------------------------------------------------------------
        
        text3 = this.add.text(3 + 40 * 16, -22, 'Room 3: Group the color of shapes', {
            fontSize: '16px',
            fill: '#ddd',
            fontFamily: 'Droid Sans',
            //backgroundColor: '#88f'
        }).setVisible(false);

        shape_colors = this.physics.add.group();

        // --------------------------------------------------------------------------------------
        // --------------------------=[ ROOM TRANSITIONS ]---------------------------------------
        // --------------------------------------------------------------------------------------
        // Collider for room 1->2
        this.physics.add.collider(player, ladders.children.entries[0], function (player, ladder) {
            if (!success) {
                this.cameras.main.fadeIn(600);
                text1.destroy();
                player.x += 16 * 3;
                text2.setVisible(true);
            }
        }, null, this);

        // Collider for room 2->3
        this.physics.add.collider(player, ladders.children.entries[1], function (player, ladder){
            if(boxesPlaced){
                this.cameras.main.fadeIn(600);
                player.x += 16
                text2.destroy(); 
                text3.setVisible(true);
            }
        }, null, this);

        // Collide player with the last ladder to go to the next level
        this.physics.add.collider(player, ladders.children.entries[2], function (player, ladder) {
            this.cameras.main.fadeIn(600);
            this.scene.transition({
                target: 'end',
                duration: 250
            })
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

        //Squares
        square.setVelocityX(0);
        square.setVelocityY(0);
    },

    squarePlaced: function(player,square_){

        childs = mark.children.entries
        for (var i = childs.length - 1; i >= 0; i--) {

            diffX = Math.abs(square_.x - childs[i].x)
            diffY = Math.abs(square_.y - childs[i].y)
            if(diffX < 8 && diffY < 8 && childs[i].texture.key != 'mark_red'){ // Yellow to red
                    if(square_.mark == undefined || square_.mark != childs[i])
                    {
                        square_.mark = childs[i]
                        square_.mark.setTexture('mark_red')
                    }
                    else square_.mark.setTexture('mark_red')
            }

            else if( square_.mark != undefined  && (Math.abs(square_.mark.x - square_.x) > 8 || Math.abs(square_.mark.y - square_.y) >8 )&& square_.mark.texture.key != 'mark'){
                square_.mark.setTexture('mark')
            }
                
        }
        boxesPlaced = true
        for (var i = 0; i < childs.length; i++) {
                   if(childs[i].texture.key != 'mark_red')
                        boxesPlaced = false
        }

        if(boxesPlaced){
            childs = square.children.entries
            if(childs[0].x < childs[1].x && childs[1].x < childs[2].x){ //correct order of boxes
                // Flash the camera so that the player notices the ladder to the next room
                my_cameras.flash();
                ladders.children.entries[1].setVisible(true);
            }
        }
    },
})
