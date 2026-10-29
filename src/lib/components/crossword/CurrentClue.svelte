<script>
  /**
   * The bar above the grid showing the clues for the square under the cursor.
   * The word being typed comes first; the word crossing it is shown under it.
   */
  let { primary = null, secondary = null, onswap } = $props();

  const label = (word) => `${word.number}${word.direction === 'across' ? 'A' : 'D'}`;
</script>

<div class="current-clue">
  {#if primary}
    <p class="current-clue__line">
      <b>{label(primary)}</b>
      {primary.clue}
    </p>
    {#if secondary}
      <button type="button" class="current-clue__swap" onclick={onswap}>
        <b>{label(secondary)}</b>
        <span>{secondary.clue}</span>
      </button>
    {/if}
  {:else}
    <p class="current-clue__empty">Select a square to see its clues.</p>
  {/if}
</div>

<style>
  .current-clue {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 4.5rem;
    margin-bottom: var(--space-3);
    padding: var(--space-2) var(--space-3);
    font-family: var(--font-sans);
    font-size: var(--step--1);
    line-height: 1.4;
    background-color: var(--color-accent-soft);
    border-left: 4px solid var(--color-accent);
  }

  .current-clue p {
    margin: 0;
    max-width: none;
  }

  .current-clue__empty {
    font-style: italic;
  }

  .current-clue b {
    display: inline-block;
    min-width: 2.25em;
    font-weight: 800;
  }

  /* The crossing clue doubles as the control that switches direction. */
  .current-clue__swap {
    display: flex;
    gap: var(--space-1);
    margin-top: var(--space-1);
    padding: 0;
    font: inherit;
    text-align: left;
    color: var(--color-text-muted);
    background: none;
    border: 0;
    cursor: pointer;
  }

  .current-clue__swap:hover {
    color: var(--color-text);
    text-decoration: underline;
  }
</style>
