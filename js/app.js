import { Application, event } from "melonjs";

// The smallest screen, in pixels, that everything fits on.
const WIDTH = 640;
const HEIGHT = 480;

// A window at least WIDTH by HEIGHT gets one screen pixel per game pixel,
// which keeps the pixel font sharp. A smaller one, like a phone's, is
// scaled down to fit, with the game stretched to fill the longer side.
function scaleMethod() {
  return window.innerWidth >= WIDTH && window.innerHeight >= HEIGHT
    ? "flex"
    : "fill-min";
}

// Pick the scale method again when the window changes size. melonJS resizes
// the canvas on the same event, after this, since this listens first.
event.on(event.WINDOW_ONRESIZE, () => {
  app.settings.scaleMethod = scaleMethod();
});
event.on(event.WINDOW_ONORIENTATION_CHANGE, () => {
  app.settings.scaleMethod = scaleMethod();
});

// The game application. It must be initialized (see game.js) before use.
export const app = new Application(WIDTH, HEIGHT, {
  parent: "screen",
  scale: "auto",
  scaleMethod: scaleMethod(),
});
