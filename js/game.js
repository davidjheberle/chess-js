import { loader, plugin, state, utils } from "melonjs";
import { app } from "./app.js";
import { resources } from "./resources.js";
import { MenuScreen } from "./screens/menu.js";
import { PlayScreen } from "./screens/play.js";
import { SummaryScreen } from "./screens/summary.js";

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

  // Create the screens.
  state.set(state.MENU, new MenuScreen());
  state.set(state.PLAY, new PlayScreen());
  state.set(state.GAMEOVER, new SummaryScreen());

  // Start at the main menu.
  state.change(state.MENU, true);
}

onload();
