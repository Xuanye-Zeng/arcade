<script>
  /**
   * The Across or Down column of clues. Clicking a clue jumps the cursor to
   * the first square of that word, which is reported back through `onpick`.
   */
  let { title, words, activeId = null, onpick } = $props();
</script>

<div class="clue-group">
  <h3 class="clue-group__title">{title}</h3>
  <ol class="clue-list">
    {#each words as word (word.id)}
      <li>
        <button
          type="button"
          class="clue"
          class:clue--active={word.id === activeId}
          aria-current={word.id === activeId ? 'true' : undefined}
          onclick={() => onpick(word)}
        >
          <b class="clue__num">{word.number}</b>
          <span>{word.clue}</span>
        </button>
      </li>
    {/each}
  </ol>
</div>

<style>
  .clue-group__title {
    margin-bottom: var(--space-2);
    font-family: var(--font-sans);
    font-size: var(--step--1);
    font-weight: 800;
    letter-spacing: var(--tracking-caps);
    text-transform: uppercase;
  }

  .clue-list {
    margin: 0;
    padding: 0;
    list-style: none;
    border-top: var(--rule-strong);
  }

  .clue-list li {
    max-width: none;
  }

  .clue {
    display: flex;
    gap: var(--space-3);
    width: 100%;
    padding: var(--space-3);
    font: inherit;
    text-align: left;
    color: inherit;
    background: none;
    border: 0;
    border-bottom: var(--rule-thin);
    cursor: pointer;
    transition: background-color var(--transition);
  }

  .clue:hover {
    background-color: var(--color-surface-alt);
  }

  .clue--active {
    background-color: var(--color-accent-soft);
  }

  .clue__num {
    flex: none;
    min-width: 1.25em;
    font-family: var(--font-sans);
    font-weight: 800;
  }
</style>
