// What the keyboard does: the arrow keys move, and Enter or Space presses
// whatever is focused.
export const Key = {
  LEFT: "left",
  RIGHT: "right",
  UP: "up",
  DOWN: "down",
  PRESS: "press",
};

// A row or column of things the keyboard can focus and press, such as a
// screen's buttons. Each item has a focused flag it draws itself by, and an
// onClick to press it. Nothing is focused until a key is pressed, so the
// mouse and touch look as they did. Up and left focus the previous item,
// down and right the next, wrapping around at either end.
export class FocusGroup {
  // Pass the index of an item to focus now, rather than waiting for a key.
  constructor(items, focused = -1) {
    this.items = items;
    this.index = -1;
    if (focused >= 0) {
      this.focus(focused);
    }
  }

  // Focus the item at index, unfocusing the last one.
  focus(index) {
    if (this.items[this.index]) {
      this.items[this.index].focused = false;
    }
    this.index = index;
    this.items[index].focused = true;
  }

  // The focused item, or undefined.
  focusedItem() {
    return this.items[this.index];
  }

  onKey(key) {
    const count = this.items.length;
    if (this.index < 0) {
      // The first key shows where the focus is.
      this.focus(0);
    } else if (key === Key.PRESS) {
      this.focusedItem().onClick();
    } else {
      const step = key === Key.UP || key === Key.LEFT ? -1 : 1;
      this.focus((this.index + step + count) % count);
    }
  }
}
