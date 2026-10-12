import { app } from "./app.js";

// Width and height of the board, in pixels.
export const BOARD_SIZE = 320;

// The x position of the board's left edge; all text lines up with it.
export function boardLeft() {
  return (app.viewport.width - BOARD_SIZE) / 2;
}
