// The Mini: a 5x5 crossword.
//
// Only the answer grid and the clue text are written out by hand. The square
// numbers and the across/down words are worked out from the grid by
// buildPuzzle, the same way a setter would number a grid, so moving a black
// square never means renumbering clues by hand.

export const SIZE = 5;

/** `null` is a black square. */
export const SOLUTION = [
  [null, 'M', 'U', 'S', 'T'],
  ['L', 'A', 'N', 'C', 'E'],
  ['I', 'N', 'D', 'E', 'X'],
  ['A', 'G', 'E', 'N', 'T'],
  ['R', 'A', 'R', 'E', null]
];

/** Clue text, keyed by the square number the word starts at. */
export const CLUES = {
  across: {
    1: 'Have to',
    5: "Knight's long weapon",
    6: 'Alphabetical list at the back of a book',
    7: 'Secret ___ (spy)',
    8: 'Like a steak with a red center'
  },
  down: {
    1: 'Japanese comics',
    2: 'Beneath',
    3: '"Don’t make a ___!"',
    4: 'Message sent from a phone',
    5: 'Pinocchio, notoriously'
  }
};

const isBlock = (row, col) =>
  row < 0 || col < 0 || row >= SIZE || col >= SIZE || SOLUTION[row][col] === null;

/**
 * Numbers the grid and collects the words.
 *
 * A square starts an across word when nothing is to its left and something is
 * to its right, and starts a down word by the same rule turned 90 degrees.
 * Squares that start either one take the next number.
 */
export function buildPuzzle() {
  const cells = [];
  const words = [];
  let number = 1;

  for (let row = 0; row < SIZE; row += 1) {
    for (let col = 0; col < SIZE; col += 1) {
      const index = row * SIZE + col;

      if (isBlock(row, col)) {
        cells.push({ index, row, col, block: true, answer: null, number: null, across: null, down: null });
        continue;
      }

      const startsAcross = isBlock(row, col - 1) && !isBlock(row, col + 1);
      const startsDown = isBlock(row - 1, col) && !isBlock(row + 1, col);
      const cellNumber = startsAcross || startsDown ? number : null;
      if (cellNumber !== null) number += 1;

      if (startsAcross) {
        words.push({ id: `across-${cellNumber}`, direction: 'across', number: cellNumber, clue: CLUES.across[cellNumber], cells: [] });
      }
      if (startsDown) {
        words.push({ id: `down-${cellNumber}`, direction: 'down', number: cellNumber, clue: CLUES.down[cellNumber], cells: [] });
      }

      cells.push({
        index,
        row,
        col,
        block: false,
        answer: SOLUTION[row][col],
        number: cellNumber,
        across: null,
        down: null
      });
    }
  }

  // Walk each word from its first square and record which squares it covers,
  // and on each square which two words it belongs to.
  for (const word of words) {
    const start = cells.find((cell) => cell.number === word.number && !cell.block);
    const step = word.direction === 'across' ? { row: 0, col: 1 } : { row: 1, col: 0 };

    let { row, col } = start;
    while (!isBlock(row, col)) {
      const cell = cells[row * SIZE + col];
      cell[word.direction] = word.id;
      word.cells.push(cell.index);
      row += step.row;
      col += step.col;
    }
  }

  return { cells, words };
}

/** The finished answers, for the "Reveal solution" summary. */
export function answerKey(words, cells) {
  return words.map((word) => ({
    id: word.id,
    number: word.number,
    direction: word.direction,
    answer: word.cells.map((index) => cells[index].answer).join('')
  }));
}
