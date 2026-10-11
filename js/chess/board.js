import { Square } from "./board/square.js";
import { PieceColor, PieceType } from "./enums.js";
import { Piece } from "./piece.js";

export class Board {
  // Init. Pass { empty: true } for a board with no pieces (pieces can then be
  // added with addPiece and the game started with start).
  constructor({ empty = false } = {}) {
    this.turnOwner = PieceColor.WHITE;
    this.pawnToPromote = null;
    this.captured = [];

    // 2d array of squares [row, column].
    this.squares = [];
    for (let r = 0; r < 8; ++r) {
      this.squares.push([]);
      for (let c = 0; c < 8; ++c) {
        this.squares[r].push(new Square(r, c));
      }
    }

    if (!empty) {
      this.setPieces(PieceColor.WHITE);
      this.setPieces(PieceColor.BLACK);
      this.start(PieceColor.WHITE);
    }
  }

  // Set a player's pieces on the game board.
  setPieces(color) {
    let nobleRow;
    let pawnRow;
    switch (color) {
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
      PieceType.ROOK,
    ];
    for (let i = 0; i < 8; ++i) {
      this.addPiece(nobles[i], color, nobleRow, i);
    }
    for (let i = 0; i < 8; ++i) {
      this.addPiece(PieceType.PAWN, color, pawnRow, i);
    }
  }

  // Add a piece of the given type and color to the board at row, column.
  addPiece(type, color, row, column) {
    const piece = new Piece(this, type, color);
    piece.behavior.positionOnSquare(this.getSquare(row, column));
    return piece;
  }

  // Start the game with the given color to move.
  start(color) {
    this.turnOwner = color;
    this.calculateMoves();
  }

  // Get sqaure at row, column.
  getSquare(r, c) {
    if (r < 0 || c < 0) {
      return null;
    }
    if (r >= this.squares.length) {
      return null;
    }
    if (c >= this.squares[r].length) {
      return null;
    }
    return this.squares[r][c];
  }

  // Move the piece on the from square to the to square.
  // Return false if the move isn't allowed.
  move(from, to) {
    const piece = from.piece;
    if (piece == null || !piece.isColor(this.turnOwner)) {
      return false;
    }
    if (this.isPromotingPawn()) {
      return false;
    }
    return piece.behavior.moveToSquare(to);
  }

  // Remove a captured piece from the board.
  capture(piece) {
    piece.square.piece = null;
    piece.square = null;
    piece.captured = true;
    this.captured.push(piece);
  }

  // End the current turn.
  endTurn() {
    this.switchTurnOwner();
  }

  // Switch the turn owner.
  switchTurnOwner() {
    switch (this.turnOwner) {
      case PieceColor.WHITE:
        this.turnOwner = PieceColor.BLACK;
        break;

      case PieceColor.BLACK:
        this.turnOwner = PieceColor.WHITE;
        break;
    }
    this.startTurn();
    this.calculateMoves();
  }

  // Start the turn owner's turn.
  startTurn() {
    for (let i = 0; i < this.squares.length; ++i) {
      const rows = this.squares[i];
      for (let j = 0; j < rows.length; j++) {
        const square = rows[j];
        if (square.isOccupied() && square.piece.isColor(this.turnOwner)) {
          square.piece.sinceMove++;
        }
      }
    }
  }

  // Calculate all possible moves.
  calculateMoves() {
    let piece;
    const pieces = [];
    for (let r = 0; r < this.squares.length; ++r) {
      for (let c = 0; c < this.squares[r].length; ++c) {
        this.squares[r][c].threats = [];
        piece = this.squares[r][c].piece;
        if (piece != null) {
          pieces.push(piece);
        }
      }
    }
    pieces.forEach((p) => {
      p.behavior.calculateMoves();
    });
    pieces.forEach((p) => {
      p.behavior.pruneMoves();
    });
  }

  // Start the pawn promotion.
  startPawnPromotion(pawnToPromote) {
    this.pawnToPromote = pawnToPromote;
  }

  // Finish the pawn promotion and end the turn.
  // Return false if the pawn can't be promoted to the given type.
  finishPawnPromotion(promotionRank) {
    if (
      !this.isPromotingPawn() ||
      promotionRank === PieceType.PAWN ||
      promotionRank === PieceType.KING
    ) {
      return false;
    }

    // Set the pawn's new type.
    this.pawnToPromote.setTypeAndColor(promotionRank, this.turnOwner);

    // Clean up.
    this.pawnToPromote = null;
    this.endTurn();
    return true;
  }

  // Return true if pawn to promote is not null.
  isPromotingPawn() {
    return this.pawnToPromote != null;
  }
}
