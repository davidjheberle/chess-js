import { app } from "./app.js";
import { PieceColor, PieceType } from "./enums.js";
import { Piece } from "./piece.js";
import { Graveyard } from "./board/graveyard.js";

export class Player {
  // Init.
  constructor(color, board) {
    this.color = color;
    this.board = board;
    this.pawnToPromote = null;

    let graveyardX;
    switch (this.color) {
      case PieceColor.WHITE:
        graveyardX = app.viewport.width / 2 + 240;
        break;

      default:
        graveyardX = app.viewport.width / 2 - 240;
        break;
    }
    this.graveyard = new Graveyard(graveyardX, app.viewport.height / 2, 80, 320, 8, 2);
    app.world.addChild(this.graveyard, 0);

    this.setPieces();
  }

  // Set pieces on the game board.
  setPieces() {
    let nobleRow;
    let pawnRow;
    switch (this.color) {
      case PieceColor.WHITE:
        nobleRow = 7;
        pawnRow = nobleRow - 1;
        break;

      case PieceColor.BLACK:
        nobleRow = 0;
        pawnRow = nobleRow + 1;
        break;
    }

    const nobles = [
      PieceType.ROOK,
      PieceType.KNIGHT,
      PieceType.BISHOP,
      PieceType.QUEEN,
      PieceType.KING,
      PieceType.BISHOP,
      PieceType.KNIGHT,
      PieceType.ROOK
    ];
    for (let i = 0; i < 8; ++i) {
      this.addPiece(nobles[i], nobleRow, i);
    }
    for (let i = 0; i < 8; ++i) {
      this.addPiece(PieceType.PAWN, pawnRow, i);
    }
  }

  // Add a piece of the given type to the board at row, column.
  addPiece(type, row, column) {
    const piece = new Piece(this, type, this.color);
    app.world.addChild(piece);
    piece.behavior.positionOnSquare(this.board.getSquare(row, column));
  }

  // True if it's this player's turn.
  isTurnOwner() {
    return this.color == this.board.turnOwner;
  }

  // Start this player's turn.
  startTurn() {
    for (let i = 0; i < this.board.squares.length; ++i) {
      const rows = this.board.squares[i];
      for (let j = 0; j < rows.length; j++) {
        const square = rows[j];
        if (square.isOccupied() &&
          square.piece.isColor(this.color)) {
          square.piece.sinceMove++;
        }
      }
    }
  }

  // End this player's turn.
  endTurn() {
    this.board.switchTurnOwner();
  }

  // Start the pawn promotion.
  startPawnPromotion(pawnToPromote) {
    this.pawnToPromote = pawnToPromote;
  }

  // Finish the pawn promotion.
  finishPawnPromotion(promotionRank) {
    // Set the pawn's new type.
    this.pawnToPromote.setTypeAndColor(promotionRank, this.color);

    // Clean up.
    this.pawnToPromote = null;
  }

  // Return true if pawn to promote is not null.
  isPromotingPawn() {
    return this.pawnToPromote != null;
  }
}
