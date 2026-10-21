import { event, input } from "melonjs";
import { Key } from "./focus.js";

// Whatever is taking keys, the most recent last: a screen's buttons or
// board, then a panel opened over them. Only the last one gets keys.
const takers = [];

const MOVES = [Key.LEFT, Key.RIGHT, Key.UP, Key.DOWN];

// Bind the arrow keys, Enter and Space, and send them to whatever is taking
// keys: its onKey is called with a Key. Arrows repeat while held, but a
// press happens on release, since holding a key repeats its keydown.
export function initKeys() {
  input.bindKey(input.KEY.LEFT, Key.LEFT);
  input.bindKey(input.KEY.RIGHT, Key.RIGHT);
  input.bindKey(input.KEY.UP, Key.UP);
  input.bindKey(input.KEY.DOWN, Key.DOWN);
  input.bindKey(input.KEY.ENTER, Key.PRESS);
  input.bindKey(input.KEY.SPACE, Key.PRESS);
  event.on(event.KEYDOWN, (key) => {
    if (MOVES.includes(key)) {
      takers.at(-1)?.onKey(key);
    }
  });
  event.on(event.KEYUP, (key) => {
    if (key === Key.PRESS) {
      takers.at(-1)?.onKey(key);
    }
  });
}

// Start sending keys to taker, until it calls releaseKeys.
export function takeKeys(taker) {
  takers.push(taker);
}

export function releaseKeys(taker) {
  const index = takers.indexOf(taker);
  if (index >= 0) {
    takers.splice(index, 1);
  }
}
