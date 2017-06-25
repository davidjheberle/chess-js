game.Board = me.Entity.extend({
    init: function () {

        // 2d array of squares [row, column]
        this.squares = [];

        var width = 320;
        var height = 320;
        var x = me.game.viewport.width / 2 - width / 2;
        var y = me.game.viewport.height / 2 - height / 2;
        this._super(me.Entity, "init", [x, y, {
            width : width,
            height : height
        }]);

        var square;
        var squareX = 0;
        var squareY = 0;
        var squareWidth = width / 8;
        var squareHeight = height / 8;
        var squareColor;
        for (r = 0; r < 8; r++) {
            this.squares.push([]);
            for (c = 0; c < 8; c++) {
                if (((r+c) % 2) == 0) {
                    squareColor = '#fff';
                } else {
                    squareColor = '#000';
                }
                square = new game.Square(squareX + x, squareY + y, squareWidth, squareHeight, squareColor, r, c);
                me.game.world.addChild(square, 1);
                this.squares[r].push(square);
                squareX += squareWidth;
            }
            squareY += squareHeight;
            squareX = 0;
        }

        // create 2 players and have them set up their pieces
        this.player1 = new game.Player(game.PieceColor.WHITE, game.PieceDirection.UP, this);
        this.player2 = new game.Player(game.PieceColor.BLACK, game.PieceDirection.DOWN, this);
    },

    update: function (dt) {
        this._super(me.Entity, "update", [dt]);
        return true;
    },

    draw: function (renderer) {
        renderer.setColor('#444');
        renderer.fillRect(
            this.pos.x - 4,
            this.pos.y - 4,
            this.width + 8, this.height + 8);
    },

    getSquare: function (r, c) {
        if (r < 0 || c < 0) { return null; }
        if (r >= this.squares.length) { return null; }
        if (c >= this.squares[r].length) { return null; }
        return this.squares[r][c];
    },

    getClosestSquare: function (x, y) {
        var closestX = Number.POSITIVE_INFINITY;
        var closestY = Number.POSITIVE_INFINITY;
        var closestR = -1;
        var closestC = -1;
        var workX;
        var workY;
        for (i = 0; i < this.squares.length; i++) {
            workX = Math.abs(x - this.squares[0][i].pos.x);
            if (workX < closestX) {
                closestX = workX;
                closestC = i;
            }

            workY = Math.abs(y - this.squares[i][0].pos.y);
            if (workY < closestY) {
                closestY = workY;
                closestR = i;
            }
        }
        return this.getSquare(closestR, closestC);
    }
});
