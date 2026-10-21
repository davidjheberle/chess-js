import { describe, expect, it } from "vitest";
import { FocusGroup, Key } from "./focus.js";

function items(count) {
  return Array.from({ length: count }, () => ({
    focused: false,
    presses: 0,
    onClick() {
      this.presses++;
    },
  }));
}

describe("FocusGroup", () => {
  it("focuses nothing until a key is pressed, then the first item", () => {
    const buttons = items(3);
    const group = new FocusGroup(buttons);
    expect(buttons.some((b) => b.focused)).toBe(false);
    group.onKey(Key.PRESS);
    expect(buttons[0].focused).toBe(true);
    expect(buttons[0].presses).toBe(0);
  });

  it("moves with the arrows, wrapping at either end", () => {
    const buttons = items(3);
    const group = new FocusGroup(buttons, 0);
    group.onKey(Key.UP);
    expect(group.focusedItem()).toBe(buttons[2]);
    group.onKey(Key.RIGHT);
    expect(group.focusedItem()).toBe(buttons[0]);
    group.onKey(Key.DOWN);
    expect(group.focusedItem()).toBe(buttons[1]);
    expect(buttons.filter((b) => b.focused)).toEqual([buttons[1]]);
  });

  it("presses the focused item", () => {
    const buttons = items(2);
    const group = new FocusGroup(buttons, 1);
    group.onKey(Key.PRESS);
    expect(buttons[1].presses).toBe(1);
    expect(buttons[0].presses).toBe(0);
  });
});
