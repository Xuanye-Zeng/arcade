import { browser } from '$app/environment';
import { canMove, createBoard, hasMoves, moveTiles, spawn } from '@xuanye-zeng/arcade-core';
import { createRandom, toSeed } from './rng.js';
import { findNewCell, settle, slideTiles } from './tiles.js';
import { scoreboard } from './scoreboard.svelte.js';

export const SIZE = 4;
export const WINNING_TILE = 2048;

/** How long a tile takes to slide. Must match --slide-ms in Board.svelte. */
const SLIDE_MS = 130;
const STORAGE_KEY = 'arcade:2048';

/**
 * The board state for one game of 2048.
 *
 * Every rule lives in @xuanye-zeng/arcade-core. This class owns only what the
 * screen needs on top of a board of numbers: a list of tiles with stable ids,
 * so a keyed each block can slide the same element from one square to the next
 * instead of tearing down the old one and building a new one.
 *
 * A merge is drawn as two tiles arriving in the same square. The one that
 * lands on top takes the doubled value straight away; the one underneath is
 * marked `absorbed` and is dropped by `#flush` once the slide has finished,
 * which is what the timer is for.
 */
class Game2048 {
  board = $state(createBoard(SIZE));
  tiles = $state([]);
  score = $state(0);

  /** The seed in play, or null when the game uses Math.random. */
  seed = $state(null);

  /** Set once a 2048 tile appears; cleared only by starting a new game. */
  won = $state(false);

  /** Set when the player dismisses the win banner and plays on. */
  keepPlaying = $state(false);

  /** The last thing worth saying out loud, for the aria-live region. */
  announcement = $state('');

  #nextId = 0;
  #random = Math.random;
  #generator = null;
  #timer = null;
  #restored = false;

  /** The largest tile on the board. */
  highest = $derived(this.tiles.reduce((max, tile) => Math.max(max, tile.value), 0));

  /**
   * 'idle' before the first tile, 'over' once nothing can move, 'won' while
   * the win banner is up, 'playing' the rest of the time.
   */
  status = $derived.by(() => {
    if (this.tiles.length === 0) return 'idle';
    if (this.won && !this.keepPlaying) return 'won';
    return hasMoves(this.board) ? 'playing' : 'over';
  });

  /** Which arrow keys would do something right now. */
  available = $derived.by(() => {
    // Nothing moves while the win banner is up: the player answers it first.
    const live = this.status === 'playing';
    return {
      up: live && canMove(this.board, 'up'),
      down: live && canMove(this.board, 'down'),
      left: live && canMove(this.board, 'left'),
      right: live && canMove(this.board, 'right')
    };
  });

  // -- starting and restoring ---------------------------------------------

  /**
   * Restores the game in progress, or deals a new one. Called from the
   * browser only, because a prerendered page has no localStorage.
   */
  start() {
    if (this.#restored) return;
    this.#restored = true;
    scoreboard.load();
    if (!this.#restore()) this.newGame();
  }

  /** Deals a fresh board. `seedInput` is whatever the seed field holds. */
  newGame(seedInput = null) {
    this.#flush();
    const seed = toSeed(seedInput);

    this.seed = seed;
    if (seed === null) {
      this.#generator = null;
      this.#random = Math.random;
    } else {
      this.#generator = createRandom(seed);
      this.#random = () => this.#generator.next();
    }

    this.board = createBoard(SIZE);
    this.tiles = [];
    this.score = 0;
    this.won = false;
    this.keepPlaying = false;

    this.#deal();
    this.#deal();
    this.announcement =
      seed === null ? 'New game started.' : `New game started with seed ${seed}.`;
    this.#save();
  }

  /** Dismisses the win banner so the game can continue past 2048. */
  continuePlaying() {
    this.keepPlaying = true;
    this.announcement = 'Still playing. Keep going for a higher score.';
    this.#save();
  }

  // -- playing -------------------------------------------------------------

  /**
   * Slides everything one way. Returns false, and changes nothing, when that
   * direction is not a legal move.
   */
  play(direction) {
    this.#flush();
    if (this.status !== 'playing') return false;
    if (!canMove(this.board, direction)) return false;

    const { board: moved, gained, moves } = moveTiles(this.board, direction);
    const slid = slideTiles($state.snapshot(this.tiles), moves);
    const absorbedAny = slid.some((tile) => tile.absorbed);

    this.tiles = slid;
    this.board = moved;
    this.score += gained;
    scoreboard.record(this.score);

    this.#deal();

    if (!this.won && this.highest >= WINNING_TILE) {
      this.won = true;
      this.announcement = `You made ${WINNING_TILE}. You can keep playing.`;
    } else if (gained > 0) {
      this.announcement = `Scored ${gained}. Total ${this.score}.`;
    } else {
      this.announcement = `Moved ${direction}. Score ${this.score}.`;
    }

    // The absorbed tiles stay on screen, under the tile that swallowed them,
    // until the slide is over.
    if (absorbedAny && browser) {
      this.#timer = setTimeout(() => this.#flush(), SLIDE_MS);
    } else if (absorbedAny) {
      this.#flush();
    }

    this.#save();
    return true;
  }

  // -- internals -----------------------------------------------------------

  /** Puts one new tile on the board, following the package's spawn rules. */
  #deal() {
    const next = spawn(this.board, this.#random);
    const cell = findNewCell(this.board, next);
    this.board = next;
    if (!cell) return;

    this.tiles = [
      ...this.tiles,
      {
        id: this.#nextId++,
        x: cell.x,
        y: cell.y,
        value: cell.value,
        spawned: true,
        merged: false,
        absorbed: false
      }
    ];
  }

  /** Drops the tiles that were swallowed by a merge. */
  #flush() {
    if (this.#timer) {
      clearTimeout(this.#timer);
      this.#timer = null;
    }
    if (this.tiles.some((tile) => tile.absorbed)) {
      this.tiles = settle($state.snapshot(this.tiles));
    }
  }

  // -- saving --------------------------------------------------------------

  #save() {
    if (!browser) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          version: 1,
          board: $state.snapshot(this.board),
          tiles: settle($state.snapshot(this.tiles)),
          score: this.score,
          seed: this.seed,
          rngState: this.#generator ? this.#generator.state : null,
          won: this.won,
          keepPlaying: this.keepPlaying
        })
      );
    } catch {
      // A full or blocked localStorage should never stop the game.
    }
  }

  /** Reads a saved game. Returns false if there was nothing usable to read. */
  #restore() {
    if (!browser) return false;

    let saved;
    try {
      saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');
    } catch {
      return false;
    }
    if (!saved || saved.version !== 1 || !Array.isArray(saved.tiles) || saved.tiles.length === 0) {
      return false;
    }

    this.board = saved.board;
    this.tiles = saved.tiles.map((tile) => ({ ...tile, spawned: false, merged: false }));
    this.score = saved.score ?? 0;
    this.won = Boolean(saved.won);
    this.keepPlaying = Boolean(saved.keepPlaying);
    this.seed = saved.seed ?? null;
    this.#nextId = this.tiles.reduce((max, tile) => Math.max(max, tile.id + 1), 0);

    if (this.seed === null) {
      this.#generator = null;
      this.#random = Math.random;
    } else {
      this.#generator = createRandom(this.seed);
      if (typeof saved.rngState === 'number') this.#generator.state = saved.rngState;
      this.#random = () => this.#generator.next();
    }

    scoreboard.record(this.score);
    this.announcement = 'Game restored.';
    return true;
  }
}

/** One game, shared by every component that imports it. */
export const game = new Game2048();
