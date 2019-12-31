game.Behavior.Knight = game.Behavior.extend({
  // Init.
  init: function(piece) {
    this._super(game.Behavior, "init", [
      piece
    ]);
  },

  // Return array of valid capture squares.
  getValidCaptures: function() {
    var validSquares = [];
    var lSquare;

    // 2 right 1 up
    lSquare = this.getLSquare(2, -1);
    if (lSquare != null) {
      validSquares.push(lSquare);
    }
    // 2 right 1 down
    lSquare = this.getLSquare(2, 1);
    if (lSquare != null) {
      validSquares.push(lSquare);
    }
    // 2 left 1 up
    lSquare = this.getLSquare(-2, -1);
    if (lSquare != null) {
      validSquares.push(lSquare);
    }
    // 2 left 1 down
    lSquare = this.getLSquare(-2, 1);
    if (lSquare != null) {
      validSquares.push(lSquare);
    }
    // 1 right 2 up
    lSquare = this.getLSquare(1, -2);
    if (lSquare != null) {
      validSquares.push(lSquare);
    }
    // 1 left 2 up
    lSquare = this.getLSquare(-1, -2);
    if (lSquare != null) {
      validSquares.push(lSquare);
    }
    // 1 right 2 down
    lSquare = this.getLSquare(1, 2);
    if (lSquare != null) {
      validSquares.push(lSquare);
    }
    // 1 left 2 down
    lSquare = this.getLSquare(-1, 2);
    if (lSquare != null) {
      validSquares.push(lSquare);
    }
    return validSquares;
  },

  // Return array of valid destination squares.
  getValidDestinations: function() {
    return this.getValidCaptures();
  },

  getLSquare: function(horizontal, vertical) {
    if (!(Math.abs(horizontal) == 2 && Math.abs(vertical) == 1) &&
      !(Math.abs(vertical) == 2 && Math.abs(horizontal) == 1)) {
      return null;
    }
    var r = this.piece.square.row + vertical;
    var c = this.piece.square.column + horizontal;
    var lSquare = this.piece.player.board.getSquare(r, c);
    if (lSquare == null) {
      return null;
    }
    if (lSquare.isOccupied()) {
      if (lSquare.piece.color != this.piece.color) {
        return lSquare;
      }
    } else {
      return lSquare;
    }
    return null;
  }
});
