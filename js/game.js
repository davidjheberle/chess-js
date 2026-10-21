import { event, loader, plugin, state, utils } from "melonjs";
import { app } from "./app.js";
import { resources } from "./resources.js";
import { MenuScreen } from "./screens/menu.js";
import { PlayScreen } from "./screens/play.js";
import { SummaryScreen } from "./screens/summary.js";
import { initKeys } from "./ui/keys.js";

// How long the window must keep its size before the screen is laid out
// again, in milliseconds. Turning a phone sends several resizes.
const RELAYOUT_DELAY = 200;

// Lay the current screen out again for the window's new size, keeping its
// state (such as the game in progress). Screens place everything when they
// start, from the size of the window then.
function relayout() {
  const stage = state.current();
  if (typeof stage?.relayoutArgs !== "function") {
    return;
  }
  const args = stage.relayoutArgs();
  stage.destroy(app);
  stage.reset(app, ...args);
}

let relayoutTimer;
function relayoutSoon() {
  clearTimeout(relayoutTimer);
  relayoutTimer = setTimeout(relayout, RELAYOUT_DELAY);
}
event.on(event.WINDOW_ONRESIZE, relayoutSoon);
event.on(event.WINDOW_ONORIENTATION_CHANGE, relayoutSoon);

// Run on page load.
async function onload() {
  // Initialize the video.
  try {
    await app.init();
  } catch {
    alert("Your browser does not support HTML5 canvas.");
    return;
  }

  // Add "#debug" to the URL to enable the debug Panel.
  if (utils.getUriFragment().debug === true) {
    const { DebugPanelPlugin } = await import("@melonjs/debug-plugin");
    plugin.register(DebugPanelPlugin, "debugPanel");
  }

  // Set and load all resources.
  // (this will also automatically switch to the loading screen)
  await loader.preload(resources);

  // Send the arrow keys, Enter and Space to the screens.
  initKeys();

  // Create the screens.
  state.set(state.MENU, new MenuScreen());
  state.set(state.PLAY, new PlayScreen());
  state.set(state.GAMEOVER, new SummaryScreen());

  // Start at the main menu.
  state.change(state.MENU, true);
}

onload();
