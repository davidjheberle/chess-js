game.PieceState = {
    IDLE : 0,
    HELD : 1
}

game.Pawn = game.Piece.extend({
    init: function (player, pieceColor) {
        this._super(game.Piece, "init", [
            player,
            game.PieceType.PAWN,
            pieceColor]);
    },

    update: function (dt) {
        this._super(game.Piece, "update", [dt]);
        return true;
    },

    isMoveValid: function (square) {
        var deltaR;
        switch (this.player.direction) {
            case game.PieceDirection.UP:
                deltaR = -1;
                break;

            case game.PieceDirection.DOWN:
                deltaR = 1;
                break;
        }
        if (!this.hasMoved &&
            square.isLocatedAt(this.square.column,
                               this.square.row + 2 * deltaR) &&
            !square.isOccupied())
        {
            return true;
        }
        // left up
        // right up
        if ((square.isLocatedAt(this.square.column - 1,
                                this.square.row + deltaR) ||
            square.isLocatedAt(this.square.column + 1,
                               this.square.row + deltaR)) &&
            square.isOccupied() &&
            square.piece.color != this.color)
        {
            // take the piece!
            return true;
        }
        // up
        if (square.isLocatedAt(this.square.column,
                               this.square.row + deltaR) &&
            !square.isOccupied())
        {
            return true;
        }

        // invalid
        return false;
    }
});
