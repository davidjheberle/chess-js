var _squares;

game.Board = me.Entity.extend({
    init: function() {
        _squares = [];
        var width = 400;
        var height = 400;
        var x = me.game.viewport.width / 2 - width / 2;
        var y = me.game.viewport.height / 2 - height / 2;
        this._super(me.Entity, "init", [x, y, {
            width : width,
            height : height
        }]);
        var tSquareX = 0;
        var tSquareY = 0;
        var tSquareWidth = width / 8;
        var tSquareHeight = height / 8;
        var tColor;
        var tSquare;
        for (i = 0; i < 8; i++) {
            _squares.push([]);
            for (j = 0; j < 8; j++) {
                if (((j+i) % 2) == 0) {
                    tColor = '#fff';
                } else {
                    tColor = '#000';
                }
                tSquare = new game.Square(tSquareX + x, tSquareY + y, tSquareWidth, tSquareHeight, tColor);
                me.game.world.addChild(tSquare);
                _squares[i].push(tSquare);
                tSquareX += tSquareWidth;
            }
            tSquareY += tSquareHeight;
            tSquareX = 0;
        }
    },

    update: function(dt) {
        this._super(me.Entity, "update", [dt]);
        return true;
    }
});
