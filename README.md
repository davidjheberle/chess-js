chess-js
-------------------------------------------------------------------------------

A chess game for two players, or one against the computer (easy, medium or
hard), built with [melonJS](https://melonjs.org) 20.x and bundled with
[Vite](https://vite.dev).

Drag pieces with the mouse or a finger; on a touch screen the piece is held
a square above your finger so you can see it, and drops on the outlined
square. Or click or tap a piece, then the square it goes to. During a game, the menu button or Esc opens the settings, where you can set
the volume or quit to the main menu.

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
    npm run lint    # Biome lint + format check; `npm run fix` applies fixes

CI runs both, plus the build, on every pull request.

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
