import { UIBaseElement } from "melonjs";

// An invisible area that calls onClick when clicked anywhere inside it.
export class ClickArea extends UIBaseElement {
  constructor(x, y, width, height, onClick) {
    super(x, y, width, height);
    this.action = onClick;
  }

  onClick() {
    this.action();
    return false;
  }
}
