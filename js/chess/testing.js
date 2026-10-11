// Helpers for tests: refer to squares by their algebraic name ("e2").

import { Board } from "./board.js";
import { PieceColor, PieceType } from "./enums.js";

const { PAWN, ROOK, KNIGHT, BISHOP, QUEEN, KING } = PieceType;

const FILES = "abcdefgh";

// Get the square with the given name, e.g. "e2".
export function at(board, name) {
  const column = FILES.indexOf(name[0]);
  const rank = Number(name[1]);
  return board.getSquare(8 - rank, column);
}

// Name of a square, e.g. "e2".
export function nameOf(square) {
  return FILES[square.column] + (8 - square.row);
}

// Play moves written as "e2e4"; fail if any of them isn't allowed.
export function play(board, ...moves) {
  for (const m of moves) {
    if (!board.move(at(board, m.slice(0, 2)), at(board, m.slice(2, 4)))) {
      throw new Error(`move ${m} was not allowed`);
    }
  }
}

// Sorted names of the squares the piece on the given square can move to.
export function targets(board, name) {
  return at(board, name)
    .piece.behavior.moves.map((m) => nameOf(m.to))
    .sort();
}

// Number of moves the turn owner can make.
export function moveCount(board) {
  let count = 0;
  for (const piece of board.getPieces(board.turnOwner)) {
    count += piece.behavior.moves.length;
  }
  return count;
}

// Count the move sequences of the given length ("perft"). Promotions count
// once per piece the pawn can become.
export function perft(board, depth) {
  let count = 0;
  if (depth === 1) {
    // Count the last moves without playing them.
    for (const piece of board.getPieces(board.turnOwner)) {
      for (const move of piece.behavior.moves) {
        const promotes =
          piece.type === PAWN && move.to.isOnRank(8, piece.color);
        count += promotes ? 4 : 1;
      }
    }
    return count;
  }
  for (const piece of board.getPieces(board.turnOwner)) {
    for (const move of piece.behavior.moves) {
      const next = board.clone();
      next.calculateMoves();
      next.move(
        next.getSquare(move.from.row, move.from.column),
        next.getSquare(move.to.row, move.to.column),
      );
      if (next.isPromotingPawn()) {
        for (const type of [QUEEN, ROOK, BISHOP, KNIGHT]) {
          const promoted = next.clone();
          promoted.pawnToPromote = promoted.getSquare(
            move.to.row,
            move.to.column,
          ).piece;
          promoted.finishPawnPromotion(type);
          count += perft(promoted, depth - 1);
        }
      } else {
        count += perft(next, depth - 1);
      }
    }
  }
  return count;
}

// Set up a board from the piece placement, side to move and castling fields
// of a FEN string, e.g. "8/8/8/8/8/8/8/K6k w - -". En passant isn't loaded.
export function fromFen(fen) {
  const [placement, side, castling] = fen.split(" ");
  const types = { p: PAWN, r: ROOK, n: KNIGHT, b: BISHOP, q: QUEEN, k: KING };
  const board = new Board({ empty: true });
  placement.split("/").forEach((rank, row) => {
    let column = 0;
    for (const ch of rank) {
      if (/\d/.test(ch)) {
        column += Number(ch);
        continue;
      }
      const color =
        ch === ch.toUpperCase() ? PieceColor.WHITE : PieceColor.BLACK;
      const piece = board.addPiece(types[ch.toLowerCase()], color, row, column);
      // Nothing has just moved, so nothing can be captured en passant.
      piece.sinceMove = 1;
      column++;
    }
  });

  // Mark pieces as moved where the position says they must have.
  for (const piece of board
    .getPieces(PieceColor.WHITE)
    .concat(board.getPieces(PieceColor.BLACK))) {
    const name = nameOf(piece.square);
    const white = piece.color === PieceColor.WHITE;
    let moved = false;
    switch (piece.type) {
      case PAWN:
        moved = !piece.square.isOnRank(2, piece.color);
        break;
      case KING:
        moved =
          name !== (white ? "e1" : "e8") ||
          !(white ? /[KQ]/ : /[kq]/).test(castling);
        break;
      case ROOK: {
        const rights = { a1: "Q", h1: "K", a8: "q", h8: "k" };
        moved = !castling.includes(rights[name]);
        break;
      }
    }
    if (moved) {
      piece.moveCount = 1;
    }
  }

  board.start(side === "w" ? PieceColor.WHITE : PieceColor.BLACK);
  return board;
}
