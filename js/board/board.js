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

        // Create the pieces.
        var piece;

        // black pieces
        piece = new game.Piece(this, game.PieceType.ROOK, game.PieceColor.BLACK);
        me.game.world.addChild(piece);
        piece.moveToSquare(this.getSquare (0, 0));

        piece = new game.Piece(this, game.PieceType.KNIGHT, game.PieceColor.BLACK);
        me.game.world.addChild(piece);
        piece.moveToSquare(this.getSquare (0, 1));

        piece = new game.Piece(this, game.PieceType.BISHOP, game.PieceColor.BLACK);
        me.game.world.addChild(piece);
        piece.moveToSquare(this.getSquare (0, 2));

        piece = new game.Piece(this, game.PieceType.QUEEN, game.PieceColor.BLACK);
        me.game.world.addChild(piece);
        piece.moveToSquare(this.getSquare (0, 3));

        piece = new game.Piece(this, game.PieceType.KING, game.PieceColor.BLACK);
        me.game.world.addChild(piece);
        piece.moveToSquare(this.getSquare (0, 4));

        piece = new game.Piece(this, game.PieceType.BISHOP, game.PieceColor.BLACK);
        me.game.world.addChild(piece);
        piece.moveToSquare(this.getSquare (0, 5));

        piece = new game.Piece(this, game.PieceType.KNIGHT, game.PieceColor.BLACK);
        me.game.world.addChild(piece);
        piece.moveToSquare(this.getSquare (0, 6));

        piece = new game.Piece(this, game.PieceType.ROOK, game.PieceColor.BLACK);
        me.game.world.addChild(piece);
        piece.moveToSquare(this.getSquare (0, 7));

        for (i = 0; i < 8; i++) {
            piece = new game.Piece(this, game.PieceType.PAWN, game.PieceColor.BLACK);
            me.game.world.addChild(piece);
            piece.moveToSquare(this.getSquare (1, i));
        }

        // white pieces
        piece = new game.Piece(this, game.PieceType.ROOK, game.PieceColor.WHITE);
        me.game.world.addChild(piece);
        piece.moveToSquare(this.getSquare (7, 0));

        piece = new game.Piece(this, game.PieceType.KNIGHT, game.PieceColor.WHITE);
        me.game.world.addChild(piece);
        piece.moveToSquare(this.getSquare (7, 1));

        piece = new game.Piece(this, game.PieceType.BISHOP, game.PieceColor.WHITE);
        me.game.world.addChild(piece);
        piece.moveToSquare(this.getSquare (7, 2));

        piece = new game.Piece(this, game.PieceType.QUEEN, game.PieceColor.WHITE);
        me.game.world.addChild(piece);
        piece.moveToSquare(this.getSquare (7, 3));

        piece = new game.Piece(this, game.PieceType.KING, game.PieceColor.WHITE);
        me.game.world.addChild(piece);
        piece.moveToSquare(this.getSquare (7, 4));

        piece = new game.Piece(this, game.PieceType.BISHOP, game.PieceColor.WHITE);
        me.game.world.addChild(piece);
        piece.moveToSquare(this.getSquare (7, 5));

        piece = new game.Piece(this, game.PieceType.KNIGHT, game.PieceColor.WHITE);
        me.game.world.addChild(piece);
        piece.moveToSquare(this.getSquare (7, 6));

        piece = new game.Piece(this, game.PieceType.ROOK, game.PieceColor.WHITE);
        me.game.world.addChild(piece);
        piece.moveToSquare(this.getSquare (7, 7));

        for (i = 0; i < 8; i++) {
            piece = new game.Piece(this, game.PieceType.PAWN, game.PieceColor.WHITE);
            me.game.world.addChild(piece);
            piece.moveToSquare(this.getSquare (6, i));
        }
    },

    update: function (dt) {
        this._super(me.Entity, "update", [dt]);
        return true;
    },

    getSquare: function (r, c) {
        if (this.squares.length < r) { console.log (this.squares.length); return null; }
        if (this.squares[r].length < c) { console.log (this.squares[r].length); return null; }
        if (r < 0 || c < 0) { return null; }
        return this.squares[r][c];
    },

    getClosestSquare: function (x, y) {
        var closestX = 1000;
        var closestY = 1000;
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
        console.log ("getClosestSquare: " + closestR + " | " + closestC);
        return this.getSquare(closestR, closestC);
    }
});
