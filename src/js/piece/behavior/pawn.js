import Behavior from "js/piece/behavior.js";
import Capture from "js/board/move/capture.js";
import Enpassant from "js/board/move/enpassant.js";
import { PieceColor, MoveType } from "js/enums.js";
import Move from "js/board/move.js"

var Pawn = Behavior.extend({
  
  // Init.
  init: function (piece) {
    this._super(Behavior, "init", [
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
      this._super(Behavior, "finishMove");
    }
  },

  // Calculate possible moves.
  calculateMoves: function () {
    var workSquare;
    var enPassantSquare;
    this.moves = [];

    var vertical;
    switch (this.piece.color) {
      case PieceColor.WHITE:
        vertical = -1;
        break;

      case PieceColor.BLACK:
        vertical = 1;
        break;
    }

    // diagonal left
    workSquare = this.piece.player.board.getSquare(this.piece.square.row + vertical,
      this.piece.square.column - 1);
    enPassantSquare = this.piece.player.board.getSquare(this.piece.square.row,
      this.piece.square.column - 1);
    if (workSquare != null) {
      this.moves.push(new Capture(this.piece.square, workSquare));
      if (enPassantSquare != null) {
        this.moves.push(new Enpassant(this.piece.square, workSquare, enPassantSquare));
      }
    }

    // diagonal right
    workSquare = this.piece.player.board.getSquare(this.piece.square.row + vertical,
      this.piece.square.column + 1);
    enPassantSquare = this.piece.player.board.getSquare(this.piece.square.row,
      this.piece.square.column + 1);
    if (workSquare != null) {
      this.moves.push(new Capture(this.piece.square, workSquare));
      if (enPassantSquare != null) {
        this.moves.push(new Enpassant(this.piece.square, workSquare, enPassantSquare));
      }
    }

    // up
    workSquare = this.piece.player.board.getSquare(this.piece.square.row + vertical,
      this.piece.square.column);
    if (workSquare != null) {
      this.moves.push(new Move(this.piece.square, workSquare, MoveType.MOVE));
    }
    // up 2
    if (!this.piece.hasMoved()) {
      workSquare = this.piece.player.board.getSquare(this.piece.square.row + vertical * 2,
        this.piece.square.column);
      if (workSquare != null) {
        this.moves.push(new Move(this.piece.square, workSquare, MoveType.MOVE));
      }
    }
  },

  // Prune invalid moves.
  pruneMoves: function () {
    // override
    var valid = [];
    this.moves.forEach(function (m, i) {
      switch (m.type) {
        case MoveType.MOVE:
          if (m.target == null) {
            valid.push(m);
          }
          break;

        case MoveType.CAPTURE:
          if (m.target != null &&
            m.target.color != m.piece.color) {
            valid.push(m);
          }
          break;

        case MoveType.ENPASSANT:
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

export default Pawn;
