# The Arcade

Xuanye Zeng's personal site and game arcade, built for Project 2 of the web
development course. It is a SvelteKit app holding a mini crossword and 2048,
plus the about and contact pages carried over from Project 1.

The rules of 2048 are not in this repository. They live in
[`@xuanye-zeng/arcade-core`](https://www.npmjs.com/package/@xuanye-zeng/arcade-core),
a package of pure functions that this app installs from npm like any other
dependency.

- **Live site:** https://xuanye-zeng.github.io/arcade/
- **Package repository:** https://github.com/Xuanye-Zeng/arcade-core

## Running it

```sh
npm install
npm run dev      # development server
npm test         # the tile tests, in plain Node
npm run build    # static build into build/
npm run preview  # serve the built site
```

Needs Node 18 or newer.

## Pages

| Path | Page |
| --- | --- |
| `/` | Front page: both games, a short intro and the best score so far |
| `/crossword/` | The Mini, a 5×5 crossword |
| `/2048/` | 2048 |
| `/about/` | Experience, projects, education and skills |
| `/contact/` | Email, GitHub, LinkedIn and location |

## Structure

```
src/
  app.css                     design tokens, base elements, buttons
  app.html                    the shell
  routes/                     one folder per page, thin files
  lib/
    components/               site chrome and page parts
      crossword/              the crossword, split into four components
      game2048/               the board, tiles, score, arrow pad, seed form
    data/                     nav links, the crossword grid, profile, contact
    state/
      game2048.svelte.js      the live game (shared, rune-based)
      scoreboard.svelte.js    the best score, shared across pages
      tiles.js                pure tile movement, testable in Node
      rng.js                  seeded random, for replayable games
    attachments/swipe.js      touch swipes on the 2048 board
static/                       sprite, favicon, portraits, previews
test/tiles.test.js            node --test
```

## 2048

The package answers *what does the board look like now*. The app adds the one
thing a screen needs on top of that: tile identity.

`moveTiles(board, direction)` returns the new board, the points earned, and
where every tile travelled. `src/lib/state/tiles.js` turns those paths into a
list of tiles with stable ids, so a keyed `{#each}` block slides the same
element from one square to the next instead of tearing it down and building a
new one. A merge is drawn as two tiles arriving in the same square: the one on
top takes the doubled value, the one underneath is marked absorbed and dropped
once the slide finishes.

Because that logic is a plain module with no runes and no DOM, the tests in
`test/tiles.test.js` play 40 seeded games through to game over and check, after
every single move and spawn, that the tiles on screen say exactly what the
board says.

Other details:

- **Colours.** Eleven tile steps and two more in reserve, all one hue, stepped
  by lightness. The ramp crosses from dark ink to light ink halfway down, so
  each step carries its own ink colour; every pair clears 4.5:1 in light and
  dark mode.
- **Saved games.** The board, the tiles, the score and the seed go into
  `localStorage` after every move, so closing the tab does not lose the game.
  The best score is stored separately and survives New game.
- **Seeds.** `spawn` takes any random function, so a seeded generator makes a
  game replayable. The generator's whole state is one integer, which is what
  lets a seeded game in progress survive a reload.
- **Input.** Arrow keys or W/A/S/D, swipe on touch devices, and on-screen
  arrows below the board on narrow screens.

## The crossword

In Project 1 the crossword was built from HTML form behaviour and CSS
selectors, with no JavaScript. It is now a Svelte component, which adds the
things CSS could not do: the cursor advances as you type, arrow keys move
around the grid, Space switches between across and down, Backspace steps back,
and clicking a clue jumps to the start of its word.

The grid itself is still described by hand only as far as the answers and the
clues go. `src/lib/data/crossword.js` numbers the squares and works out the
across and down words the way a setter would, so moving a black square does not
mean renumbering clues by hand.

## Accessibility

- Every page is usable with a keyboard alone, with a visible focus ring and a
  skip link as the first stop.
- Score and game-over changes are announced through an `aria-live` region, and
  so is the crossword's solved state.
- All text clears 4.5:1, including the tile numbers on their coloured
  backgrounds, in both light and dark mode.
- Lighthouse accessibility is 100 on all five routes.
- Both games work from 320px up.

## Credits

- Game logic: [`@xuanye-zeng/arcade-core`](https://www.npmjs.com/package/@xuanye-zeng/arcade-core), written for this project.
- Fonts: [Newsreader](https://fonts.google.com/specimen/Newsreader) and [Libre Franklin](https://fonts.google.com/specimen/Libre+Franklin), via Google Fonts (SIL Open Font License).
- GitHub and LinkedIn icons: [Simple Icons](https://simpleicons.org/) (CC0). All other icons and images are original SVG.
