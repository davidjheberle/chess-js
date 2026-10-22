import { event, loader, plugin, state, utils } from "melonjs";
import { app } from "./app.js";
import { PieceColor, PieceType } from "./chess/enums.js";
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

  // Add "#test" to the URL to let the end-to-end tests (e2e/) see what the
  // game is showing, since it's all drawn on a canvas.
  if (utils.getUriFragment().test === true) {
    window.chessTest = testHooks();
  }
}

// What the end-to-end tests can ask: the game's size in game pixels, which
// screen is showing, whether the game is over, whose turn it is, what is on
// a square and which square's piece is selected (squares named as in "e2"),
// and the summary's lines.
function testHooks() {
  const screens = {
    menu: state.MENU,
    play: state.PLAY,
    summary: state.GAMEOVER,
  };
  const nameOf = (values, value) =>
    Object.keys(values)
      .find((key) => values[key] === value)
      .toLowerCase();
  const board = () => state.current().board;
  const game = () => board().game;
  const squareName = (square) => "abcdefgh"[square.column] + (8 - square.row);
  return {
    size() {
      return { width: app.viewport.width, height: app.viewport.height };
    },
    screen() {
      return Object.keys(screens).find((name) =>
        state.isCurrent(screens[name]),
      );
    },
    gameOver() {
      return game().isGameOver();
    },
    turn() {
      return nameOf(PieceColor, game().turnOwner);
    },
    piece(name) {
      const square = game().getSquare(
        8 - Number(name[1]),
        "abcdefgh".indexOf(name[0]),
      );
      const piece = square.piece;
      return piece
        ? `${nameOf(PieceColor, piece.color)} ${nameOf(PieceType, piece.type)}`
        : null;
    },
    selected() {
      const square = board().selected?.piece.square;
      return square ? squareName(square) : null;
    },
    summary() {
      return state.current().lines;
    },
  };
}

onload();
