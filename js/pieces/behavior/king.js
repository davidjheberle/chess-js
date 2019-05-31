game.Behavior.King = game.Behavior.extend({
  // Init.
  init: function(piece) {
    this._super(game.Behavior, "init", [
      piece
    ]);
  },

  // Return array of valid destination squares.
  getValidSquares: function() {
    var validSquares = [];
    var adjacentSquare;

    // right
    adjacentSquare = this.getAdjacentSquare(1, 0);
    if (adjacentSquare != null) {
      validSquares.push(adjacentSquare);
    }
    // left
    adjacentSquare = this.getAdjacentSquare(-1, 0);
    if (adjacentSquare != null) {
      validSquares.push(adjacentSquare);
    }
    // up
    adjacentSquare = this.getAdjacentSquare(0, -1);
    if (adjacentSquare != null) {
      validSquares.push(adjacentSquare);
    }
    // down
    adjacentSquare = this.getAdjacentSquare(0, 1);
    if (adjacentSquare != null) {
      validSquares.push(adjacentSquare);
    }

    // up left
    adjacentSquare = this.getAdjacentSquare(-1, -1);
    if (adjacentSquare != null) {
      validSquares.push(adjacentSquare);
    }
    // down left
    adjacentSquare = this.getAdjacentSquare(-1, 1);
    if (adjacentSquare != null) {
      validSquares.push(adjacentSquare);
    }
    // up right
    adjacentSquare = this.getAdjacentSquare(1, -1);
    if (adjacentSquare != null) {
      validSquares.push(adjacentSquare);
    }
    // down right
    adjacentSquare = this.getAdjacentSquare(1, 1);
    if (adjacentSquare != null) {
      validSquares.push(adjacentSquare);
    }
    return validSquares;
  },

  // Return array of adjacent squares.
  getAdjacentSquare: function(horizontal, vertical) {
    if (Math.abs(horizontal) > 1 || Math.abs(vertical) > 1) {
      return null;
    }
    var r = this.piece.square.row + vertical;
    var c = this.piece.square.column + horizontal;
    var adjacentSquare = this.piece.player.board.getSquare(r, c);
    if (adjacentSquare == null) {
      return null;
    }
    if (adjacentSquare.isOccupied()) {
      if (adjacentSquare.piece.color != this.piece.color) {
        return adjacentSquare;
      }
    } else {
      return adjacentSquare;
    }
    return null;
  }
});
