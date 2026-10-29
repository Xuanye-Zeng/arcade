<script>
  /**
   * One square of the grid.
   *
   * The square owns nothing. It is told what to show and reports what the
   * player did through callback props, so the whole puzzle has a single
   * source of truth in Crossword.svelte.
   */
  let {
    cell,
    letter = '',
    label,
    active = false,
    inWord = false,
    mark = 'none',
    revealed = false,
    onselect,
    onletter,
    onkey,
    onregister
  } = $props();

  const shown = $derived(revealed ? cell.answer : letter);

  function handleInput(event) {
    const typed = event.currentTarget.value.slice(-1).toUpperCase();
    // Put the square back to what the puzzle says it holds; the parent
    // decides whether the keystroke counts.
    event.currentTarget.value = shown;
    if (/^[A-Z]$/.test(typed)) onletter(cell.index, typed);
  }
</script>

{#if cell.block}
  <div class="cell cell--block"></div>
{:else}
  <div
    class="cell"
    class:cell--active={active}
    class:cell--in-word={inWord}
    class:cell--correct={mark === 'correct'}
    class:cell--wrong={mark === 'wrong'}
    class:cell--revealed={revealed}
  >
    {#if cell.number}
      <span class="cell__number" aria-hidden="true">{cell.number}</span>
    {/if}

    <input
      class="cell__input"
      type="text"
      inputmode="text"
      maxlength="1"
      autocomplete="off"
      autocapitalize="characters"
      spellcheck="false"
      value={shown}
      aria-label={label}
      oninput={handleInput}
      onfocus={() => onselect(cell.index)}
      onkeydown={(event) => onkey(cell.index, event)}
      {@attach (element) => {
        onregister(cell.index, element);
        return () => onregister(cell.index, null);
      }}
    />
  </div>
{/if}

<style>
  .cell {
    position: relative;
    aspect-ratio: 1;
    background-color: var(--color-surface);
    transition: background-color var(--transition);
  }

  .cell--block {
    background-color: var(--color-grid-ink);
  }

  .cell--in-word {
    background-color: var(--color-accent-soft);
  }

  .cell--active {
    background-color: var(--color-highlight);
  }

  .cell__number {
    position: absolute;
    top: 0.2rem;
    left: 0.3rem;
    z-index: 1;
    font-family: var(--font-sans);
    font-size: var(--step--2);
    font-weight: 600;
    line-height: 1;
    pointer-events: none;
  }

  /* The input fills the square, so the whole square is the tap target. */
  .cell__input {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0.5rem 0 0;
    font-family: var(--font-sans);
    font-size: var(--step-2);
    font-weight: 700;
    line-height: 1;
    text-align: center;
    text-transform: uppercase;
    color: var(--color-text);
    caret-color: var(--color-accent);
    background-color: transparent;
    border: 0;
    border-radius: 0;
    appearance: none;
  }

  .cell__input:focus {
    outline: none;
  }

  .cell__input:focus-visible {
    outline: 3px solid var(--color-accent);
    outline-offset: -3px;
  }

  .cell--correct .cell__input,
  .cell--revealed .cell__input {
    color: var(--color-accent);
  }

  /* A wrong letter turns red and gets a red corner flag. */
  .cell--wrong .cell__input {
    color: var(--color-error);
    background-image: linear-gradient(
      225deg,
      var(--color-error) 0.625rem,
      transparent 0.625rem
    );
  }
</style>
