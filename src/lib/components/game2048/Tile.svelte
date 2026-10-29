<script>
  import { scale } from 'svelte/transition';

  /**
   * One numbered tile.
   *
   * Position comes in as grid coordinates and is turned into a percentage
   * offset inside the board, so sliding is a CSS transition on `left` and
   * `top` rather than a re-render. The tile element itself is never recreated
   * while it lives, which is what the keyed each block in Board.svelte buys.
   */
  let { x, y, value, merged = false, absorbed = false } = $props();

  // The ramp tops out at 8192; anything past that reuses the darkest step.
  const background = $derived(`var(--tile-${value}, var(--tile-8192))`);
  const ink = $derived(value <= 64 ? 'var(--tile-ink-dark)' : 'var(--tile-ink-light)');
  const digits = $derived(String(value).length);
</script>

<div
  class="tile"
  class:tile--merged={merged}
  class:tile--absorbed={absorbed}
  class:tile--long={digits === 3}
  class:tile--longer={digits >= 4}
  style:--x={x}
  style:--y={y}
  style:--tile-bg={background}
  style:--tile-ink={ink}
  in:scale={{ duration: 180, start: 0.3 }}
>
  <span class="tile__value">{value}</span>
</div>

<style>
  .tile {
    position: absolute;
    display: grid;
    place-items: center;
    width: var(--cell-size);
    height: var(--cell-size);
    left: calc(var(--x) * var(--cell-step));
    top: calc(var(--y) * var(--cell-step));
    font-family: var(--font-sans);
    font-size: clamp(1rem, 7cqw, 2rem);
    font-weight: 800;
    line-height: 1;
    color: var(--tile-ink);
    background-color: var(--tile-bg);
    border-radius: var(--radius);
    transition: left var(--slide-ms) ease-in-out, top var(--slide-ms) ease-in-out;
    z-index: 2;
  }

  /* The tile being swallowed slides under the one that swallowed it. */
  .tile--absorbed {
    z-index: 1;
  }

  .tile--merged {
    z-index: 3;
    animation: pop 180ms ease-out;
  }

  .tile--long {
    font-size: clamp(0.875rem, 5.6cqw, 1.625rem);
  }

  .tile--longer {
    font-size: clamp(0.75rem, 4.4cqw, 1.25rem);
  }

  @keyframes pop {
    0% {
      transform: scale(1);
    }
    55% {
      transform: scale(1.14);
    }
    100% {
      transform: scale(1);
    }
  }
</style>
