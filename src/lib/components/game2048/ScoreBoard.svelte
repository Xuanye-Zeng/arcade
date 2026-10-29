<script>
  /** Current score, record and the New game button. */
  let { score, best, seed = null, onnewgame } = $props();
</script>

<div class="scores">
  <div class="score">
    <span class="score__label">Score</span>
    <span class="score__value">{score}</span>
  </div>

  <div class="score">
    <span class="score__label">Best</span>
    <span class="score__value">{best}</span>
  </div>

  <div class="actions">
    {#if seed !== null}
      <p class="seed-tag">Seed {seed}</p>
    {/if}
    <button type="button" class="button" onclick={() => onnewgame()}>New game</button>
  </div>
</div>

<style>
  .scores {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--space-3);
    margin-bottom: var(--space-4);
  }

  .score {
    display: grid;
    gap: 2px;
    min-width: 5.5rem;
    padding: var(--space-2) var(--space-4);
    text-align: center;
    background-color: var(--color-surface-alt);
    border: var(--rule-thin);
    border-radius: var(--radius);
  }

  .score__label {
    font-family: var(--font-sans);
    font-size: var(--step--2);
    font-weight: 700;
    letter-spacing: var(--tracking-caps);
    text-transform: uppercase;
    color: var(--color-text-muted);
  }

  .score__value {
    font-family: var(--font-sans);
    font-size: var(--step-2);
    font-weight: 800;
    line-height: 1.1;
    font-variant-numeric: tabular-nums;
  }

  .actions {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    margin-left: auto;
  }

  .seed-tag {
    margin: 0;
    font-family: var(--font-sans);
    font-size: var(--step--2);
    font-weight: 700;
    letter-spacing: var(--tracking-caps);
    text-transform: uppercase;
    color: var(--color-text-muted);
  }
</style>
