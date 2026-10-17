import { describe, expect, it } from "vitest";
import { Board } from "./board.js";
import { PieceColor, PieceType } from "./enums.js";
import { at, fromFen, moveCount, play, targets } from "./testing.js";

const { WHITE, BLACK } = PieceColor;
const { PAWN, ROOK, KNIGHT, BISHOP, QUEEN, KING } = PieceType;

describe("starting position", () => {
  it("has white to move with 20 moves", () => {
    const board = new Board();
    expect(board.turnOwner).toBe(WHITE);
    expect(moveCount(board)).toBe(20);
  });

  it("gives black 20 replies", () => {
    const board = new Board();
    play(board, "e2e4");
    expect(board.turnOwner).toBe(BLACK);
    expect(moveCount(board)).toBe(20);
  });

  it("lets knights jump and pawns step one or two", () => {
    const board = new Board();
    expect(targets(board, "g1")).toEqual(["f3", "h3"]);
    expect(targets(board, "e2")).toEqual(["e3", "e4"]);
    expect(targets(board, "a1")).toEqual([]);
  });
});

describe("moving", () => {
  it("rejects moving the other player's piece", () => {
    const board = new Board();
    expect(board.move(at(board, "e7"), at(board, "e5"))).toBe(false);
    expect(board.turnOwner).toBe(WHITE);
  });

  it("rejects a move the piece can't make", () => {
    const board = new Board();
    expect(board.move(at(board, "e2"), at(board, "e5"))).toBe(false);
    expect(at(board, "e2").piece.type).toBe(PAWN);
  });

  it("doesn't let a pawn's double step jump over a piece", () => {
    const board = new Board();
    play(board, "b1c3");
    expect(targets(board, "c2")).toEqual([]);
    play(board, "b8c6");
    expect(targets(board, "c7")).toEqual([]);
  });

  it("captures by removing the target from the board", () => {
    const board = new Board();
    play(board, "e2e4", "d7d5", "e4d5");
    expect(at(board, "d5").piece.color).toBe(WHITE);
    expect(board.captured).toHaveLength(1);
    expect(board.captured[0].isDead()).toBe(true);
  });

  it("doesn't let the king step onto an attacked square", () => {
    const board = new Board({ empty: true });
    board.addPiece(KING, WHITE, 7, 4); // e1
    board.addPiece(ROOK, BLACK, 0, 3); // d8
    board.addPiece(KING, BLACK, 0, 7); // h8
    board.start(WHITE);
    expect(targets(board, "e1")).toEqual(["e2", "f1", "f2"]);
  });
});

describe("check", () => {
  function kingBoard() {
    const board = new Board({ empty: true });
    board.addPiece(KING, BLACK, 0, 0); // a8
    return board;
  }

  it("doesn't let a pinned piece move", () => {
    const board = kingBoard();
    board.addPiece(KING, WHITE, 7, 4); // e1
    board.addPiece(BISHOP, WHITE, 6, 4); // e2
    board.addPiece(ROOK, BLACK, 0, 4); // e8
    board.start(WHITE);
    expect(targets(board, "e2")).toEqual([]);
  });

  it("only allows moves that get out of check", () => {
    const board = kingBoard();
    board.addPiece(KING, WHITE, 7, 4); // e1
    board.addPiece(ROOK, WHITE, 6, 0); // a2
    board.addPiece(ROOK, BLACK, 0, 4); // e8
    board.start(WHITE);
    expect(targets(board, "a2")).toEqual(["e2"]);
  });

  it("doesn't let the king retreat along the line it's attacked on", () => {
    const board = kingBoard();
    board.addPiece(KING, WHITE, 6, 4); // e2
    board.addPiece(ROOK, BLACK, 0, 4); // e8
    board.start(WHITE);
    expect(targets(board, "e2")).not.toContain("e1");
  });

  it("doesn't let the king capture a piece defended by the other king", () => {
    const board = new Board({ empty: true });
    board.addPiece(KING, WHITE, 7, 4); // e1
    board.addPiece(KNIGHT, BLACK, 6, 4); // e2
    board.addPiece(KING, BLACK, 5, 4); // e3
    board.start(WHITE);
    expect(targets(board, "e1")).not.toContain("e2");
  });
});

