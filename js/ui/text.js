import { Text } from "melonjs";

// The font used for all text, loaded in resources.js. It's a bitmap font
// drawn on a 16px grid, so it's only sharp at multiples of 16px.
export const FONT = "Fixedsys Excelsior";

// Text sizes: everything is SIZE except the game's title.
export const SIZE = "16px";
export const TITLE_SIZE = "32px";

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
