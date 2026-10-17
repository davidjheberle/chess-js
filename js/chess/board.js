import { Square } from "./board/square.js";
import { MoveType, PieceColor, PieceType } from "./enums.js";
import { Piece } from "./piece.js";

export class Board {
  // Init. Pass { empty: true } for a board with no pieces (pieces can then be
  // added with addPiece and the game started with start).
  constructor({ empty = false } = {}) {
    this.turnOwner = PieceColor.WHITE;
    this.pawnToPromote = null;
    this.captured = [];

    // The moves played, oldest first: { piece, from, to } with the squares
    // the piece moved between.
    this.history = [];
    // Plies since the last capture or pawn move, for the 50-move rule.
    this.halfmoveClock = 0;
    // A key for each position reached since the game started, for repetition.
    this.positions = [];

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
    this.halfmoveClock = 0;
    this.positions = [this.positionKey()];
  }

  // Get square at row, column.
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

  // Record a move that has just been made, before the turn ends.
  recordMove(move) {
    this.history.push({ piece: move.piece, from: move.from, to: move.to });
    const captures = move.type !== MoveType.CASTLE && move.target != null;
    if (move.piece.type === PieceType.PAWN || captures) {
      this.halfmoveClock = 0;
    } else {
      this.halfmoveClock++;
    }
  }

  // The last move played, or undefined before the first.
  lastMove() {
    return this.history.at(-1);
  }

  // Remove a captured piece from the board.
  capture(piece) {
    piece.square.piece = null;
    piece.square = null;
    piece.captured = true;
    this.captured.push(piece);
  }

  // End the current turn: pass the move to the other player, work out their
  // legal moves and record the position.
  endTurn() {
    this.turnOwner =
      this.turnOwner === PieceColor.WHITE ? PieceColor.BLACK : PieceColor.WHITE;
    this.calculateMoves();
    this.positions.push(this.positionKey());
  }

  // A string naming the position: the pieces on each square, the turn owner,
  // who can still castle and whether a pawn can capture en passant. Positions
  // with the same key count as the same for repetition.
  positionKey() {
    const letters = "prnbqk";
    let key = "";
    for (const row of this.squares) {
      for (const square of row) {
        const p = square.piece;
        if (p == null) {
          key += ".";
        } else {
          const letter = letters[p.type];
          key += p.isColor(PieceColor.WHITE) ? letter.toUpperCase() : letter;
        }
      }
    }
    key += ` ${this.turnOwner} ${this.castlingRights()}`;

    // The pawns that can capture en passant, which only counts if the
    // capture is legal.
    for (const pawn of this.getPieces(this.turnOwner)) {
      for (const m of pawn.behavior.moves) {
        if (m.type === MoveType.ENPASSANT) {
          key += ` ${m.from.column}${m.to.column}`;
        }
      }
    }
    return key;
  }

  // Which sides each player could still castle to, as in FEN ("KQkq"): the
  // king and that rook haven't moved, even if castling isn't possible now.
  castlingRights() {
    let rights = "";
    for (const [color, row, letters] of [
      [PieceColor.WHITE, 7, "KQ"],
      [PieceColor.BLACK, 0, "kq"],
    ]) {
      // True if the piece in the given column is the given type, this color,
      // and hasn't moved.
      const unmoved = (column, type) => {
        const p = this.getSquare(row, column).piece;
        return p?.type === type && p.isColor(color) && !p.hasMoved();
      };
      if (!unmoved(4, PieceType.KING)) {
        continue;
      }
      [7, 0].forEach((column, i) => {
        if (unmoved(column, PieceType.ROOK)) {
          rights += letters[i];
        }
      });
    }
    return rights || "-";
  }

  // True if the current position has been reached three times.
  isThreefoldRepetition() {
    const key = this.positions.at(-1);
    return this.positions.filter((k) => k === key).length >= 3;
  }

  // True if 50 moves by each player have passed with no capture or pawn move.
  isFiftyMoveRule() {
    return this.halfmoveClock >= 100;
  }

