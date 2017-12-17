game.Rook = game.Piece.extend({
  init: function(player, pieceColor) {
    this._super(game.Piece, "init", [
      player,
      game.PieceType.ROOK,
      pieceColor
    ]);
  },

  update: function(dt) {
    this._super(game.Piece, "update", [dt]);
    return true;
  },

  getValidSquares: function() {
    var validSquares = [];
    var straightSquares;

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
    return validSquares;
  },

  getStraightSquares: function(horizontal, vertical) {
    if (!(Math.abs(horizontal) == 1 && vertical == 0) &&
      !(Math.abs(vertical) == 1 && horizontal == 0)) {
      return [];
    }
    var straightSquares = [];
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
          straightSquares.push(workSquare);
        }
        break;
      } else {
        straightSquares.push(workSquare);
      }
    }
    return straightSquares;
  }
});
