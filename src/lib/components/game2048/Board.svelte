<script>
  import { SIZE } from '$state/game2048.svelte.js';
  import Tile from './Tile.svelte';

  /** The board: a fixed grid of empty squares with the tiles floating over it. */
  let { tiles } = $props();

  // Every square is placed with the same arithmetic the tiles use, so the
  // holes always line up with what sits in them.
  const slots = Array.from({ length: SIZE * SIZE }, (_, index) => ({
    id: index,
    x: index % SIZE,
    y: Math.floor(index / SIZE)
  }));
</script>

<div class="frame">
  <div class="board">
    {#each slots as slot (slot.id)}
      <div class="slot" style:--x={slot.x} style:--y={slot.y}></div>
    {/each}

    {#each tiles as tile (tile.id)}
      <Tile
        x={tile.x}
        y={tile.y}
        value={tile.value}
        merged={tile.merged}
        absorbed={tile.absorbed}
      />
    {/each}
  </div>
</div>

<style>
  .frame {
    width: 100%;
    max-width: 30rem;
    padding: var(--space-2);
    background-color: var(--color-surface-alt);
    border: var(--rule-strong);
    border-radius: var(--radius);
  }

  .board {
    /* Gap and cell are percentages of the board, so one square board scales
       from a 320px phone to a wide monitor with no breakpoints. */
    --gap: 2.5%;
    --cell-size: 23.125%;
    --cell-step: 25.625%;
    --slide-ms: 130ms;

    position: relative;
    container-type: inline-size;
    width: 100%;
    aspect-ratio: 1;
    touch-action: none;
  }

  .slot {
    position: absolute;
    width: var(--cell-size);
    height: var(--cell-size);
    left: calc(var(--x) * var(--cell-step));
    top: calc(var(--y) * var(--cell-step));
    background-color: var(--tile-empty);
    border-radius: var(--radius);
  }
</style>
