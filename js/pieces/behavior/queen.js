game.Behavior.Queen = game.Behavior.extend({
  // Init.
  init: function(piece) {
    this._super(game.Behavior, "init", [
      piece
    ]);
  },

  // Return array of valid destination squares.
  getValidSquares: function() {
    var validSquares = [];
    var straightSquares;
    var diagonalSquares;

    // right
    straightSquares = this.getStraightSquares(1, 0);
    for (i = 0; i < straightSquares.length; i++) {
      validSquares.push(straightSquares[i]);
    }
    // left
    straightSquares = this.getStraightSquares(-1, 0);
    for (i = 0; i < straightSquares.length; i++) {
      validSquares.push(straightSquares[i]);
    }
    // up
    straightSquares = this.getStraightSquares(0, -1);
    for (i = 0; i < straightSquares.length; i++) {
      validSquares.push(straightSquares[i]);
    }
    // down
    straightSquares = this.getStraightSquares(0, 1);
    for (i = 0; i < straightSquares.length; i++) {
      validSquares.push(straightSquares[i]);
    }

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

  // Return array of horizontal and vertical squares.
  getStraightSquares: function(horizontal, vertical) {
    if (!(Math.abs(horizontal) == 1 && vertical == 0) &&
      !(Math.abs(vertical) == 1 && horizontal == 0)) {
      return [];
    }
    var straightSquares = [];
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
          straightSquares.push(workSquare);
        }
        break;
      } else {
        straightSquares.push(workSquare);
      }
    }
    return straightSquares;
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
