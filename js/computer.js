import { Difficulty } from "./chess/ai.js";

// The shortest time the computer seems to think for, in milliseconds, so
// its quick moves don't look instant.
const MIN_THINK_TIME = 500;

// A computer player that chooses moves in a worker.
export class Computer {
  // Init with the color it plays and a Difficulty.
  constructor(color, difficulty = Difficulty.MEDIUM) {
    this.color = color;
    this.difficulty = difficulty;
    this.worker = null;
    this.thinking = false;
  }

  // Choose a move for the game's turn owner and call onMove with its
  // { from, to } squares in the game.
  think(game, onMove) {
    this.worker ??= new Worker(
      new URL("./chess/ai.worker.js", import.meta.url),
      {
        type: "module",
      },
    );
    this.thinking = true;
    const started = performance.now();
    this.worker.onmessage = ({ data }) => {
      const wait = Math.max(0, MIN_THINK_TIME - (performance.now() - started));
      this.timeout = setTimeout(() => {
        this.thinking = false;
        onMove({
          from: game.getSquare(data.from.row, data.from.column),
          to: game.getSquare(data.to.row, data.to.column),
        });
      }, wait);
    };
    this.worker.postMessage({
      board: game.snapshot(),
      difficulty: this.difficulty,
      positions: game.positions,
    });
  }

  // Stop thinking and shut the worker down.
  stop() {
    clearTimeout(this.timeout);
    this.worker?.terminate();
    this.worker = null;
    this.thinking = false;
  }
}
