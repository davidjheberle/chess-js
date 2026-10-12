import { Text } from "melonjs";

// The font used for all text. Swap in a pixel font here once one is loaded
// (as a "fontface" resource in resources.js).
export const FONT = "sans-serif";

// White text starting at x, vertically centered on y.
export function label(x, y, text, size = 20) {
  return new Text(x, y, {
    font: FONT,
    size,
    fillStyle: "#ffffff",
    textAlign: "left",
    textBaseline: "middle",
    text,
  });
}
