import { expect, test } from "@playwright/test";

// The game is drawn on a canvas, so these tests click where things are
// drawn, and ask the game what it's showing through the hooks the "#test"
// URL fragment adds (see testHooks in js/game.js).

// Width and height of the board, and of a square on it, in game pixels
// (see js/layout.js).
const BOARD_SIZE = 320;
const SQUARE_SIZE = BOARD_SIZE / 8;

// Width of a button, and the gap before its label (see js/ui/button.js).
const BUTTON_WIDTH = 160;

// Ask the game something through its test hooks.
function ask(page, hook, ...args) {
  return page.evaluate(
    ([hook, args]) => window.chessTest[hook](...args),
    [hook, args],
  );
}

// Turn a point in game pixels, measured from the middle of the screen,
// into a point on the page.
async function onPage(page, dx, dy) {
  const size = await ask(page, "size");
  const box = await page.locator("#screen canvas").boundingBox();
  const scale = box.width / size.width;
  return {
    x: box.x + (Math.floor(size.width / 2) + dx) * scale,
    y: box.y + (Math.floor(size.height / 2) + dy) * scale,
  };
}

// The middle of a square, named as in "e2", on the page. White is at the
// bottom.
function square(page, name) {
  const column = "abcdefgh".indexOf(name[0]);
  const row = 8 - Number(name[1]);
  return onPage(
    page,
    -BOARD_SIZE / 2 + (column + 0.5) * SQUARE_SIZE,
    -BOARD_SIZE / 2 + (row + 0.5) * SQUARE_SIZE,
  );
}

// Click the middle of a button whose left edge lines up with the board and
// whose middle is dy below the middle of the screen.
async function clickButton(page, dy) {
  const { x, y } = await onPage(page, -BOARD_SIZE / 2 + BUTTON_WIDTH / 2, dy);
  await page.mouse.click(x, y);
}

// The menu's buttons, by how far below the middle of the screen they are
// (see js/screens/menu.js).
const MENU = { twoPlayers: -48, easy: 46 };

// The summary's buttons (see js/screens/summary.js).
const SUMMARY = { playAgain: 6, mainMenu: 52 };

// Move by clicking the piece, then the square it goes to. The game takes
// input as it draws each frame, so wait for the piece to be selected.
async function tapMove(page, from, to) {
  const a = await square(page, from);
  await page.mouse.click(a.x, a.y);
  await expect.poll(() => ask(page, "selected")).toBe(from);
  const b = await square(page, to);
  await page.mouse.click(b.x, b.y);
}

// Move by dragging the piece to the square it goes to.
async function dragMove(page, from, to) {
  const a = await square(page, from);
  const b = await square(page, to);
  await page.mouse.move(a.x, a.y);
  await page.mouse.down();
  await page.mouse.move(b.x, b.y, { steps: 10 });
  await page.mouse.up();
}

// Wait for a few frames. Something new on screen takes clicks once it has
// been updated: the game finds what's under the pointer among what it last
// updated.
function nextFrames(page) {
  return page.evaluate(async () => {
    for (let i = 0; i < 3; ++i) {
      await new Promise(requestAnimationFrame);
    }
  });
}

// Wait for a screen to show.
async function expectScreen(page, name) {
  await expect.poll(() => ask(page, "screen")).toBe(name);
  await nextFrames(page);
}

// Once the game is over, a click anywhere opens the summary.
async function continueToSummary(page) {
  await expect.poll(() => ask(page, "gameOver")).toBe(true);
  await nextFrames(page);
  await page.mouse.click(10, 10);
  await expectScreen(page, "summary");
}

// Errors thrown on the page during the test; there should be none.
let errors;

test.beforeEach(async ({ page }) => {
  errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/#test");
  await page.waitForFunction(() => window.chessTest);
  await expectScreen(page, "menu");
});

test.afterEach(() => {
  expect(errors).toEqual([]);
});

test("two players play to checkmate and go back to the menu", async ({
  page,
}) => {
  await clickButton(page, MENU.twoPlayers);
  await expectScreen(page, "play");
  expect(await ask(page, "turn")).toBe("white");

  // Fool's mate, moving by both tapping and dragging.
  await tapMove(page, "f2", "f3");
  expect(await ask(page, "piece", "f3")).toBe("white pawn");
  expect(await ask(page, "piece", "f2")).toBeNull();
  expect(await ask(page, "turn")).toBe("black");

  await dragMove(page, "e7", "e5");
  expect(await ask(page, "piece", "e5")).toBe("black pawn");

  // Not a legal move: nothing changes, and it's still white's turn.
  await tapMove(page, "g2", "g5");
  expect(await ask(page, "piece", "g2")).toBe("white pawn");
  expect(await ask(page, "turn")).toBe("white");

  await dragMove(page, "g2", "g4");
  await tapMove(page, "d8", "h4");
  expect(await ask(page, "piece", "h4")).toBe("black queen");

  await continueToSummary(page);
  expect(await ask(page, "summary")).toEqual(["checkmate", "black wins"]);

  await clickButton(page, SUMMARY.mainMenu);
  await expectScreen(page, "menu");
});

test("play again starts a new game", async ({ page }) => {
  await clickButton(page, MENU.twoPlayers);
  await expectScreen(page, "play");
  for (const [from, to] of [
    ["f2", "f3"],
    ["e7", "e5"],
    ["g2", "g4"],
    ["d8", "h4"],
  ]) {
    await tapMove(page, from, to);
  }
  await continueToSummary(page);

  await clickButton(page, SUMMARY.playAgain);
  await expectScreen(page, "play");
  expect(await ask(page, "piece", "f2")).toBe("white pawn");
  expect(await ask(page, "piece", "d8")).toBe("black queen");
  expect(await ask(page, "turn")).toBe("white");
});

test("the computer answers a move", async ({ page }) => {
  await clickButton(page, MENU.easy);
  await expectScreen(page, "play");

  await dragMove(page, "e2", "e4");
  expect(await ask(page, "piece", "e4")).toBe("white pawn");

  // It thinks in a worker, for at least half a second, then it's white's
  // turn again.
  await expect.poll(() => ask(page, "turn"), { timeout: 10_000 }).toBe("white");
});

test("the keyboard plays a move", async ({ page }) => {
  // The first key shows the focus on "2 players"; Enter presses it.
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await expectScreen(page, "play");

  // The first key shows the cursor on the king (e1). Pick up the pawn in
  // front of it and move it two squares.
  for (const key of ["ArrowUp", "ArrowUp", "Enter", "ArrowUp", "ArrowUp"]) {
    await page.keyboard.press(key);
  }
  await page.keyboard.press("Enter");
  expect(await ask(page, "piece", "e4")).toBe("white pawn");
  expect(await ask(page, "turn")).toBe("black");
});
