// Turning a board move into tile movement.
//
// The package answers "what does the board look like now". The screen also
// needs "which tile went where", so the same element can slide from one
// square to the next instead of being thrown away and rebuilt. These helpers
// are plain functions with no state of their own, so they can be tested in
// Node without a browser.

const key = (x, y) => `${x},${y}`;

/**
 * Moves every tile to where the board move sent it.
 *
 * A merge arrives as two entries landing on the same square: the one marked
 * `merged` is the tile that disappears into the other, so it is flagged
 * `absorbed` and the one underneath it takes the doubled value. Absorbed
 * tiles are kept for now so they can be seen sliding in, and dropped by
 * `settle` once the slide is over.
 *
 * Tiles keep their place in the array, so the keyed each block never has to
 * reorder the DOM.
 */
export function slideTiles(tiles, moves) {
  const moveFrom = new Map(moves.map((entry) => [key(entry.from.x, entry.from.y), entry]));
  const mergeTargets = new Set(
    moves.filter((entry) => entry.merged).map((entry) => key(entry.to.x, entry.to.y))
  );

  return tiles.map((tile) => {
    const entry = moveFrom.get(key(tile.x, tile.y));
    if (!entry) return { ...tile, spawned: false, merged: false };

    const absorbed = entry.merged;
    const swallowed = !absorbed && mergeTargets.has(key(entry.to.x, entry.to.y));

    return {
      ...tile,
      x: entry.to.x,
      y: entry.to.y,
      value: swallowed ? tile.value * 2 : tile.value,
      spawned: false,
      merged: swallowed,
      absorbed
    };
  });
}

/** Drops the tiles that were swallowed by a merge. */
export function settle(tiles) {
  return tiles.filter((tile) => !tile.absorbed);
}

/** The one square `spawn` filled in, or null if the board was already full. */
export function findNewCell(before, after) {
  for (let y = 0; y < after.length; y += 1) {
    for (let x = 0; x < after[y].length; x += 1) {
      if (before[y][x] !== after[y][x]) return { x, y, value: after[y][x] };
    }
  }
  return null;
}

/** True when the live tiles say exactly what the board says. */
export function tilesMatchBoard(tiles, board) {
  const live = settle(tiles);
  const filled = board.flat().filter((value) => value !== 0).length;
  if (live.length !== filled) return false;
  return live.every((tile) => board[tile.y][tile.x] === tile.value);
}
