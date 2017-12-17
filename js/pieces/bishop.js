game.Bishop = game.Piece.extend({
  init: function(player, pieceColor) {
    this._super(game.Piece, "init", [
      player,
      game.PieceType.BISHOP,
      pieceColor
    ]);
  },

  update: function(dt) {
    this._super(game.Piece, "update", [dt]);
    return true;
  },

  getValidSquares: function() {
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

  getDiagonalSquares: function(horizontal, vertical) {
    if (Math.abs(horizontal) != 1 && Math.abs(vertical) != 1) {
      return [];
    }
    var diagonalSquares = [];
    var r = this.square.row;
    var c = this.square.column;
    var workSquare;
    while (1) {
      r += vertical;
      c += horizontal;
      workSquare = this.player.board.getSquare(r, c);
      if (workSquare == null) {
        break;
      }
      if (workSquare.isOccupied()) {
        if (workSquare.piece.color != this.color) {
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
