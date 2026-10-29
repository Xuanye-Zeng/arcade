<script>
  /**
   * On-screen arrows for touch devices, where there is no keyboard to press.
   * Hidden on wide screens, which have arrow keys.
   *
   * The buttons stay focusable when a direction is unavailable and say so
   * with aria-disabled, rather than vanishing from the tab order mid-game.
   */
  let { available, onmove } = $props();

  const keys = [
    { direction: 'up', label: 'Up', glyph: '↑', area: 'up' },
    { direction: 'left', label: 'Left', glyph: '←', area: 'left' },
    { direction: 'down', label: 'Down', glyph: '↓', area: 'down' },
    { direction: 'right', label: 'Right', glyph: '→', area: 'right' }
  ];

  function press(direction) {
    if (available[direction]) onmove(direction);
  }
</script>

<div class="pad" role="group" aria-label="Move tiles">
  {#each keys as key (key.direction)}
    <button
      type="button"
      class="pad__key"
      style:grid-area={key.area}
      aria-label="Move {key.label.toLowerCase()}"
      aria-disabled={!available[key.direction]}
      onclick={() => press(key.direction)}
    >
      <span aria-hidden="true">{key.glyph}</span>
    </button>
  {/each}
</div>

<style>
  .pad {
    display: grid;
    grid-template-areas:
      ". up ."
      "left down right";
    gap: var(--space-2);
    justify-content: center;
    margin-top: var(--space-6);
  }

  .pad__key {
    display: grid;
    place-items: center;
    width: 3.5rem;
    height: 3.5rem;
    font-size: var(--step-2);
    line-height: 1;
    color: var(--color-accent);
    background-color: var(--color-surface);
    border: 2px solid var(--color-accent);
    border-radius: var(--radius);
    cursor: pointer;
    transition: background-color var(--transition), opacity var(--transition);
  }

  .pad__key:hover {
    background-color: var(--color-accent-soft);
  }

  .pad__key[aria-disabled='true'] {
    opacity: 0.4;
    cursor: not-allowed;
  }

  /* Wide screens have arrow keys, so the pad is for touch only. */
  @media (min-width: 46em) {
    .pad {
      display: none;
    }
  }
</style>
