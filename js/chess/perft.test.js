// Count every sequence of legal moves to a given depth and compare with
// well-known totals; any move generation bug changes the numbers.
// Positions and totals: https://www.chessprogramming.org/Perft_Results
import { describe, expect, it } from "vitest";
import { Board } from "./board.js";
import { fromFen, perft } from "./testing.js";

// Deep counts are slow, so allow more than the default 5 seconds.
describe("perft", { timeout: 30_000 }, () => {
  it("matches from the starting position", () => {
    const board = new Board();
    expect(perft(board, 1)).toBe(20);
    expect(perft(board, 2)).toBe(400);
    expect(perft(board, 3)).toBe(8902);
  });

  // Lots of castling, pins and promotions.
  it('matches from "Kiwipete"', () => {
    const board = fromFen(
      "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq -",
    );
    expect(perft(board, 1)).toBe(48);
    expect(perft(board, 2)).toBe(2039);
    expect(perft(board, 3)).toBe(97862);
  });

  // An endgame with en passant captures that would expose the king.
  it("matches from position 3", () => {
    const board = fromFen("8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - -");
    expect(perft(board, 1)).toBe(14);
    expect(perft(board, 2)).toBe(191);
    expect(perft(board, 3)).toBe(2812);
    expect(perft(board, 4)).toBe(43238);
  });
});
