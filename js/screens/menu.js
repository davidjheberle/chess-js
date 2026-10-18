import { ColorLayer, Stage, state } from "melonjs";
import { Difficulty } from "../chess/ai.js";
import { PieceColor } from "../chess/enums.js";
import { Computer } from "../computer.js";
import { boardLeft, centerY } from "../layout.js";
import { Button } from "../ui/button.js";
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
    app.world.addChild(
      new Button(x, y + 52, "2 players", () => state.change(state.PLAY)),
      1,
    );

    // The computer plays black.
    app.world.addChild(label(x, y + 106, "vs computer"), 1);
    Object.values(Difficulty).forEach((difficulty, i) => {
      const computer = new Computer(PieceColor.BLACK, difficulty);
      app.world.addChild(
        new Button(x, y + 146 + i * 46, difficulty.name, () =>
          state.change(state.PLAY, false, computer),
        ),
        1,
      );
    });
  }
}
