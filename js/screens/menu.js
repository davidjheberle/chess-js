import { ColorLayer, Stage, state } from "melonjs";
import { boardLeft } from "../layout.js";
import { Button } from "../ui/button.js";
import { label } from "../ui/text.js";

export class MenuScreen extends Stage {
  /**
   * action to perform on state change
   */
  onResetEvent(app) {
    const x = boardLeft();
    const y = app.viewport.height / 2;

    app.world.addChild(new ColorLayer("background", "#000000"), -1);
    app.world.addChild(label(x, y - 60, "chess-js", 48), 1);
    app.world.addChild(
      new Button(x, y + 20, "play", () => state.change(state.PLAY)),
      1,
    );
  }
}
