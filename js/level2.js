var level2 = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize:

        function level2() {
            Phaser.Scene.call(this, { key: 'level2' });
        },

    preload: function preload() {
        // 60x20 16px tiles
        this.load.image('ground', 'assets/ground.png');
        this.load.image('box','assets/box.png')
        this.load.image('mark', 'assets/place.png');
        this.load.image('select', 'assets/select.png');
        this.load.image('mark_red','assets/place2.png')
        // Need to load walls seperately for collision purposes
        // 60x2 16px tiles
        this.load.image('walls_upper', 'assets/walls_upper.png');
        this.load.image('walls_lower', 'assets/walls_upper.png');
        this.load.image('walls_lower', 'assets/walls_upper.png');
        this.load.image('book1', 'assets/spellbook_03a.png');
        this.load.image('book2', 'assets/spellbook_03b.png');
        this.load.image('book3', 'assets/spellbook_03c.png');
        this.load.image('book4', 'assets/spellbook_03d.png');
        this.load.image('book5', 'assets/spellbook_03e.png');
        this.load.image('key1', 'assets/key_02a.png');
        this.load.image('key2', 'assets/key_02b.png');
        this.load.image('key3', 'assets/key_02c.png');
        this.load.image('key4', 'assets/key_02d.png');
        this.load.image('key5', 'assets/key_02e.png');
        this.load.image('staff1', 'assets/staff_03a.png');
        this.load.image('staff2', 'assets/staff_03b.png');
        this.load.image('staff3', 'assets/staff_03c.png');
        this.load.image('staff4', 'assets/staff_03d.png');
        this.load.image('staff5', 'assets/staff_03e.png');
        // 1x18 16px tiles
        this.load.image('walls_left', 'assets/walls_left.png');
        this.load.image('walls_right', 'assets/walls_right.png');
        // 2x18 16px tiles
        this.load.image('walls_mid', 'assets/walls_mid.png');
        // Load the player as a spritesheet
        this.load.spritesheet('player', 'assets/player.png', { frameWidth: 16, frameHeight: 19 });


        this.load.spritesheet('undead0', 'assets/undead_0.png', { frameWidth: 16, frameHeight: 12});
        this.load.spritesheet('undead1', 'assets/undead_1.png', { frameWidth: 16, frameHeight: 16});
        this.load.spritesheet('undead2', 'assets/undead_2.png', { frameWidth: 16, frameHeight: 16});
        this.load.spritesheet('undead3', 'assets/undead_3.png', { frameWidth: 16, frameHeight: 16});
        this.load.spritesheet('undead4', 'assets/undead_4.png', { frameWidth: 32, frameHeight: 27});
        this.load.spritesheet('orc0', 'assets/orc_0.png', { frameWidth: 16, frameHeight: 19});
        this.load.spritesheet('orc1', 'assets/orc_1.png', { frameWidth: 16, frameHeight: 18});
        this.load.spritesheet('orc2', 'assets/orc_2.png', { frameWidth: 16, frameHeight: 16});
        this.load.spritesheet('orc3', 'assets/orc_3.png', { frameWidth: 16, frameHeight: 12});
        this.load.spritesheet('orc4', 'assets/orc_4.png', { frameWidth: 32, frameHeight: 28});
        this.load.spritesheet('demon0', 'assets/demon_0.png', { frameWidth: 16, frameHeight: 12});
        this.load.spritesheet('demon1', 'assets/demon_1.png', { frameWidth: 16, frameHeight: 21 });
        this.load.spritesheet('demon2', 'assets/demon_2.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('demon3', 'assets/demon_3.png', { frameWidth: 16, frameHeight: 17 });
        this.load.spritesheet('demon4', 'assets/demon_4.png', { frameWidth: 32, frameHeight: 32});
        // 16px ladder
        this.load.image('ladder', 'assets/ladder.png');
    },

    create: function create() {
        stage = 'Stage1'


        text3 = this.add.text(3 + 40 * 16, -22, 'Room 3: Pick the correct objects', {
            fontSize: '16px',
            fill: '#ddd',
            fontFamily: 'Droid Sans',
            //backgroundColor: '#88f'
        })
        text2 = this.add.text(3 + 20 * 16, -22, 'Room 2: Put the boxes in ascending order', {
            fontSize: '16px',
            fill: '#ddd',
            fontFamily: 'Droid Sans',
            //backgroundColor: '#88f'
        })
        text1 = this.add.text(3, -22, 'Room 1: Select the number of creatures', {
            fontSize: '16px',
            fill: '#ddd',
            fontFamily: 'Droid Sans',
            //backgroundColor: '#88f'
        });


        // Add ground
        this.add.image(60*16 / 2, 20*16 / 2, 'ground');

        // Add walls
        walls = this.physics.add.staticGroup();
        walls.create(60 * 16 / 2, 8, 'walls_upper');
        walls.create(2, 20 * 16 / 2, 'walls_left');
        walls.create(60 * 16 - 8, 20 * 16 / 2, 'walls_right');
        walls.create(20 * 16, 20 * 16 / 2-8 , 'walls_mid');
        walls.create(40 * 16, 20 * 16 / 2-8, 'walls_mid');
        walls.create(60 * 16 / 2, 20*16 - 8, 'walls_lower');

        // Add ladders
        ladder1 = this.physics.add.staticGroup();
        ladder1.create(19 * 16 - 8, 20 * 16 / 2, 'ladder');
        ladder2 = this.physics.add.staticGroup();
        ladder2.create(39 * 16 - 8, 20 * 16 / 2, 'ladder');

        // Add level ending ladder
        laddersEnd = this.physics.add.staticGroup();
        laddersEnd.create(59*16-8, 20*16/2, 'ladder');


        //Stage1

        question1 = this.add.text(16*2, 6*16, '1', {fontSize: '20px',fontFamily: 'Droid Sans Mono',fill: '#fff'});
        question2 = this.add.text(16*8, 6*16, '1', {fontSize: '20px',fontFamily: 'Droid Sans Mono',fill: '#fff'});
        question3 = this.add.text(16*14, 6*16, '1',{fontSize: '20px',fontFamily: 'Droid Sans Mono',fill: '#fff'});
        mark_number = this.physics.add.staticGroup();
        for( var i =0;i<3;i++){
            mark_number.create(i*16*6+1*16+8,8*16+8,'mark')
        }
        for( var i =0;i<3;i++){
            mark_number.create(i*16*6+ 3*16+8,8*16+8,'mark')
        }
        marks = mark_number.children.entries
        for(var i=0;i<3;i++){
            marks[i].d = 'up'
            if(i==0) marks[i].q = question1
            if(i==1) marks[i].q = question2
            if(i==2) marks[i].q = question3
        }
        for(var i=0;i<3;i++){
            marks[i+3].d = 'down'
            if(i==0) marks[i+3].q = question1
            if(i==1) marks[i+3].q = question2
            if(i==2) marks[i+3].q = question3

        }
        //Stage2
        mark = this.physics.add.staticGroup();
        for( var i =0;i<5;i++){
            mark.create(i*32+ 25*16+8,5*16+8,'mark')
        }

        ind = [0,1,2,3,4]
        for (var i = ind.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = ind[i];
            ind[i] = ind[j];
            ind[j] = temp;
        }

        box = this.physics.add.group()
        for( var i =0;i<ind.length;i++){
            box.create(ind[i]*32+ 25*16+8,10*16+8,'box')
        }


        boxes = box.children.entries
        boxes[0].number = this.add.text(boxes[0].x-8,boxes[0].y-24, '10', {fontSize: '12px',fontFamily: 'Droid Sans Mono',fill: '#fff'})
        boxes[1].number = this.add.text(boxes[1].x-8,boxes[1].y-24, '20', {fontSize: '12px',fontFamily: 'Droid Sans Mono',fill: '#fff'})
        boxes[2].number = this.add.text(boxes[2].x-8,boxes[2].y-24, '30', {fontSize: '12px',fontFamily: 'Droid Sans Mono',fill: '#fff'})
        boxes[3].number = this.add.text(boxes[3].x-8,boxes[3].y-24, '40', {fontSize: '12px',fontFamily: 'Droid Sans Mono',fill: '#fff'})
        boxes[4].number = this.add.text(boxes[4].x-8,boxes[4].y-24, '50', {fontSize: '12px',fontFamily: 'Droid Sans Mono',fill: '#fff'})

        
        // Add player
        player = this.physics.add.sprite(2*16, 10*16, 'player');



        //7 demon
        function rand() {
                return Math.floor((Math.random() * 9) + 1);
        }
        demon_type = ['demon0','demon1','demon2','demon3','demon4']
        demons = []
        demon_size = rand()
        //console.log(demon_size)
        for(var i = 0;i<demon_size ;i++){
            type = rand()%5
            if(i > 4)
                demons.push(this.physics.add.sprite(14*16+(i%4)*16,4*16,demon_type[type]))
            else
                demons.push(this.physics.add.sprite(14*16+(i%4)*16,2*16,demon_type[type]))
        }
        undead_type = ['undead0','undead1','undead2','undead3','undead4']
        undeads = []
        undead_size = rand()
        //console.log(undead_size)
        for(var i = 0;i<undead_size ;i++){
            type = rand()%5
            if(i > 4)
                undeads.push(this.physics.add.sprite(8*16+(i%4)*16,4*16,undead_type[type]))
            else
                undeads.push(this.physics.add.sprite(8*16+(i%4)*16,2*16,undead_type[type]))
        }
        orc_type = ['orc1','orc2','orc3','orc4']
        orcs = []
        orc_size = rand()
        //console.log(orc_size)
        for(var i = 0;i<orc_size ;i++){
            type = rand()%4
            if(i > 4)
                orcs.push(this.physics.add.sprite(2*16+(i%4)*16,4*16,orc_type[type]))
            else
                orcs.push(this.physics.add.sprite(2*16+(i%4)*16,2*16,orc_type[type]))
        }


        //Stage 3
        obj = this.physics.add.staticGroup();

        l = ['1st','2nd','3rd','4th','5th']
        obj_choice = []
        obj_choice.push(l[rand()%5])
        obj_choice.push(l[rand()%5])
        obj_choice.push(l[rand()%5])
        this.add.text(43*16-8,4*16-8 , obj_choice[0], {fontSize: '12px',fontFamily: 'Droid Sans Mono',fill: '#fff'})
        obj.create(47 * 16 - 8, 4 * 16 , 'key1');
        obj.create(49 * 16 - 8, 4 * 16 , 'key2');
        obj.create(51 * 16 - 8, 4 * 16 , 'key3');
        obj.create(53 * 16 - 8, 4 * 16 , 'key4');  
        obj.create(55 * 16 - 8, 4 * 16 , 'key5');
        this.add.text(43*16-8,8*16-8 , obj_choice[1], {fontSize: '12px',fontFamily: 'Droid Sans Mono',fill: '#fff'})
        obj.create(47 * 16 - 8, 8 * 16, 'book1');
        obj.create(49 * 16 - 8, 8 * 16, 'book2');
        obj.create(51 * 16 - 8, 8 * 16, 'book3');
        obj.create(53 * 16 - 8, 8 * 16, 'book4');
        obj.create(55 * 16 - 8, 8 * 16, 'book5');
        this.add.text(43*16-8,12*16-8 , obj_choice[2], {fontSize: '12px',fontFamily: 'Droid Sans Mono',fill: '#fff'})
        obj.create(47 * 16 - 8, 12 * 16, 'staff1');
        obj.create(49 * 16 - 8, 12 * 16, 'staff2');
        obj.create(51 * 16 - 8, 12 * 16, 'staff3');
        obj.create(53 * 16 - 8, 12 * 16, 'staff4');
        obj.create(55 * 16 - 8, 12 * 16, 'staff5');
        objs = obj.children.entries
        for (var i = 0; i < objs.length; i++) {
            objs[i].mark = this.physics.add.staticGroup();
            objs[i].mark.create(objs[i].x,objs[i].y,'select')
            objs[i].mark.children.entries[0].setVisible(false);
        }

        // Add player animations
        this.anims.create({key: 'right',frames: this.anims.generateFrameNumbers('player', { start: 1, end: 3 }),frameRate: 10,})
         this.anims.create({key: 'wait_o1',frames: this.anims.generateFrameNumbers('orc1',{ start: 0, end: 3}),frameRate: 5,})
         this.anims.create({key: 'wait_o2',frames: this.anims.generateFrameNumbers('orc2',{ start: 0, end: 3}),frameRate: 5,})
         this.anims.create({key: 'wait_o3',frames: this.anims.generateFrameNumbers('orc3',{ start: 0, end: 3}),frameRate: 5,})
         this.anims.create({key: 'wait_o4',frames: this.anims.generateFrameNumbers('orc4',{ start: 0, end: 3}),frameRate: 5,})
         this.anims.create({key: 'wait_d0',frames: this.anims.generateFrameNumbers('demon0',{ start: 0, end: 3}),frameRate: 5,})
         this.anims.create({key: 'wait_d1',frames: this.anims.generateFrameNumbers('demon1',{ start: 0, end: 3}),frameRate: 5,})
         this.anims.create({key: 'wait_d2',frames: this.anims.generateFrameNumbers('demon2',{ start: 0, end: 3}),frameRate: 5,})
         this.anims.create({key: 'wait_d3',frames: this.anims.generateFrameNumbers('demon3',{ start: 0, end: 3}),frameRate: 5,})
         this.anims.create({key: 'wait_d4',frames: this.anims.generateFrameNumbers('demon4',{ start: 0, end: 3}),frameRate: 5,})
         this.anims.create({key: 'wait_u0',frames: this.anims.generateFrameNumbers('undead0',{ start: 0, end: 3}),frameRate: 5,})
         this.anims.create({key: 'wait_u1',frames: this.anims.generateFrameNumbers('undead1',{ start: 0, end: 3}),frameRate: 5,})
         this.anims.create({key: 'wait_u2',frames: this.anims.generateFrameNumbers('undead2',{ start: 0, end: 3}),frameRate: 5,})
         this.anims.create({key: 'wait_u3',frames: this.anims.generateFrameNumbers('undead3',{ start: 0, end: 3}),frameRate: 5,})
         this.anims.create({key: 'wait_u4',frames: this.anims.generateFrameNumbers('undead4',{ start: 0, end: 3}),frameRate: 5,})
         this.anims.create({key: 'wait_p',frames: [{ key: 'player', frame: 0 }],frameRate: 10})


        


        //Colliders
        this.physics.add.collider(player,box,this.boxPlaced);
        this.physics.add.collider(box,box,this.boxFix);
        this.physics.add.collider(player, walls);
 

        this.physics.add.collider(player, ladder1, this.nextStage1, null, this);
        this.physics.add.collider(player, ladder2, this.nextStage2, null, this);
        this.physics.add.collider(player, laddersEnd, this.nextLevel, null, this);

        this.physics.add.collider(player,obj,this.objTouched);

        // Camera controls
        this.cameras.main.startFollow(player, true);

        //Stage
        var initTime = new Date();
    },

    update: function update() {
        // Touch controls
        if (this.input.activePointer.isDown) {
            if (this.input.activePointer.x - gameWidth / 2 < 0) {
                player.flipX = true;
            } else {
                player.flipX = false;
            }
            player.setVelocityX((this.input.activePointer.x - gameWidth / 2) );
            player.setVelocityY((this.input.activePointer.y - gameHeight / 2));
            player.anims.play('right', true);
        } else {
            player.setVelocityX(0);
            player.setVelocityY(0);
            player.anims.play('wait_p', true);
            
        
        }
        //orc0.anims.play('wait_o0', true);



        for (var i = 0; i < orcs.length; i++) {
            //console.log(orcs.length)
            s = 'wait_o'+orcs[i].texture.key[orcs[i].texture.key.length-1]
            //console.log(s)
            orcs[i].anims.play(s,true)
        }
        for (var i = 0; i < demons.length; i++) {
            s = 'wait_d'+demons[i].texture.key[demons[i].texture.key.length-1]
            demons[i].anims.play(s,true)
        }
        for (var i = 0; i < undeads.length; i++) {
            s = 'wait_u'+undeads[i].texture.key[undeads[i].texture.key.length-1]
            undeads[i].anims.play(s,true)
        }

        //Boxes

        box.setVelocityX(0);
        box.setVelocityY(0);

        if(stage == 'Stage1'){
            mark_numbers = mark_number.children.entries
            for (var i = mark_numbers.length - 1; i >= 0; i--) {
                diffX = Math.abs(player.x - mark_numbers[i].x)
                diffY = Math.abs(player.y - mark_numbers[i].y)
                if(diffX < 8 && diffY < 8 && mark_numbers[i].texture.key != 'mark_red'){ // Yellow to red
                        if(player.mark == undefined || player.mark != mark_numbers[i])
                        {
                            player.mark = mark_numbers[i]
                            player.mark.setTexture('mark_red')
                        }
                        else player.mark.setTexture('mark_red')
                        number = player.mark.q.text
                        if(player.mark.d == 'up' && number < 9)
                            player.mark.q.setText(String(parseInt(number)+1))
                        if(player.mark.d == 'down' && number > 0)
                            player.mark.q.setText(String(parseInt(number)-1))
                }
                else if( player.mark != undefined  && (Math.abs(player.mark.x - player.x) > 12 || Math.abs(player.mark.y - player.y) >12 )&& player.mark.texture.key != 'mark'){
                    player.mark.setTexture('mark')
                }
                    
            }
        } 

    },
    boxFix : function(box1,box2){

        box1.number.setX(box1.x-8)
        box1.number.setY(box1.y-24)
        box2.number.setX(box2.x-8)
        box2.number.setY(box2.y-24)
    
    },
    boxPlaced: function(player,box){

        box.number.setX(box.x-8)
        box.number.setY(box.y-24)
        childs = mark.children.entries
        for (var i = childs.length - 1; i >= 0; i--) {

            diffX = Math.abs(box.x - childs[i].x)
            diffY = Math.abs(box.y - childs[i].y)
            if(diffX < 8 && diffY < 8 && childs[i].texture.key != 'mark_red'){ // Yellow to red
                    if(box.mark == undefined || box.mark != childs[i])
                    {
                        box.mark = childs[i]
                        box.mark.setTexture('mark_red')
                    }
                    else box.mark.setTexture('mark_red')
            }

            else if( box.mark != undefined  && (Math.abs(box.mark.x - box.x) > 8 || Math.abs(box.mark.y - box.y) >8 )&& box.mark.texture.key != 'mark'){
                box.mark.setTexture('mark')
            }
                
        }
        boxesPlaced = true
        for (var i = 0; i < childs.length; i++) {
                   if(childs[i].texture.key != 'mark_red')
                        boxesPlaced = false
        }       

        
   
    },
    objTouched: function(player,obj){
        if(obj.texture.key.includes('key')){
            if(player.key ==undefined){
                player.key = obj
                obj.mark.children.entries[0].setVisible(true);
            }
            else{
                player.key.mark.children.entries[0].setVisible(false)
                player.key = obj
                obj.mark.children.entries[0].setVisible(true)
            }
            
            console.log("key")
        }
        else if(obj.texture.key.includes('book')){
            if(player.book ==undefined){
                player.book = obj
                obj.mark.children.entries[0].setVisible(true);
            }
            else{
                player.book.mark.children.entries[0].setVisible(false)
                player.book = obj
                obj.mark.children.entries[0].setVisible(true)
            }
            
            console.log("book")
        }
        else if(obj.texture.key.includes('staff')){
            if(player.staff ==undefined){
                player.staff = obj
                obj.mark.children.entries[0].setVisible(true);
            }
            else{
                player.staff.mark.children.entries[0].setVisible(false)
                player.staff = obj
                obj.mark.children.entries[0].setVisible(true)
            }
            
            console.log("staff")
        }
    },
    nextStage1: function(player,ladder){
        if(question1.text == String(orcs.length) && question2.text == String(undeads.length) && question3.text == String(demons.length)){
            this.cameras.main.fadeIn(600);
            player.x += 16 * 3;
            stage = 'Stage2'   
            var currTime = new Date();
            //clearTimes[3] = (currTime - initTime) / 1000;
            initTime = currTime;         
        }

    },
    nextStage2: function (player, ladders) {
        
        if(boxesPlaced)
        {
            childs = box.children.entries
            if(childs[0].x < childs[1].x && childs[1].x < childs[2].x && childs[2].x < childs[3].x && childs[3].x < childs[4].x){ //correct order of boxes
                this.cameras.main.fadeIn(600);
                player.x += 16 * 3;
                console.log(box.children.entries[0].x)      
                StageCompleted = false 
                stage = 'Stage3'
                var currTime = new Date();
                //clearTimes[4] = (currTime - initTime) / 1000;
                initTime = currTime;   

            }

        }
        else{ //boxes not placed
           this.cameras.main.fadeIn(600);
           player.x -= 6*16
           player.y += 2*16
           
        }
    },

    nextLevel: function nextLevel(player, laddersEnd) {
        if (player.key.texture.key == 'key'+obj_choice[0][0] && player.book.texture.key == 'book'+obj_choice[1][0] && player.staff.texture.key == 'staff'+obj_choice[2][0]){
                var currTime = new Date();
                //clearTimes[5] = (currTime - initTime) / 1000;
                initTime = currTime;  
                this.add.text(50 * 16, 8 * 16, 'Level Complete!', {
                    fontSize: '32px',
                    fill: '#cfc',
                    fontFamily: 'Droid Sans'
                });
                this.cameras.main.fadeOut(1000);
                this.scene.transition({
                    target: 'level3',
                    duration: 2000,
                    moveBelow: true
                });    }
    }

})
