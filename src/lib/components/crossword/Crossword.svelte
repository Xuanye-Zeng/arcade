<script>
  import { scale } from 'svelte/transition';
  import { SIZE, answerKey, buildPuzzle } from '$data/crossword.js';
  import ClueList from './ClueList.svelte';
  import CrosswordCell from './CrosswordCell.svelte';
  import CurrentClue from './CurrentClue.svelte';

  const { cells, words } = buildPuzzle();
  const playable = cells.filter((cell) => !cell.block);
  const byId = new Map(words.map((word) => [word.id, word]));
  const across = words.filter((word) => word.direction === 'across');
  const down = words.filter((word) => word.direction === 'down');
  const answers = answerKey(words, cells);

  // The only state the puzzle has: what has been typed, where the cursor is,
  // which way it is pointing, and the two display toggles.
  let letters = $state(Array(SIZE * SIZE).fill(''));
  let cursor = $state(playable[0].index);
  let direction = $state('across');
  let checking = $state(false);
  let revealed = $state(false);

  /** The live <input> for each square, so the cursor can move focus. */
  const inputs = new Map();

  // A square always belongs to an across word and a down word in this grid,
  // but fall back to the other way round rather than trust that.
  const heading = $derived(cells[cursor][direction] ? direction : flip(direction));
  const activeWord = $derived(byId.get(cells[cursor][heading]) ?? null);
  const crossingWord = $derived(byId.get(cells[cursor][flip(heading)]) ?? null);
  const activeCells = $derived(new Set(activeWord ? activeWord.cells : []));

  const solved = $derived(playable.every((cell) => letters[cell.index] === cell.answer));
  const filled = $derived(playable.filter((cell) => letters[cell.index] !== '').length);
  const wrong = $derived(
    playable.filter((cell) => letters[cell.index] !== '' && letters[cell.index] !== cell.answer)
      .length
  );

  // Only says something when the state of the puzzle really changes, so the
  // live region does not chatter on every keystroke.
  const announcement = $derived(
    revealed
      ? 'Solution revealed.'
      : solved
        ? 'Solved. Every square is correct.'
        : checking
          ? wrong === 0
            ? `Checking: no wrong letters among ${filled} filled squares.`
            : `Checking: ${wrong} wrong ${wrong === 1 ? 'letter' : 'letters'}.`
          : ''
  );

  function flip(value) {
    return value === 'across' ? 'down' : 'across';
  }

  function register(index, element) {
    if (element) inputs.set(index, element);
    else inputs.delete(index);
  }

  function focusCell(index) {
    cursor = index;
    inputs.get(index)?.focus();
  }

  /** The square `step` places along the current word, or null at the end. */
  function alongWord(index, step) {
    if (!activeWord) return null;
    return activeWord.cells[activeWord.cells.indexOf(index) + step] ?? null;
  }

  /** The next square across or down, skipping black squares. */
  function neighbour(index, axis, step) {
    let row = Math.floor(index / SIZE);
    let col = index % SIZE;

    for (;;) {
      if (axis === 'across') col += step;
      else row += step;
      if (row < 0 || col < 0 || row >= SIZE || col >= SIZE) return null;
      const cell = cells[row * SIZE + col];
      if (!cell.block) return cell.index;
    }
  }

  function label(cell) {
    const parts = [`Row ${cell.row + 1}, column ${cell.col + 1}`];
    const a = byId.get(cell.across);
    const d = byId.get(cell.down);
    if (a) parts.push(`${a.number} across, ${a.clue}`);
    if (d) parts.push(`${d.number} down, ${d.clue}`);
    return parts.join('. ');
  }

  function markFor(cell) {
    if (!checking || revealed || letters[cell.index] === '') return 'none';
    return letters[cell.index] === cell.answer ? 'correct' : 'wrong';
  }

  // -- things the squares and clues report back ----------------------------

  function handleSelect(index) {
    cursor = index;
  }

  function handleLetter(index, letter) {
    if (revealed) return;
    letters[index] = letter;
    const next = alongWord(index, 1);
    if (next !== null) focusCell(next);
  }

  function handleKey(index, event) {
    const axes = {
      ArrowUp: ['down', -1],
      ArrowDown: ['down', 1],
      ArrowLeft: ['across', -1],
      ArrowRight: ['across', 1]
    };

    if (event.key in axes) {
      event.preventDefault();
      const [axis, step] = axes[event.key];
      direction = axis;
      const target = neighbour(index, axis, step);
      if (target !== null) focusCell(target);
      return;
    }

    if (event.key === ' ') {
      event.preventDefault();
      swapDirection();
      return;
    }

    if (event.key === 'Backspace') {
      event.preventDefault();
      if (revealed) return;
      if (letters[index] !== '') {
        letters[index] = '';
        return;
      }
      const previous = alongWord(index, -1);
      if (previous !== null) {
        letters[previous] = '';
        focusCell(previous);
      }
      return;
    }

    if (event.key === 'Delete' && !revealed) {
      event.preventDefault();
      letters[index] = '';
    }
  }

  function pickWord(word) {
    direction = word.direction;
    focusCell(word.cells[0]);
  }

  function swapDirection() {
    if (crossingWord) direction = crossingWord.direction;
  }

  function clearGrid() {
    letters = Array(SIZE * SIZE).fill('');
    revealed = false;
    focusCell(playable[0].index);
  }
</script>

