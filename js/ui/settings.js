import { event, input, UIBaseElement } from "melonjs";
import { app } from "../app.js";
import { boardLeft, centerY } from "../layout.js";
import { getVolume, setVolume } from "../sound.js";
import { Button } from "./button.js";
import { label } from "./text.js";

// Drawn above everything else on the screen, including the click-anywhere
// area at the end of a game.
const Z = 200;

// The gap around the panel's contents, and their width: the volume row,
// whose + button ends 224px from the left edge.
const MARGIN = 24;
const CONTENT_WIDTH = 224;

// Size and gap before the label of the volume - and + buttons.
const SMALL_BUTTON = { width: 40, padding: 16 };

// Dims the whole screen behind the panel, draws the panel, and swallows
// clicks and hovers so nothing underneath reacts while the panel is open.
class Backdrop extends UIBaseElement {
  constructor(panel) {
    super(0, 0, app.viewport.width, app.viewport.height);
    this.panel = panel;
  }

  onActivateEvent() {
    super.onActivateEvent();
    input.registerPointerEvent("pointermove", this, () => false);
  }

  onDeactivateEvent() {
    input.releasePointerEvent("pointermove", this);
    super.onDeactivateEvent();
  }

  draw(renderer) {
    renderer.setGlobalAlpha(0.75);
    renderer.setColor("#000");
    renderer.fillRect(this.pos.x, this.pos.y, this.width, this.height);
    renderer.setGlobalAlpha(1);
    const { x, y, width, height } = this.panel;
    renderer.setColor("#444");
    renderer.fillRect(x - 4, y - 4, width + 8, height + 8);
    renderer.setColor("#000");
    renderer.fillRect(x, y, width, height);
  }

  onClick() {
    return false;
  }

  onRelease() {
    return false;
  }
}

// The settings panel: volume, and in a game, buttons to resume or quit to
// the main menu. Esc opens and closes it. Call destroy when leaving the
// screen it belongs to.
export class Settings {
  // Pass onQuit to offer quitting the current game.
  constructor({ onQuit = null } = {}) {
    this.onQuit = onQuit;
    this.children = [];

    // Toggle on release, since holding a key repeats its keydown.
    input.bindKey(input.KEY.ESC, "settings");
    this.onKey = (action) => {
      if (action === "settings") {
        this.toggle();
      }
    };
    event.on(event.KEYUP, this.onKey);
  }

  isOpen() {
    return this.children.length > 0;
  }

  toggle() {
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    if (this.isOpen()) {
      return;
    }
    const x = boardLeft();
    const y = centerY();

    // The panel's contents run from the title down to the last button, each
    // reaching 20px either side of its center line.
    const top = y - 80;
    const bottom = this.onQuit ? y + 58 : y + 12;
    const panel = {
      x: x - MARGIN,
      y: top - 20 - MARGIN,
      width: CONTENT_WIDTH + 2 * MARGIN,
      height: bottom - top + 40 + 2 * MARGIN,
    };

    this.level = label(x + 148, y - 34, "");
    this.showVolume();

    this.children = [
      new Backdrop(panel),
      label(x, top, "settings"),
      label(x, y - 34, "volume"),
      new Button(
        x + 96,
        y - 34,
        "-",
        () => this.changeVolume(-1),
        SMALL_BUTTON,
      ),
      this.level,
      new Button(
        x + 184,
        y - 34,
        "+",
        () => this.changeVolume(1),
        SMALL_BUTTON,
      ),
      new Button(x, y + 12, this.onQuit ? "resume" : "back", () =>
        this.close(),
      ),
    ];
    if (this.onQuit) {
      this.children.push(new Button(x, y + 58, "quit to menu", this.onQuit));
    }
    this.children.forEach((child, i) => {
      app.world.addChild(child, Z + (i === 0 ? 0 : 1));
    });
  }

  close() {
    for (const child of this.children) {
      app.world.removeChild(child);
    }
    this.children = [];
  }

  // Raise or lower the volume by a step.
  changeVolume(step) {
    setVolume(getVolume() + step);
    this.showVolume();
  }

  showVolume() {
    const volume = getVolume();
    this.level.setText(volume === 0 ? "off" : String(volume));
  }

  // Stop listening for Esc.
  destroy() {
    event.off(event.KEYUP, this.onKey);
    input.unbindKey(input.KEY.ESC);
  }
}
