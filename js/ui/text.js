import { Text } from "melonjs";

// The font used for all text. Swap in a pixel font here once one is loaded
// (as a "fontface" resource in resources.js).
export const FONT = "sans-serif";

// Text sizes: everything is SIZE except the game's title.
export const SIZE = "12pt";
export const TITLE_SIZE = "20pt";

// White text starting at x, vertically centered on y.
export function label(x, y, text, size = SIZE) {
  return new Text(x, y, {
    font: FONT,
    size,
    fillStyle: "#ffffff",
    textAlign: "left",
    textBaseline: "middle",
    text,
  });
}
