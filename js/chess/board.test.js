import { describe, expect, it } from "vitest";
import { Board } from "./board.js";
import { PieceColor, PieceType } from "./enums.js";
import { at, moveCount, play, targets } from "./testing.js";

const { WHITE, BLACK } = PieceColor;
const { PAWN, ROOK, KNIGHT, QUEEN, KING } = PieceType;

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
});

describe("en passant", () => {
  it("captures a pawn that just stepped two squares past", () => {
    const board = new Board();
    play(board, "e2e4", "a7a6", "e4e5", "d7d5", "e5d6");
    expect(at(board, "d6").piece.color).toBe(WHITE);
    expect(at(board, "d5").piece).toBeNull();
    expect(board.captured).toHaveLength(1);
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
