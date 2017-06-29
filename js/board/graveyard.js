game.Graveyard = me.Entity.extend({
    init: function (x, y, width, height, rows, columns) {

        this.numRows = rows;
        this.numColumns = columns;

        // array of graves
        this.graves = [];
        this.graveIndex = 0;

        this._super(me.Entity, "init", [x, y, {
            width : width,
            height : height
        }]);

        var grave;
        var graveX = 0;
        var graveY = 0;
        var graveWidth = width / this.numColumns;
        var graveHeight = height / this.numRows;
        for (r = 0; r < this.numRows; r++) {
            for (c = 0; c < this.numColumns; c++) {
                grave = new game.Grave(graveX + x, graveY + y, graveWidth, graveHeight, '#aaa', r, c);
                me.game.world.addChild(grave, 1);
                this.graves.push(grave);
                graveX += graveWidth;
            }
            graveY += graveHeight;
            graveX = 0;
        }
    },

    update: function (dt) {
        this._super(me.Entity, "update", [dt]);
        return true;
    },

    draw: function (renderer) {
        renderer.setColor('#444');
        renderer.fillRect(
            this.pos.x - 2,
            this.pos.y - 2,
            this.width + 4, this.height + 4);
    },

    addPiece: function (piece) {
        // get the next open space and add this piece there.
        if (this.graveIndex >= this.graves.length) {
            return;
        }

        this.graves[this.graveIndex].addPiece(piece);

        this.graveIndex++;
    },

    revivePiece: function (pieceType) {

    }
});