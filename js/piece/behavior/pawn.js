game.Behavior.Pawn = game.Behavior.extend({
  // Init.
  init: function (piece) {
    this._super(game.Behavior, "init", [
      piece
    ]);
  },

  // Finish moving.
  finishMove: function () {
    // Check if on the enemy's back line.
    if (this.piece.square.isOnRank(8, this.piece.color)) {
      // Promote this pawn.
      this.piece.player.startPawnPromotion(this.piece);
    } else {
      // Finish the move.
      this._super(game.Behavior, "finishMove");
    }
  },

  // Calculate possible moves.
  calculateMoves: function () {
    var workSquare;
    var enPassantSquare;
    this.moves = [];

    var vertical;
    switch (this.piece.color) {
      case game.PieceColor.WHITE:
        vertical = -1;
        break;

      case game.PieceColor.BLACK:
        vertical = 1;
        break;
    }

    // diagonal left
    workSquare = this.piece.player.board.getSquare(this.piece.square.row + vertical,
      this.piece.square.column - 1);
    enPassantSquare = this.piece.player.board.getSquare(this.piece.square.row,
      this.piece.square.column - 1);
    if (workSquare != null) {
      this.moves.push(new game.Move.Capture(this.piece.square, workSquare));
      if (enPassantSquare != null) {
        this.moves.push(new game.Move.Enpassant(this.piece.square, workSquare, enPassantSquare));
      }
    }

    // diagonal right
    workSquare = this.piece.player.board.getSquare(this.piece.square.row + vertical,
      this.piece.square.column + 1);
    enPassantSquare = this.piece.player.board.getSquare(this.piece.square.row,
      this.piece.square.column + 1);
    if (workSquare != null) {
      this.moves.push(new game.Move.Capture(this.piece.square, workSquare));
      if (enPassantSquare != null) {
        this.moves.push(new game.Move.Enpassant(this.piece.square, workSquare, enPassantSquare));
      }
    }

    // up
    workSquare = this.piece.player.board.getSquare(this.piece.square.row + vertical,
      this.piece.square.column);
    if (workSquare != null) {
      this.moves.push(new game.Move(this.piece.square, workSquare, game.MoveType.MOVE));
    }
    // up 2
    if (!this.piece.hasMoved()) {
      workSquare = this.piece.player.board.getSquare(this.piece.square.row + vertical * 2,
        this.piece.square.column);
      if (workSquare != null) {
        this.moves.push(new game.Move(this.piece.square, workSquare, game.MoveType.MOVE));
      }
    }
  },

  // Prune invalid moves.
  pruneMoves: function () {
    // override
    var valid = [];
    this.moves.forEach(function (m, i) {
      switch (m.type) {
        case game.MoveType.MOVE:
          if (m.target == null) {
            valid.push(m);
          }
          break;

        case game.MoveType.CAPTURE:
          if (m.target != null &&
            m.target.color != m.piece.color) {
            valid.push(m);
          }
          break;

        case game.MoveType.ENPASSANT:
          if (m.target != null &&
            m.target.color != m.piece.color &&
            m.target.moveCount == 1 &&
            m.target.sinceMove == 0 &&
            m.to.piece == null) {
            valid.push(m);
          }
      }
    });
    this.moves = valid;
  }
});
