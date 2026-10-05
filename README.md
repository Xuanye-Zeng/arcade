# The Arcade

Xuanye Zeng's personal site and game arcade, built for Project 1 of the web development course. It is a small static site written by hand in HTML and CSS. It has no JavaScript, no build step and no CSS framework.

**Live site:** https://xuanye-zeng.github.io/arcade/

## Pages

| Path | Page |
| --- | --- |
| `/` | Front page: introduces the site and links to the puzzle |
| `/game/` | The Mini, a 5×5 crossword |
| `/about/` | Experience, projects, education and skills |
| `/contact/` | Email, GitHub, LinkedIn and location |

## How the crossword works without JavaScript

- **Grid:** CSS Grid with one `<input maxlength="1">` per open square. Each input has an `aria-label` for its row and column, and `aria-describedby` pointing at its across and down clues.
- **Word and clue highlighting:** `:has()` with `:focus`, for example `.puzzle:has(.a1 :focus) .a1`.
- **Check answers:** each input has `required` and a one-letter `pattern`. A checkbox toggles styles for `:valid` and `:invalid`.
- **Solved stamp:** `form:valid` matches only when every square is filled in correctly.
- **Reveal:** a `<details>` element. `:has(#solution[open])` shows the answer layer in the grid.
- **Clear:** a native `<button type="reset">`.

## Structure

```
index.html, home.css      front page and its styles
game/                     crossword page and game.css
about/                    about page and about.css
contact/                  contact page and contact.css
styles/global.css         design tokens, base styles, nav, footer (shared)
assets/icons/             SVG sprite (nav and brand icons) and favicon
assets/images/            portrait, puzzle preview, ornament
```

## Run locally

The nav icons come from an external SVG sprite, so open the site through a local server rather than `file://`:

```sh
python3 -m http.server 8000
# then visit http://localhost:8000/
```

## Credits

- Fonts: [Newsreader](https://fonts.google.com/specimen/Newsreader) and [Libre Franklin](https://fonts.google.com/specimen/Libre+Franklin), via Google Fonts (SIL Open Font License).
- GitHub and LinkedIn icons: [Simple Icons](https://simpleicons.org/) (CC0). All other icons and images are original SVG.
