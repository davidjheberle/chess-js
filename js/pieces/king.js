game.King = game.Piece.extend({
  // Init.
  init: function(player, pieceColor) {
    this._super(game.Piece, "init", [
      player,
      game.PieceType.KING,
      pieceColor
    ]);
  },

  // Update.
  update: function(dt) {
    this._super(game.Piece, "update", [dt]);
    return true;
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
    var r = this.square.row + vertical;
    var c = this.square.column + horizontal;
    var adjacentSquare = this.player.board.getSquare(r, c);
    if (adjacentSquare == null) {
      return null;
    }
    if (adjacentSquare.isOccupied()) {
      if (adjacentSquare.piece.color != this.color) {
        return adjacentSquare;
      }
    } else {
      return adjacentSquare;
    }
    return null;
  }
});
