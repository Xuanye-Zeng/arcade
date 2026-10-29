<script>
  /**
   * Starts a game from a seed, so the same tiles appear in the same squares
   * every time. The field is this component's own state; the seed only
   * reaches the game when the form is submitted.
   */
  let { onstart } = $props();

  let value = $state('');

  function submit(event) {
    event.preventDefault();
    onstart(value.trim());
  }
</script>

<form class="seed" onsubmit={submit}>
  <label class="seed__label" for="seed-input">Seed</label>
  <input
    id="seed-input"
    class="seed__input"
    type="text"
    inputmode="numeric"
    autocomplete="off"
    placeholder="e.g. 1234"
    bind:value
  />
  <button type="submit" class="button button--ghost">Start seeded game</button>
  <p class="seed__note">
    The same seed deals the same tiles in the same order, so a game can be replayed.
  </p>
</form>

<style>
  .seed {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--space-2) var(--space-3);
    margin-top: var(--space-6);
    padding-top: var(--space-4);
    border-top: var(--rule-thin);
  }

  .seed__label {
    font-family: var(--font-sans);
    font-size: var(--step--1);
    font-weight: 700;
    letter-spacing: var(--tracking-caps);
    text-transform: uppercase;
  }

  .seed__input {
    width: 8rem;
    min-height: var(--tap-size);
    padding: var(--space-2) var(--space-3);
    font-family: var(--font-sans);
    font-size: var(--step-0);
    color: var(--color-text);
    background-color: var(--color-surface);
    border: var(--rule-strong);
    border-radius: var(--radius);
  }

  .seed__note {
    flex-basis: 100%;
    margin: 0;
    font-family: var(--font-sans);
    font-size: var(--step--2);
    color: var(--color-text-muted);
  }
</style>
