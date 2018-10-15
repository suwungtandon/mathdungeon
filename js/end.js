var end = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize:

        function end() {
            Phaser.Scene.call(this, { key: 'end' });
        },

    preload: function preload() {

    },
    create: function create() {
        x = 32;
        y = 32;
        verticalSpace = 16;
        this.add.text(x, y, 'The End', {
            fontSize: '48px',
            fill: '#72e837',
        });
        x += 16
        y += 64;
        this.add.text(x, y, 'Your clear times:');
        y += verticalSpace * 1.5;
        for (var level = 0; level < clearTimes.length; level++) {
            this.add.text(x, y, 'Level ' + (level+1).toString());
            y += verticalSpace * 1.2;
            for (var room = 0; room < clearTimes[level].length; room++) {
                this.add.text(x, y, '\t\t\tRoom ' + (room+1).toString() + ':\t' + clearTimes[level][room].toString());
                y += verticalSpace;
            }
            y += verticalSpace;
        }

    },
    update: function update() {

    },
});