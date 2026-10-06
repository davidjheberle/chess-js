import { Application } from "melonjs";

// The game application. It must be initialized (see game.js) before use.
export const app = new Application(640, 480, {
  parent: "screen",
  scale: "auto",
  scaleMethod: "flex"
});
