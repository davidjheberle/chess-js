game.Rook = game.Piece.extend({
    init: function (player, pieceColor) {
        this._super(game.Piece, "init", [
            player,
            game.PieceType.ROOK,
            pieceColor]);
    },

    update: function (dt) {
        this._super(game.Piece, "update", [dt]);
        return true;
    },

    isMoveValid: function (square) {
        // if (!this.hasMoved && 4 from king && empty spaces between)
        var direction;
        var diff;
        var workSquare;
        if (square.row == this.square.row) {
            // get the difference and go to it
            // check if the path is clear
            direction = square.column < this.square.column ? -1 : 1;
            diff = Math.abs(this.square.column - square.column);
            for (i = 1; i < diff; i++) {
                workSquare = this.player.board.getSquare(this.square.row,
                                                         this.square.column + i * direction);
                if (workSquare.isOccupied()) {
                    // return false if not the target square
                    // else return true to take the piece
                    return workSquare === square;
                }
            }
            return true;
        }
        if (square.column == this.square.column) {
            // get the difference and go to it
            // check if the path is clear
            direction = square.row < this.square.row ? -1 : 1;
            diff = Math.abs(this.square.row - square.row);
            for (i = 1; i < diff; i++) {
                workSquare = this.player.board.getSquare(this.square.row + i * direction,
                                                         this.square.column);
                if (workSquare.isOccupied()) {
                    // return false if not the target square
                    // else return true to take the piece
                    return workSquare === square;
                }
            }
            return true;
        }

        // invalid
        return false;
    }
});
