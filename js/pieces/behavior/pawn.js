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
    if (this.piece.square.isOnRank(8, this.piece.player.direction)) {
      // Promote this pawn.
      this.piece.player.startPawnPromotion(this.piece);
    } else {
      // Finish the move.
      this._super(game.Behavior, "finishMove");
    }
  },

  // Return array of valid capture squares.
  getValidCaptures: function() {
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

    return validSquares;
  },

  // Return array of valid destination squares.
  getValidDestinations: function() {
    var validSquares = this.getValidCaptures();

    var vertical;
    switch (this.piece.player.direction) {
      case game.PieceDirection.UP:
        vertical = -1;
        break;
      case game.PieceDirection.DOWN:
        vertical = 1;
        break;
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
      if (workSquare != null &&
        !workSquare.isOccupied()) {
        validSquares.push(workSquare);
      }
    }
    return validSquares;
  }
});