<div class="puzzle">
  <div class="play">
    <CurrentClue primary={activeWord} secondary={crossingWord} onswap={swapDirection} />

    <div
      class="grid"
      role="group"
      aria-label="Crossword grid, 5 rows by 5 columns. The squares at row 1 column 1 and row 5 column 5 are black."
    >
      {#each cells as cell (cell.index)}
        <CrosswordCell
          {cell}
          letter={letters[cell.index]}
          label={label(cell)}
          active={cell.index === cursor}
          inWord={activeCells.has(cell.index)}
          mark={markFor(cell)}
          {revealed}
          onselect={handleSelect}
          onletter={handleLetter}
          onkey={handleKey}
          onregister={register}
        />
      {/each}
    </div>

    <p class="progress" aria-hidden="true">{filled} of {playable.length} squares filled</p>

    <p class="status" role="status" aria-live="polite">{announcement}</p>

    {#if solved && !revealed}
      <p class="solved-banner" transition:scale={{ duration: 420, start: 0.6 }}>
        <strong class="solved-banner__stamp">Solved!</strong>
        <span>Every square is correct.</span>
      </p>
    {/if}

    <div class="toolbar">
      <button
        type="button"
        class="button button--ghost toggle"
        class:toggle--on={checking}
        aria-pressed={checking}
        onclick={() => (checking = !checking)}
      >
        Check answers
      </button>

      <button type="button" class="button button--ghost" onclick={clearGrid}>Clear grid</button>

      <button
        type="button"
        class="button button--ghost toggle"
        class:toggle--on={revealed}
        aria-pressed={revealed}
        onclick={() => (revealed = !revealed)}
      >
        {revealed ? 'Hide solution' : 'Reveal solution'}
      </button>

      {#if revealed}
        <div class="answer-key" transition:scale={{ duration: 200, start: 0.95 }}>
          {#each ['across', 'down'] as side (side)}
            <p>
              <strong>{side === 'across' ? 'Across:' : 'Down:'}</strong>
              {answers
                .filter((entry) => entry.direction === side)
                .map((entry) => `${entry.number} ${entry.answer}`)
                .join(', ')}
            </p>
          {/each}
        </div>
      {/if}
    </div>
  </div>

  <div class="sheet">
    <section class="clues" aria-labelledby="clues-title">
      <h2 id="clues-title" class="visually-hidden">Clues</h2>
      <ClueList
        title="Across"
        words={across}
        activeId={activeWord?.id ?? null}
        onpick={pickWord}
      />
      <ClueList title="Down" words={down} activeId={activeWord?.id ?? null} onpick={pickWord} />
    </section>

    <section class="how-to" aria-labelledby="how-to-title">
      <h2 id="how-to-title" class="section-title">How to play</h2>
      <ul>
        <li>Click or tap a square and type. The word you are in is highlighted.</li>
        <li>
          Arrow keys move around the grid, Space switches between across and down, and Backspace
          clears the square and steps back.
        </li>
        <li>Tab moves to the next square; picking a clue jumps to the start of that word.</li>
        <li>
          <strong>Check answers</strong> marks wrong letters red; correct letters turn blue.
        </li>
        <li>Fill every square correctly and a &ldquo;Solved&rdquo; stamp appears.</li>
      </ul>
    </section>
  </div>
</div>

<style>
  .puzzle {
    display: grid;
    gap: var(--space-12);
    align-items: start;
  }

  /* The 1px gap lets the grid background show through as grid lines */
  .grid {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 1px;
    width: min(100%, 22rem);
    background-color: var(--color-grid-ink);
    border: 3px solid var(--color-grid-ink);
  }

  .progress {
    margin: var(--space-3) 0 0;
    font-family: var(--font-sans);
    font-size: var(--step--1);
    color: var(--color-text-muted);
  }

  .status {
    margin: 0;
    font-family: var(--font-sans);
    font-size: var(--step--1);
    color: var(--color-text-muted);
    min-height: 1.4em;
  }

  .solved-banner {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--space-2) var(--space-4);
    margin: var(--space-4) 0 0;
    font-family: var(--font-sans);
    font-size: var(--step--1);
  }

  .solved-banner__stamp {
    padding: var(--space-1) var(--space-3);
    font-size: var(--step-1);
    font-weight: 800;
    letter-spacing: var(--tracking-caps);
    text-transform: uppercase;
    color: var(--color-accent);
    border: 4px double var(--color-accent);
    transform: rotate(-3deg);
  }

  .toolbar {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-3);
    margin-top: var(--space-6);
  }

  .toolbar .button {
    padding-inline: var(--space-4);
  }

  /* The toggles draw their own checkbox so pressed state is visible without colour alone */
  .toggle::before {
    content: "";
    flex: none;
    width: 1em;
    height: 1em;
    border: 2px solid currentColor;
    border-radius: var(--radius);
  }

  .toggle--on {
    color: var(--color-on-accent);
    background-color: var(--color-accent);
  }

  .toggle--on::before {
    background-color: currentColor;
    box-shadow: inset 0 0 0 2px var(--color-accent);
  }

  .answer-key {
    flex-basis: 100%;
    padding: var(--space-4);
    font-family: var(--font-sans);
    font-size: var(--step--1);
    background-color: var(--color-surface-alt);
    border-left: 4px solid var(--color-accent);
  }

  .answer-key p {
    max-width: none;
    margin: 0 0 var(--space-2);
  }

  .answer-key p:last-child {
    margin-bottom: 0;
  }

  .sheet {
    display: grid;
    gap: var(--space-12);
  }

  .clues {
    display: grid;
    gap: var(--space-8);
  }

  .how-to ul {
    padding-left: 1.25em;
  }

  .how-to li {
    margin-bottom: var(--space-2);
  }

  .how-to li::marker {
    color: var(--color-accent);
  }

  @media (min-width: 46em) {
    .puzzle {
      grid-template-columns: minmax(0, 22rem) minmax(0, 1fr);
    }
  }

  @media (min-width: 60em) {
    .clues {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
</style>
