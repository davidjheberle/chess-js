game.Pawn = game.Piece.extend({
  // Init.
  init: function(player, pieceColor) {
    this._super(game.Piece, "init", [
      player,
      game.PieceType.PAWN,
      pieceColor
    ]);
  },

  // Update.
  update: function(dt) {
    this._super(game.Piece, "update", [dt]);
    return true;
  },

  // Finish moving.
  finishMove: function() {
    // Check if on the enemy's back line.
    if (this.isOnEnemyBackLine()) {
      // Sacrific this piece to revive another.
      this.player.sacrificePiece(this);
    } else {
      // Finish the move.
      this._super(game.Piece, "finishMove");
    }
  },

  // Return true if positioned in the enemy's back line.
  isOnEnemyBackLine: function() {
    switch (this.player.direction) {
      case game.PieceDirection.UP:
        // Check if the current space's row is 0.
        return this.square.row == 0;

      case game.PieceDirection.DOWN:
        // Check if the current space's row is 7.
        return this.square.row == 7;
    }
    return false;
  },

  // Return array of valid destination squares.
  getValidSquares: function() {
    var validSquares = [];
    var workSquare;

    var vertical;
    switch (this.player.direction) {
      case game.PieceDirection.UP:
        vertical = -1;
        break;

      case game.PieceDirection.DOWN:
        vertical = 1;
        break;
    }

    // diagonal left
    workSquare = this.player.board.getSquare(this.square.row + vertical,
      this.square.column - 1);
    if (workSquare != null &&
      workSquare.isOccupied() &&
      workSquare.piece.color != this.color) {
      validSquares.push(workSquare);
    }

    // diagonal right
    workSquare = this.player.board.getSquare(this.square.row + vertical,
      this.square.column + 1);
    if (workSquare != null &&
      workSquare.isOccupied() &&
      workSquare.piece.color != this.color) {
      validSquares.push(workSquare);
    }

    // up
    workSquare = this.player.board.getSquare(this.square.row + vertical,
      this.square.column);
    if (workSquare != null &&
      !workSquare.isOccupied()) {
      validSquares.push(workSquare);
    } else {
      return validSquares;
    }

    // up 2
    if (!this.hasMoved) {
      workSquare = this.player.board.getSquare(this.square.row + vertical * 2,
        this.square.column);
      if (workSquare &&
        !workSquare.isOccupied()) {
        validSquares.push(workSquare);
      }
    }
    return validSquares;
  }
});
