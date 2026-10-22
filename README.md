chess-js
-------------------------------------------------------------------------------

A chess game for two players, or one against the computer (easy, medium or
hard), built with [melonJS](https://melonjs.org) 20.x and bundled with
[Vite](https://vite.dev).

Drag pieces with the mouse or a finger; on a touch screen the piece is held
well above your finger so you can see it, and drops on the outlined square. Or
click or tap a piece, then the square it goes to. During a game, the menu
button or Esc opens the settings, where you can set the volume or quit to the
main menu.

Everything also works from the keyboard. The arrow keys move between buttons,
and Enter or Space presses one. On the board, the arrow keys move a blue
cursor (it appears on your king at the first key press); press Enter on a
piece to pick it up, then on the square it goes to. Pressing Enter on the
picked-up piece puts it back. When a pawn promotes, the queen is chosen
unless you move to another piece first.

## Running

Install [node](http://nodejs.org) 24 LTS or newer (the version is pinned in
`.nvmrc`; `fnm use` or `nvm use` picks it up), then in the project directory:

    npm install

Start the dev server (with live reload) on http://localhost:8000:

    npm run dev

Add `#debug` to the URL to enable the melonJS debug panel.

## Building

    npm run build

This creates a `build` directory containing the files that can be uploaded to
a server. All paths are relative, so it can be served from any sub-directory.
Preview the build locally with:

    npm run preview

## Checking

    npm test        # rules tests (Vitest)
    npm run e2e     # end-to-end tests of the built game (Playwright)
    npm run lint    # Biome lint + format check; `npm run fix` applies fixes

The end-to-end tests in `e2e/` build the game, serve it and play it in
headless Chromium: they click through the menu, play moves by clicking,
dragging and from the keyboard, and reach the summary. Run
`npx playwright install chromium` once first. Since the game is drawn on a
canvas, the tests open it with `#test` in the URL, which lets them ask the
game which screen is showing and where the pieces are.

CI runs all three, plus the build, on every pull request. When the
end-to-end tests fail there, the Playwright report (with screenshots and
traces) is attached to the run.

## Deploying

Pushes to `main` are built and published to GitHub Pages by
`.github/workflows/deploy.yml`: https://davidjheberle.github.io/chess-js/

## Layout

- `index.html` – page shell; loads `js/game.js` as an ES module.
- `js/chess/` – the chess rules and game state, with no melonJS code, and
  their tests (`npm test`). `ai.js` is the computer opponent, an alpha-beta
  search run in a Web Worker (`ai.worker.js`) so the game keeps drawing
  while it thinks.
- `js/` – the melonJS view: draws the board and pieces and handles input.
- `public/` – static assets copied as-is into the build (`data/`, `icons/`, `manifest.json`).
- `resources/` – source art (not shipped).

-------------------------------------------------------------------------------
melonJS is licensed under the [MIT License](http://www.opensource.org/licenses/mit-license.php)
