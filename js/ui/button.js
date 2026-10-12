import { UIBaseElement } from "melonjs";
import { label } from "./text.js";

const WIDTH = 160;
const HEIGHT = 40;
const PADDING = 12;

// A clickable button with a text label, its left edge at x and vertically
// centered on y.
export class Button extends UIBaseElement {
  constructor(x, y, text, onClick) {
    super(x, y - HEIGHT / 2, WIDTH, HEIGHT);
    this.action = onClick;
    this.addChild(label(PADDING, HEIGHT / 2, text));
  }

  // Draw the background, lighter while hovered, then the label.
  draw(renderer, viewport) {
    renderer.setColor(this.hover ? "#666" : "#444");
    renderer.fillRect(this.pos.x, this.pos.y, this.width, this.height);
    super.draw(renderer, viewport);
  }

  onClick() {
    this.action();
    return false;
  }
}
