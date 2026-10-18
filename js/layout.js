import { app } from "./app.js";

// Width and height of the board, in pixels.
export const BOARD_SIZE = 320;

// The middle of the screen, rounded down to a whole pixel so the pixel font
// and pieces stay sharp when the window is an odd number of pixels across.
export function centerX() {
  return Math.floor(app.viewport.width / 2);
}

export function centerY() {
  return Math.floor(app.viewport.height / 2);
}

// The x position of the board's left edge; all text lines up with it.
export function boardLeft() {
  return centerX() - BOARD_SIZE / 2;
}

// The y position of the line of text above the board.
export function aboveBoardY() {
  return centerY() - BOARD_SIZE / 2 - 56;
}