describe("castling", () => {
  it("castles kingside", () => {
    const board = new Board();
    play(board, "e2e4", "e7e5", "g1f3", "b8c6", "f1c4", "g8f6", "e1g1");
    expect(at(board, "g1").piece.type).toBe(KING);
    expect(at(board, "f1").piece.type).toBe(ROOK);
    expect(at(board, "h1").piece).toBeNull();
  });

  it("castles queenside", () => {
    const board = new Board();
    play(board, "d2d4", "d7d5", "b1c3", "b8c6", "c1f4", "c8f5");
    play(board, "d1d2", "d8d7", "e1c1");
    expect(at(board, "c1").piece.type).toBe(KING);
    expect(at(board, "d1").piece.type).toBe(ROOK);
    expect(at(board, "a1").piece).toBeNull();
  });

  it("isn't allowed after the king has moved", () => {
    const board = new Board();
    play(board, "e2e4", "e7e5", "g1f3", "b8c6", "f1c4", "g8f6");
    play(board, "e1e2", "f8e7", "e2e1", "e8g8");
    expect(targets(board, "e1")).not.toContain("g1");
  });

  function castlingBoard(attackerColumn) {
    const board = new Board({ empty: true });
    board.addPiece(KING, WHITE, 7, 4); // e1
    board.addPiece(ROOK, WHITE, 7, 7); // h1
    board.addPiece(ROOK, BLACK, 0, attackerColumn);
    board.addPiece(KING, BLACK, 0, 0); // a8
    board.start(WHITE);
    return board;
  }

  it("isn't allowed out of check", () => {
    expect(targets(castlingBoard(4), "e1")).not.toContain("g1");
  });

  it("isn't allowed through an attacked square", () => {
    expect(targets(castlingBoard(5), "e1")).not.toContain("g1");
  });

  it("isn't allowed into an attacked square", () => {
    expect(targets(castlingBoard(6), "e1")).not.toContain("g1");
  });

  it("is allowed when nothing is attacked", () => {
    expect(targets(castlingBoard(2), "e1")).toContain("g1");
  });

  it("is allowed queenside when only the rook's path is attacked", () => {
    const board = new Board({ empty: true });
    board.addPiece(KING, WHITE, 7, 4); // e1
    board.addPiece(ROOK, WHITE, 7, 0); // a1
    board.addPiece(ROOK, BLACK, 0, 1); // b8, attacks b1
    board.addPiece(KING, BLACK, 0, 7); // h8
    board.start(WHITE);
    expect(targets(board, "e1")).toContain("c1");
  });
});

describe("en passant", () => {
  it("captures a pawn that just stepped two squares past", () => {
    const board = new Board();
    play(board, "e2e4", "a7a6", "e4e5", "d7d5", "e5d6");
    expect(at(board, "d6").piece.color).toBe(WHITE);
    expect(at(board, "d5").piece).toBeNull();
    expect(board.captured).toHaveLength(1);
  });

  it("isn't allowed against a pawn that stepped one square", () => {
    const board = new Board();
    play(board, "e2e4", "a7a6", "e4e5", "a6a5", "e5e6", "d7d6");
    expect(targets(board, "e6")).not.toContain("d7");
  });

  it("isn't allowed against a piece that isn't a pawn", () => {
    const board = new Board({ empty: true });
    board.addPiece(KING, WHITE, 7, 4); // e1
    board.addPiece(PAWN, WHITE, 3, 4); // e5
    board.addPiece(KNIGHT, BLACK, 1, 6); // g7
    board.addPiece(KING, BLACK, 0, 7); // h8
    board.start(BLACK);
    play(board, "g7f5");
    expect(targets(board, "e5")).not.toContain("f6");
  });

  it("is only allowed straight away", () => {
    const board = new Board();
    play(board, "e2e4", "a7a6", "e4e5", "d7d5", "h2h3", "h7h6");
    expect(targets(board, "e5")).not.toContain("d6");
  });
});

describe("promotion", () => {
  function promotionBoard() {
    const board = new Board({ empty: true });
    board.addPiece(KING, WHITE, 7, 4); // e1
    board.addPiece(PAWN, WHITE, 1, 0); // a7
    board.addPiece(KING, BLACK, 0, 7); // h8
    board.start(WHITE);
    play(board, "a7a8");
    return board;
  }

  it("waits for a piece to be chosen before ending the turn", () => {
    const board = promotionBoard();
    expect(board.isPromotingPawn()).toBe(true);
    expect(board.turnOwner).toBe(WHITE);
    expect(board.move(at(board, "e1"), at(board, "e2"))).toBe(false);
  });

  it("turns the pawn into the chosen piece", () => {
    const board = promotionBoard();
    expect(board.finishPawnPromotion(KNIGHT)).toBe(true);
    expect(at(board, "a8").piece.type).toBe(KNIGHT);
    expect(board.turnOwner).toBe(BLACK);
  });

  it("can promote to a piece the player has none of", () => {
    const board = promotionBoard();
    expect(board.finishPawnPromotion(QUEEN)).toBe(true);
    expect(at(board, "a8").piece.type).toBe(QUEEN);
  });

  it("can't promote to a king or a pawn", () => {
    const board = promotionBoard();
    expect(board.finishPawnPromotion(KING)).toBe(false);
    expect(board.finishPawnPromotion(PAWN)).toBe(false);
    expect(board.isPromotingPawn()).toBe(true);
  });
});

