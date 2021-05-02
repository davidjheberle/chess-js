game.Behavior.Bishop = game.Behavior.extend({
  // Init.
  init: function (piece) {
    this._super(game.Behavior, "init", [
      piece
    ]);
  },

  // Caculate possible moves.
  calculateMoves: function () {
    var diagonalSquares;
    this.moves = [];

    // up left
    diagonalSquares = this.getDiagonalSquares(-1, -1);
    for (i = 0; i < diagonalSquares.length; ++i) {
      this.moves.push(new game.Move.Default(this.piece.square, diagonalSquares[i]));
    }
    // down left
    diagonalSquares = this.getDiagonalSquares(-1, 1);
    for (i = 0; i < diagonalSquares.length; ++i) {
      this.moves.push(new game.Move.Default(this.piece.square, diagonalSquares[i]));
    }
    // up right
    diagonalSquares = this.getDiagonalSquares(1, -1);
    for (i = 0; i < diagonalSquares.length; ++i) {
      this.moves.push(new game.Move.Default(this.piece.square, diagonalSquares[i]));
    }
    // down right
    diagonalSquares = this.getDiagonalSquares(1, 1);
    for (i = 0; i < diagonalSquares.length; ++i) {
      this.moves.push(new game.Move.Default(this.piece.square, diagonalSquares[i]));
    }
  },

  // Return array of diagonal squares.
  getDiagonalSquares: function (horizontal, vertical) {
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
      diagonalSquares.push(workSquare);
      if (workSquare.isOccupied()) {
        break;
      }
    }
    return diagonalSquares;
  }
});
