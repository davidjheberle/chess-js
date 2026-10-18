import { describe, expect, it } from "vitest";
import { afterMove, chooseMove, Difficulty, evaluate } from "./ai.js";
import { Board } from "./board.js";
import { PieceType } from "./enums.js";
import { at, fromFen, nameOf } from "./testing.js";

// The chosen move written as "e2e4".
function choose(board, difficulty, positions) {
  const move = chooseMove(board, difficulty, positions);
  const name = ({ row, column }) => nameOf(board.getSquare(row, column));
  return name(move.from) + name(move.to);
}

const levels = Object.values(Difficulty);

describe("evaluate", () => {
  it("scores the starting position as even", () => {
    expect(evaluate(new Board())).toBe(0);
  });

  it("scores from the turn owner's side", () => {
    const white = fromFen("4k3/8/8/8/8/8/8/Q3K3 w - -");
    const black = fromFen("4k3/8/8/8/8/8/8/Q3K3 b - -");
    expect(evaluate(white)).toBeGreaterThan(800);
    expect(evaluate(black)).toBe(-evaluate(white));
  });
});

describe("afterMove", () => {
  it("plays the move and passes the turn", () => {
    const board = new Board();
    const next = afterMove(board, at(board, "e2").piece.behavior.moves[1]);
    expect(at(next, "e4").piece?.type).toBe(PieceType.PAWN);
    expect(at(board, "e2").piece?.type).toBe(PieceType.PAWN);
    expect(next.turnOwner).not.toBe(board.turnOwner);
  });

  it("promotes pawns to queens", () => {
    const board = fromFen("8/P6k/8/8/8/8/8/K7 w - -");
    const next = afterMove(board, at(board, "a7").piece.behavior.moves[0]);
    expect(at(next, "a8").piece.type).toBe(PieceType.QUEEN);
  });
});

describe("chooseMove", () => {
  it.each(levels)("mates in one on $name", (difficulty) => {
    const board = fromFen("6k1/5ppp/8/8/8/8/8/R5K1 w - -");
    expect(choose(board, difficulty)).toBe("a1a8");
  });

  it.each([Difficulty.MEDIUM, Difficulty.HARD])(
    "takes a free queen on $name",
    (difficulty) => {
      const board = fromFen("4k3/8/8/3q4/4P3/8/8/4K3 w - -");
      expect(choose(board, difficulty)).toBe("e4d5");
    },
  );

  it("doesn't take a guarded pawn with the queen", () => {
    const board = fromFen("4k3/8/4p3/3p4/8/8/8/3QK3 w - -");
    expect(choose(board, Difficulty.HARD)).not.toBe("d1d5");
  });

  it("finds a mate in two on hard", () => {
    // A ladder: one rook takes the 7th rank, the other mates on the 8th.
    const board = fromFen("6k1/8/8/8/8/8/R7/1R4K1 w - -");
    for (let i = 0; i < 3; ++i) {
      const { from, to } = chooseMove(board, Difficulty.HARD);
      board.move(
        board.getSquare(from.row, from.column),
        board.getSquare(to.row, to.column),
      );
    }
    expect(board.isCheckmate()).toBe(true);
  });

  // The position each move leads to, keyed by the move's name.
  function keysAfterMoves(board) {
    const keys = {};
    for (const piece of board.getPieces(board.turnOwner)) {
      for (const move of piece.behavior.moves) {
        keys[nameOf(move.from) + nameOf(move.to)] = afterMove(
          board,
          move,
        ).positions.at(-1);
      }
    }
    return keys;
  }

  it("avoids repeating a position when ahead", () => {
    const board = fromFen("4k3/8/8/8/8/8/8/Q3K3 w - -");
    const best = choose(board, Difficulty.HARD);
    const key = keysAfterMoves(board)[best];
    expect(choose(board, Difficulty.HARD, [key])).not.toBe(best);
  });

  it("repeats a position when behind", () => {
    const board = fromFen("q3k3/8/8/8/8/8/8/4K3 w - -");
    const key = keysAfterMoves(board).e1f2;
    expect(choose(board, Difficulty.HARD, [key])).toBe("e1f2");
  });

  it("returns null with no legal moves", () => {
    const board = fromFen("k7/2Q5/1K6/8/8/8/8/8 b - -");
    expect(chooseMove(board, Difficulty.EASY)).toBeNull();
  });
});