  // Calculate all legal moves.
  calculateMoves() {
    this.calculatePossibleMoves();

    // Remove the turn owner's moves that would leave their own king in check.
    for (const piece of this.getPieces(this.turnOwner)) {
      piece.behavior.moves = piece.behavior.moves.filter(
        (m) => !this.leavesKingInCheck(m),
      );
    }
  }

  // True if making the move would leave the moving player's king threatened.
  leavesKingInCheck(move) {
    // Try the move on a copy of the board.
    const board = this.clone();
    board.calculatePossibleMoves();
    const piece = board.getSquare(move.from.row, move.from.column).piece;
    piece.behavior.performMove(
      piece.behavior.getMove(board.getSquare(move.to.row, move.to.column)),
    );
    board.calculatePossibleMoves();
    return board.isInCheck(piece.color);
  }

  // True if the given color's king is threatened.
  isInCheck(color) {
    const king = this.getPieces(color).find((p) => p.type === PieceType.KING);
    return king?.square.isThreatened(color) ?? false;
  }

  // True if the turn owner is in check and can't move.
  isCheckmate() {
    return this.hasNoLegalMoves() && this.isInCheck(this.turnOwner);
  }

  // True if the turn owner isn't in check but can't move.
  isStalemate() {
    return this.hasNoLegalMoves() && !this.isInCheck(this.turnOwner);
  }

  // True if the turn owner has no legal moves.
  hasNoLegalMoves() {
    return this.getPieces(this.turnOwner).every(
      (p) => p.behavior.moves.length === 0,
    );
  }

  // True if neither player has the pieces to checkmate: king vs king, king
  // and bishop or knight vs king, or kings with bishops all on squares of the
  // same color.
  hasInsufficientMaterial() {
    const others = this.getPieces(PieceColor.WHITE)
      .concat(this.getPieces(PieceColor.BLACK))
      .filter((p) => p.type !== PieceType.KING);
    if (others.length === 0) {
      return true;
    }
    if (others.length === 1 && others[0].type === PieceType.KNIGHT) {
      return true;
    }
    if (others.every((p) => p.type === PieceType.BISHOP)) {
      const shade = (p) => (p.square.row + p.square.column) % 2;
      return others.every((p) => shade(p) === shade(others[0]));
    }
    return false;
  }

  // Why the game was drawn ("stalemate", "insufficient material",
  // "threefold repetition", "50-move rule"), or null if it hasn't been.
  drawReason() {
    if (this.isStalemate()) {
      return "stalemate";
    }
    if (this.hasInsufficientMaterial()) {
      return "insufficient material";
    }
    // Checkmate on the move that repeats or reaches 50 moves still wins.
    if (this.isCheckmate()) {
      return null;
    }
    if (this.isThreefoldRepetition()) {
      return "threefold repetition";
    }
    if (this.isFiftyMoveRule()) {
      return "50-move rule";
    }
    return null;
  }

  // True if the game has ended in checkmate or a draw.
  isGameOver() {
    return this.isCheckmate() || this.drawReason() != null;
  }

  // Return all pieces of the given color on the board.
  getPieces(color) {
    const pieces = [];
    for (const row of this.squares) {
      for (const square of row) {
        if (square.isOccupied() && square.piece.isColor(color)) {
          pieces.push(square.piece);
        }
      }
    }
    return pieces;
  }

  // Return a copy of this board with the same pieces and turn owner, and the
  // last move (for en passant) as its only history.
  clone() {
    const board = new Board({ empty: true });
    board.turnOwner = this.turnOwner;
    const last = this.lastMove();
    for (const row of this.squares) {
      for (const square of row) {
        const p = square.piece;
        if (p != null) {
          const copy = board.addPiece(
            p.type,
            p.color,
            square.row,
            square.column,
          );
          copy.moveCount = p.moveCount;
          if (p === last?.piece) {
            board.history.push({
              piece: copy,
              from: board.getSquare(last.from.row, last.from.column),
              to: board.getSquare(last.to.row, last.to.column),
            });
          }
        }
      }
    }
    return board;
  }

  // Calculate all possible moves, including ones that leave the king in check.
  calculatePossibleMoves() {
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
