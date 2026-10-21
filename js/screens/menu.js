import { ColorLayer, Stage, state } from "melonjs";
import { Difficulty } from "../chess/ai.js";
import { PieceColor } from "../chess/enums.js";
import { Computer } from "../computer.js";
import { boardLeft, centerY } from "../layout.js";
import { Button } from "../ui/button.js";
import { FocusGroup } from "../ui/focus.js";
import { releaseKeys, takeKeys } from "../ui/keys.js";
import { Settings } from "../ui/settings.js";
import { label, TITLE_SIZE } from "../ui/text.js";

export class MenuScreen extends Stage {
  /**
   * action to perform on state change
   */
  onResetEvent(app) {
    const x = boardLeft();
    const y = centerY() - 100;

    app.world.addChild(new ColorLayer("background", "#000000"), -1);
    app.world.addChild(label(x, y, "chess-js", TITLE_SIZE), 1);
    const buttons = [
      new Button(x, y + 52, "2 players", () => state.change(state.PLAY)),
    ];

    // The computer plays black.
    app.world.addChild(label(x, y + 106, "vs computer"), 1);
    Object.values(Difficulty).forEach((difficulty, i) => {
      const computer = new Computer(PieceColor.BLACK, difficulty);
      buttons.push(
        new Button(x, y + 146 + i * 46, difficulty.name, () =>
          state.change(state.PLAY, false, computer),
        ),
      );
    });

    // Stage already has a "settings" property.
    this.settingsPanel = new Settings();
    buttons.push(
      new Button(x, y + 300, "settings", () => this.settingsPanel.open()),
    );
    for (const button of buttons) {
      app.world.addChild(button, 1);
    }

    // The arrow keys move between the buttons.
    this.keys = new FocusGroup(buttons);
    takeKeys(this.keys);
  }

  // What onResetEvent needs to lay the screen out again: nothing.
  relayoutArgs() {
    return [];
  }

  /**
   * action to perform when leaving this screen
   */
  onDestroyEvent() {
    releaseKeys(this.keys);
    this.settingsPanel.destroy();
  }
}
