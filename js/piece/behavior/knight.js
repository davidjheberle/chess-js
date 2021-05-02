game.Behavior.Knight = game.Behavior.extend({
  // Init.
  init: function (piece) {
    this._super(game.Behavior, "init", [
      piece
    ]);
  },

  // Calculate possible moves.
  calculateMoves: function () {
    var lSquare;
    this.moves = [];

    // 2 right 1 up
    lSquare = this.getLSquare(2, -1);
    if (lSquare != null) {
      this.moves.push(new game.Move.Default(this.piece.square, lSquare));
    }
    // 2 right 1 down
    lSquare = this.getLSquare(2, 1);
    if (lSquare != null) {
      this.moves.push(new game.Move.Default(this.piece.square, lSquare));
    }
    // 2 left 1 up
    lSquare = this.getLSquare(-2, -1);
    if (lSquare != null) {
      this.moves.push(new game.Move.Default(this.piece.square, lSquare));
    }
    // 2 left 1 down
    lSquare = this.getLSquare(-2, 1);
    if (lSquare != null) {
      this.moves.push(new game.Move.Default(this.piece.square, lSquare));
    }
    // 1 right 2 up
    lSquare = this.getLSquare(1, -2);
    if (lSquare != null) {
      this.moves.push(new game.Move.Default(this.piece.square, lSquare));
    }
    // 1 left 2 up
    lSquare = this.getLSquare(-1, -2);
    if (lSquare != null) {
      this.moves.push(new game.Move.Default(this.piece.square, lSquare));
    }
    // 1 right 2 down
    lSquare = this.getLSquare(1, 2);
    if (lSquare != null) {
      this.moves.push(new game.Move.Default(this.piece.square, lSquare));
    }
    // 1 left 2 down
    lSquare = this.getLSquare(-1, 2);
    if (lSquare != null) {
      this.moves.push(new game.Move.Default(this.piece.square, lSquare));
    }
  },

  getLSquare: function (horizontal, vertical) {
    if (!(Math.abs(horizontal) == 2 && Math.abs(vertical) == 1) &&
      !(Math.abs(vertical) == 2 && Math.abs(horizontal) == 1)) {
      return null;
    }
    var r = this.piece.square.row + vertical;
    var c = this.piece.square.column + horizontal;
    return this.piece.player.board.getSquare(r, c);
  }
});