describe("game end", () => {
  it("isn't over at the start", () => {
    const board = new Board();
    expect(board.isGameOver()).toBe(false);
  });

  it("detects checkmate (fool's mate)", () => {
    const board = new Board();
    play(board, "f2f3", "e7e5", "g2g4", "d8h4");
    expect(board.isCheckmate()).toBe(true);
    expect(board.isStalemate()).toBe(false);
    expect(board.isGameOver()).toBe(true);
    expect(board.turnOwner).toBe(WHITE);
    expect(board.move(at(board, "e2"), at(board, "e4"))).toBe(false);
  });

  it("isn't checkmate when the check can be escaped", () => {
    const board = new Board();
    play(board, "e2e4", "f7f5", "d1h5");
    expect(board.isInCheck(BLACK)).toBe(true);
    expect(board.isCheckmate()).toBe(false);
    expect(board.isGameOver()).toBe(false);
  });

  it("detects stalemate", () => {
    const board = new Board({ empty: true });
    board.addPiece(KING, BLACK, 0, 0); // a8
    board.addPiece(QUEEN, WHITE, 2, 1); // b6
    board.addPiece(KING, WHITE, 2, 2); // c6
    board.start(BLACK);
    expect(board.isStalemate()).toBe(true);
    expect(board.isCheckmate()).toBe(false);
    expect(board.hasNoLegalMoves()).toBe(true);
    expect(board.drawReason()).toBe("stalemate");
    expect(board.isGameOver()).toBe(true);
  });
});

describe("insufficient material", () => {
  const drawn = (fen) => {
    const board = fromFen(fen);
    expect(board.hasNoLegalMoves()).toBe(false);
    return board.hasInsufficientMaterial();
  };

  it("draws king vs king", () => {
    const board = fromFen("8/8/4k3/8/8/4K3/8/8 w - -");
    expect(board.hasInsufficientMaterial()).toBe(true);
    expect(board.drawReason()).toBe("insufficient material");
    expect(board.isGameOver()).toBe(true);
    expect(board.isCheckmate()).toBe(false);
  });

  it("draws king and bishop or knight vs king", () => {
    expect(drawn("8/8/4k3/8/8/4K3/8/5B2 w - -")).toBe(true);
    expect(drawn("8/8/4k3/8/8/4K3/8/6n1 w - -")).toBe(true);
  });

  it("draws when every bishop is on the same color", () => {
    // f1 and c8 are both light squares.
    expect(drawn("2b5/8/4k3/8/8/4K3/8/5B2 w - -")).toBe(true);
    // f1, d3 and h3 are all light squares.
    expect(drawn("8/8/4k3/8/8/3BK2B/8/5B2 w - -")).toBe(true);
  });

  it("plays on with bishops on both colors", () => {
    // f1 is light, f8 is dark.
    expect(drawn("5b2/8/4k3/8/8/4K3/8/5B2 w - -")).toBe(false);
    expect(drawn("8/8/4k3/8/8/4K3/8/4BB2 w - -")).toBe(false);
  });

  it("plays on with any mating material", () => {
    expect(drawn("8/8/4k3/8/8/4K3/8/5N1N w - -")).toBe(false); // two knights
    expect(drawn("8/8/4k3/8/8/4K3/8/5Nb1 w - -")).toBe(false); // knight vs bishop
    expect(drawn("8/8/4k3/8/8/4K3/8/5BN1 w - -")).toBe(false);
    expect(drawn("8/8/4k3/8/8/4K3/8/7R w - -")).toBe(false);
    expect(drawn("8/8/4k3/8/8/4K3/8/7Q w - -")).toBe(false);
    expect(drawn("8/8/4k3/8/8/4K3/P7/8 w - -")).toBe(false);
  });

  it("isn't drawn at the start", () => {
    const board = new Board();
    expect(board.hasInsufficientMaterial()).toBe(false);
    expect(board.drawReason()).toBe(null);
  });

  it("ends the game when the last capture leaves too little", () => {
    // White's king takes black's last rook.
    const board = fromFen("8/8/4k3/8/8/8/3r4/4K3 w - -");
    expect(board.isGameOver()).toBe(false);
    play(board, "e1d2");
    expect(board.isGameOver()).toBe(true);
    expect(board.drawReason()).toBe("insufficient material");
  });
});
