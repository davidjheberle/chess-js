import { UIBaseElement } from "melonjs";
import { playSound, Sound } from "../sound.js";
import { label } from "./text.js";

const WIDTH = 160;
const HEIGHT = 40;
const PADDING = 12;

// A clickable button with a text label, its left edge at x and vertically
// centered on y. A narrower button can pass its width, and the gap before
// its label.
export class Button extends UIBaseElement {
  constructor(x, y, text, onClick, { width = WIDTH, padding = PADDING } = {}) {
    super(x, y - HEIGHT / 2, width, HEIGHT);
    this.action = onClick;
    this.addChild(label(padding, HEIGHT / 2, text));
  }

  // Draw the background, lighter while hovered, then the label.
  draw(renderer, viewport) {
    renderer.setColor(this.hover ? "#666" : "#444");
    renderer.fillRect(this.pos.x, this.pos.y, this.width, this.height);
    super.draw(renderer, viewport);
  }

  onClick() {
    // The click sounds after the action, so a volume button is heard at
    // the new volume.
    this.action();
    playSound(Sound.BUTTON);
    return false;
  }
}
