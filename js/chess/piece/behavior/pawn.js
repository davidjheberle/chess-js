import { CaptureMove } from "../../board/move/capture.js";
import { EnpassantMove } from "../../board/move/enpassant.js";
import { Move } from "../../board/move.js";
import { MoveType, PieceColor, PieceType } from "../../enums.js";
import { Behavior } from "../behavior.js";

export class PawnBehavior extends Behavior {
  // Finish moving.
  finishMove() {
    // Check if on the enemy's back line.
    if (this.piece.square.isOnRank(8, this.piece.color)) {
      // Promote this pawn.
      this.piece.board.startPawnPromotion(this.piece);
    } else {
      // Finish the move.
      super.finishMove();
    }
  }

  // Calculate possible moves.
  calculateMoves() {
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
    workSquare = this.piece.board.getSquare(
      this.piece.square.row + vertical,
      this.piece.square.column - 1,
    );
    enPassantSquare = this.piece.board.getSquare(
      this.piece.square.row,
      this.piece.square.column - 1,
    );
    if (workSquare != null) {
      this.moves.push(new CaptureMove(this.piece.square, workSquare));
      if (enPassantSquare != null) {
        this.moves.push(
          new EnpassantMove(this.piece.square, workSquare, enPassantSquare),
        );
      }
    }

    // diagonal right
    workSquare = this.piece.board.getSquare(
      this.piece.square.row + vertical,
      this.piece.square.column + 1,
    );
    enPassantSquare = this.piece.board.getSquare(
      this.piece.square.row,
      this.piece.square.column + 1,
    );
    if (workSquare != null) {
      this.moves.push(new CaptureMove(this.piece.square, workSquare));
      if (enPassantSquare != null) {
        this.moves.push(
          new EnpassantMove(this.piece.square, workSquare, enPassantSquare),
        );
      }
    }

    // up
    workSquare = this.piece.board.getSquare(
      this.piece.square.row + vertical,
      this.piece.square.column,
    );
    if (workSquare != null) {
      this.moves.push(new Move(this.piece.square, workSquare, MoveType.MOVE));
    }
    // up 2, only if the square in between (up) is empty
    if (
      !this.piece.hasMoved() &&
      workSquare != null &&
      !workSquare.isOccupied()
    ) {
      workSquare = this.piece.board.getSquare(
        this.piece.square.row + vertical * 2,
        this.piece.square.column,
      );
      if (workSquare != null) {
        this.moves.push(new Move(this.piece.square, workSquare, MoveType.MOVE));
      }
    }
  }

  // Prune invalid moves.
  pruneMoves() {
    // override
    var valid = [];
    this.moves.forEach((m) => {
      switch (m.type) {
        case MoveType.MOVE:
          if (m.target == null) {
            valid.push(m);
          }
          break;

        case MoveType.CAPTURE:
          if (m.target != null && m.target.color !== m.piece.color) {
            valid.push(m);
          }
          break;

        case MoveType.ENPASSANT:
          // The target must be a pawn that has just stepped two squares to
          // land beside this pawn, which is then on its 5th rank.
          if (
            m.target != null &&
            m.target.type === PieceType.PAWN &&
            m.from.isOnRank(5, m.piece.color) &&
            m.target.color !== m.piece.color &&
            m.target.moveCount === 1 &&
            m.target.sinceMove === 0 &&
            m.to.piece == null
          ) {
            valid.push(m);
          }
      }
    });
    this.moves = valid;
  }
}
