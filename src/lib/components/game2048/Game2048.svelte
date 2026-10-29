<script>
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { swipe } from '$lib/attachments/swipe.js';
  import { game, WINNING_TILE } from '$state/game2048.svelte.js';
  import { scoreboard } from '$state/scoreboard.svelte.js';
  import Board from './Board.svelte';
  import DirectionPad from './DirectionPad.svelte';
  import ScoreBoard from './ScoreBoard.svelte';
  import SeedControl from './SeedControl.svelte';

  const ARROWS = {
    ArrowUp: 'up',
    ArrowDown: 'down',
    ArrowLeft: 'left',
    ArrowRight: 'right',
    w: 'up',
    s: 'down',
    a: 'left',
    d: 'right'
  };

  // The board is built in the browser, where localStorage can be read.
  onMount(() => game.start());

  // One sentence for the live region, worked out from the state rather than
  // written into it, so it is always in step with what is on screen.
  const liveMessage = $derived(
    game.status === 'over'
      ? `Game over. No moves left. Final score ${game.score}. Best ${scoreboard.best}.`
      : game.status === 'won'
        ? `You made ${WINNING_TILE}. Score ${game.score}. You can keep playing.`
        : game.announcement
  );

  function handleKeydown(event) {
    // Let the seed field have its own arrow keys.
    if (event.target instanceof HTMLInputElement) return;
    const direction = ARROWS[event.key];
    if (!direction) return;
    event.preventDefault();
    game.play(direction);
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="game">
  <div class="game__play">
    <ScoreBoard
      score={game.score}
      best={scoreboard.best}
      seed={game.seed}
      onnewgame={() => game.newGame()}
    />

    <div class="board-wrap" {@attach swipe((direction) => game.play(direction))}>
      <Board tiles={game.tiles} />

      {#if game.status === 'won'}
        <div class="overlay overlay--won" transition:fade={{ duration: 200 }}>
          <div class="overlay__card" transition:fly={{ y: 16, duration: 260 }}>
            <p class="overlay__title">You made {WINNING_TILE}</p>
            <p class="overlay__note">Score {game.score}.</p>
            <div class="overlay__actions">
              <button type="button" class="button" onclick={() => game.continuePlaying()}>
                Keep playing
              </button>
              <button
                type="button"
                class="button button--ghost"
                onclick={() => game.newGame()}
              >
                New game
              </button>
            </div>
          </div>
        </div>
      {:else if game.status === 'over'}
        <div class="overlay overlay--over" transition:fade={{ duration: 200 }}>
          <div class="overlay__card" transition:fly={{ y: 16, duration: 260 }}>
            <p class="overlay__title">Game over</p>
            <p class="overlay__note">
              No moves left. Score {game.score}, best {scoreboard.best}.
            </p>
            <div class="overlay__actions">
              <button type="button" class="button" onclick={() => game.newGame()}>
                New game
              </button>
            </div>
          </div>
        </div>
      {/if}
    </div>

    <DirectionPad available={game.available} onmove={(direction) => game.play(direction)} />

    <p class="live visually-hidden" role="status" aria-live="polite">{liveMessage}</p>
  </div>

  <aside class="game__side">
    <section aria-labelledby="rules-title">
      <h2 id="rules-title" class="section-title">How to play</h2>
      <ul class="rules">
        <li>Arrow keys (or W, A, S, D) slide every tile as far as it will go.</li>
        <li>On a phone, swipe the board or use the arrow buttons under it.</li>
        <li>
          Two tiles with the same number merge into one worth double, and the merged tile is
          added to your score. Each tile merges at most once per move.
        </li>
        <li>A move that changes nothing is not a move, so no new tile appears.</li>
        <li>Reach {WINNING_TILE} to win. You can keep playing after that.</li>
        <li>Your game and your best score are saved in this browser.</li>
      </ul>
    </section>

    <section aria-labelledby="seed-title">
      <h2 id="seed-title" class="section-title">Replay a game</h2>
      <SeedControl onstart={(seed) => game.newGame(seed)} />
    </section>
  </aside>
</div>

<style>
  .game {
    display: grid;
    gap: var(--space-12);
    align-items: start;
  }

  .board-wrap {
    position: relative;
    width: 100%;
    max-width: 30rem;
  }

  .overlay {
    position: absolute;
    inset: 0;
    /* Above the tiles, which carry z-index 1 to 3 of their own. */
    z-index: 10;
    display: grid;
    place-items: center;
    padding: var(--space-4);
    text-align: center;
    background-color: color-mix(in srgb, var(--color-bg) 86%, transparent);
    border-radius: var(--radius);
  }

  .overlay__card {
    display: grid;
    gap: var(--space-3);
    justify-items: center;
  }

  .overlay__title {
    margin: 0;
    font-family: var(--font-serif);
    font-size: var(--step-4);
    font-weight: 800;
    line-height: 1.1;
  }

  .overlay--won .overlay__title {
    color: var(--color-success);
  }

  .overlay__note {
    margin: 0;
    font-family: var(--font-sans);
    font-size: var(--step--1);
    color: var(--color-text-muted);
  }

  .overlay__actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: var(--space-3);
  }

  .rules {
    padding-left: 1.25em;
  }

  .rules li {
    margin-bottom: var(--space-2);
  }

  .rules li::marker {
    color: var(--color-accent);
  }

  @media (min-width: 60em) {
    .game {
      grid-template-columns: minmax(0, 30rem) minmax(0, 1fr);
    }
  }
</style>
