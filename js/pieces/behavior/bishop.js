game.Behavior.Bishop = game.Behavior.extend({
  // Init.
  init: function(piece) {
    this._super(game.Behavior, "init", [
      piece
    ]);
  },

  // Return array of valid capture squares.
  getValidCaptures: function() {
    var validSquares = [];
    var diagonalSquares;

    // up left
    diagonalSquares = this.getDiagonalSquares(-1, -1);
    for (i = 0; i < diagonalSquares.length; i++) {
      validSquares.push(diagonalSquares[i]);
    }
    // down left
    diagonalSquares = this.getDiagonalSquares(-1, 1);
    for (i = 0; i < diagonalSquares.length; i++) {
      validSquares.push(diagonalSquares[i]);
    }
    // up right
    diagonalSquares = this.getDiagonalSquares(1, -1);
    for (i = 0; i < diagonalSquares.length; i++) {
      validSquares.push(diagonalSquares[i]);
    }
    // down right
    diagonalSquares = this.getDiagonalSquares(1, 1);
    for (i = 0; i < diagonalSquares.length; i++) {
      validSquares.push(diagonalSquares[i]);
    }
    return validSquares;
  },

  // Return array of valid destination squares.
  getValidDestinations: function() {
    return this.getValidCaptures();
  },

  // Return array of diagonal squares.
  getDiagonalSquares: function(horizontal, vertical) {
    if (Math.abs(horizontal) != 1 && Math.abs(vertical) != 1) {
      return [];
    }
    var diagonalSquares = [];
    var r = this.piece.square.row;
    var c = this.piece.square.column;
    var workSquare;
    while (1) {
      r += vertical;
      c += horizontal;
      workSquare = this.piece.player.board.getSquare(r, c);
      if (workSquare == null) {
        break;
      }
      if (workSquare.isOccupied()) {
        if (workSquare.piece.color != this.piece.color) {
          diagonalSquares.push(workSquare);
        }
        break;
      } else {
        diagonalSquares.push(workSquare);
      }
    }
    return diagonalSquares;
  }
});
