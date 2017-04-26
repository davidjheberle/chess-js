game.Player = me.Entity.extend({
    init: function (color, direction, board) {
        this._super(me.Entity, "init", [0, 0, {
            width : 0,
            height : 0
        }]);
        this.color = color;
        this.direction = direction;
        this.board = board;

        this.setPieces ();
    },

    setPieces: function () {

        var nobleRow;
        var pawnRow;
        switch (this.direction) {
            case game.PieceDirection.UP:
                nobleRow = 7;
                pawnRow = nobleRow - 1;
                break;

            case game.PieceDirection.DOWN:
                nobleRow = 0;
                pawnRow = nobleRow + 1;
                break;
        }

        piece = new game.Rook(this, this.color);
        me.game.world.addChild(piece);
        piece.moveToSquare(this.board.getSquare (nobleRow, 0));

        piece = new game.Piece(this, game.PieceType.KNIGHT, this.color);
        me.game.world.addChild(piece);
        piece.moveToSquare(this.board.getSquare (nobleRow, 1));

        piece = new game.Piece(this, game.PieceType.BISHOP, this.color);
        me.game.world.addChild(piece);
        piece.moveToSquare(this.board.getSquare (nobleRow, 2));

        piece = new game.Piece(this, game.PieceType.QUEEN, this.color);
        me.game.world.addChild(piece);
        piece.moveToSquare(this.board.getSquare (nobleRow, 3));

        piece = new game.Piece(this, game.PieceType.KING, this.color);
        me.game.world.addChild(piece);
        piece.moveToSquare(this.board.getSquare (nobleRow, 4));

        piece = new game.Piece(this, game.PieceType.BISHOP, this.color);
        me.game.world.addChild(piece);
        piece.moveToSquare(this.board.getSquare (nobleRow, 5));

        piece = new game.Piece(this, game.PieceType.KNIGHT, this.color);
        me.game.world.addChild(piece);
        piece.moveToSquare(this.board.getSquare (nobleRow, 6));

        piece = new game.Rook(this, this.color);
        me.game.world.addChild(piece);
        piece.moveToSquare(this.board.getSquare (nobleRow, 7));

        for (i = 0; i < 8; i++) {
            piece = new game.Pawn(this, this.color);
            me.game.world.addChild(piece);
            piece.moveToSquare(this.board.getSquare (pawnRow, i));
        }
    }
});
