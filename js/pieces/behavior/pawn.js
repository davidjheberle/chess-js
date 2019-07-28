game.Behavior.Pawn = game.Behavior.extend({
  // Init.
  init: function(piece) {
    this._super(game.Behavior, "init", [
      piece
    ]);
  },

  // Finish moving.
  finishMove: function() {
    // Check if on the enemy's back line.
    if (this.isOnRankEight()) {
      // Promote this pawn.
      this.piece.player.startPawnPromotion(this.piece);
    } else {
      // Finish the move.
      this._super(game.Behavior, "finishMove");
    }
  },

  // Return true if positioned on rank eight (far row).
  isOnRankEight: function() {
    switch (this.piece.player.direction) {
      case game.PieceDirection.UP:
        // Check if the current space's row is 0.
        return this.piece.square.row == 0;

      case game.PieceDirection.DOWN:
        // Check if the current space's row is 7.
        return this.piece.square.row == 7;
    }
    return false;
  },

  // Return array of valid destination squares.
  getValidSquares: function() {
    var validSquares = [];
    var workSquare;
    var enPassantSquare;

    var vertical;
    switch (this.piece.player.direction) {
      case game.PieceDirection.UP:
        vertical = -1;
        break;

      case game.PieceDirection.DOWN:
        vertical = 1;
        break;
    }

    // diagonal left
    workSquare = this.piece.player.board.getSquare(this.piece.square.row + vertical,
      this.piece.square.column - 1);
    enPassantSquare = this.piece.player.board.getSquare(this.piece.square.row,
      this.piece.square.column - 1);
    if (workSquare != null &&
      workSquare.isOccupied() &&
      workSquare.piece.color != this.piece.color) {
      validSquares.push(workSquare);
    } else if (workSquare != null &&
      enPassantSquare != null &&
      enPassantSquare.isOccupied() &&
      enPassantSquare.piece.color != this.piece.color &&
      enPassantSquare.piece.moveCount == 1 &&
      enPassantSquare.piece.sinceMove == 0) {
      validSquares.push(workSquare);
    }

    // diagonal right
    workSquare = this.piece.player.board.getSquare(this.piece.square.row + vertical,
      this.piece.square.column + 1);
    enPassantSquare = this.piece.player.board.getSquare(this.piece.square.row,
      this.piece.square.column + 1);
    if (workSquare != null &&
      workSquare.isOccupied() &&
      workSquare.piece.color != this.piece.color) {
      validSquares.push(workSquare);
    } else if (workSquare != null &&
      enPassantSquare != null &&
      enPassantSquare.isOccupied() &&
      enPassantSquare.piece.color != this.piece.color &&
      enPassantSquare.piece.moveCount == 1 &&
      enPassantSquare.piece.sinceMove == 0) {
      validSquares.push(workSquare);
    }

    // up
    workSquare = this.piece.player.board.getSquare(this.piece.square.row + vertical,
      this.piece.square.column);
    if (workSquare != null &&
      !workSquare.isOccupied()) {
      validSquares.push(workSquare);
    } else {
      return validSquares;
    }

    // up 2
    if (!this.piece.hasMoved()) {
      workSquare = this.piece.player.board.getSquare(this.piece.square.row + vertical * 2,
        this.piece.square.column);
      if (workSquare &&
        !workSquare.isOccupied()) {
        validSquares.push(workSquare);
      }
    }

    return validSquares;
  }
});
