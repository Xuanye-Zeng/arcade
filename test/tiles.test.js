import test from 'node:test';
import assert from 'node:assert/strict';
import { canMove, createBoard, hasMoves, moveTiles, spawn } from '@xuanye-zeng/arcade-core';
import { findNewCell, settle, slideTiles, tilesMatchBoard } from '../src/lib/state/tiles.js';
import { createRandom } from '../src/lib/state/rng.js';

const SIZE = 4;
const DIRECTIONS = ['up', 'down', 'left', 'right'];

/** Builds the tile list that goes with a board, as a new game would. */
function tilesFor(board) {
  const tiles = [];
  let id = 0;
  board.forEach((row, y) =>
    row.forEach((value, x) => {
      if (value !== 0) tiles.push({ id: id++, x, y, value, spawned: false, merged: false, absorbed: false });
    })
  );
  return tiles;
}

test('a slide moves each tile to where the board move sent it', () => {
  const board = [
    [2, 2, 0, 4],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ];
  const tiles = tilesFor(board);
  const { moves } = moveTiles(board, 'left');
  const slid = slideTiles(tiles, moves);

  // The two 2s both travel to column 0; the second is absorbed by the first.
  assert.deepEqual(
    slid.map((tile) => ({ x: tile.x, y: tile.y, value: tile.value, absorbed: tile.absorbed })),
    [
      { x: 0, y: 0, value: 4, absorbed: false },
      { x: 0, y: 0, value: 2, absorbed: true },
      { x: 1, y: 0, value: 4, absorbed: false }
    ]
  );
  assert.equal(settle(slid).length, 2);
});

test('tiles keep their identity across a move', () => {
  const board = [
    [0, 0, 0, 8],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ];
  const tiles = tilesFor(board);
  const { moves } = moveTiles(board, 'left');
  const slid = slideTiles(tiles, moves);

  assert.equal(slid.length, 1);
  assert.equal(slid[0].id, tiles[0].id, 'the same tile slid, it was not replaced');
  assert.deepEqual([slid[0].x, slid[0].y], [0, 0]);
});

test('a tile merges at most once per move', () => {
  const board = [
    [2, 2, 2, 2],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ];
  const slid = settle(slideTiles(tilesFor(board), moveTiles(board, 'left').moves));

  assert.deepEqual(
    slid.map((tile) => tile.value),
    [4, 4]
  );
});

test('findNewCell reports the square spawn filled', () => {
  const before = createBoard(SIZE);
  const after = spawn(before, createRandom(7).next);
  const cell = findNewCell(before, after);

  assert.ok(cell);
  assert.equal(after[cell.y][cell.x], cell.value);
  assert.equal(before[cell.y][cell.x], 0);
});

test('a full game keeps the tiles and the board in step', () => {
  // Play many seeded games to the end, checking after every single step that
  // the tiles on screen say exactly what the board says.
  for (let seed = 1; seed <= 40; seed += 1) {
    const random = createRandom(seed);
    const next = () => random.next();

    let board = spawn(spawn(createBoard(SIZE), next), next);
    let tiles = tilesFor(board);
    let score = 0;

    assert.ok(tilesMatchBoard(tiles, board), `seed ${seed}: bad start`);

    for (let turn = 0; turn < 2000 && hasMoves(board); turn += 1) {
      const direction = DIRECTIONS[Math.floor(random.next() * DIRECTIONS.length)];
      if (!canMove(board, direction)) continue;

      const result = moveTiles(board, direction);
      tiles = slideTiles(tiles, result.moves);
      board = result.board;
      score += result.gained;

      assert.ok(
        tilesMatchBoard(tiles, board),
        `seed ${seed}, turn ${turn}: tiles disagree with the board after ${direction}`
      );

      tiles = settle(tiles);
      const spawned = spawn(board, next);
      const cell = findNewCell(board, spawned);
      board = spawned;
      if (cell) {
        tiles = [...tiles, { id: turn + 1000, ...cell, spawned: true, merged: false, absorbed: false }];
      }

      assert.ok(tilesMatchBoard(tiles, board), `seed ${seed}, turn ${turn}: bad spawn`);
    }

    assert.ok(score >= 0);
    assert.equal(hasMoves(board), false, `seed ${seed}: game should have ended`);
  }
});

test('the same seed replays the same game', () => {
  const play = (seed) => {
    const random = createRandom(seed);
    const next = () => random.next();
    let board = spawn(spawn(createBoard(SIZE), next), next);
    for (const direction of ['left', 'up', 'right', 'down', 'left', 'up']) {
      if (!canMove(board, direction)) continue;
      board = spawn(moveTiles(board, direction).board, next);
    }
    return board;
  };

  assert.deepEqual(play(1234), play(1234));
  assert.notDeepEqual(play(1234), play(5678));
});
