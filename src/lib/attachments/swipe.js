/** How far a finger has to travel before it counts as a swipe. */
const THRESHOLD = 28;

/**
 * Reports flicks across an element as 'up', 'down', 'left' or 'right'.
 *
 * Used as a Svelte attachment: `{@attach swipe(handler)}`. Touch is an extra
 * way in rather than the only one, so nothing here is required to play; the
 * arrow keys and the on-screen pad cover the same ground.
 */
export function swipe(onswipe, threshold = THRESHOLD) {
  return (element) => {
    let start = null;

    const begin = (event) => {
      const touch = event.changedTouches[0];
      start = { x: touch.clientX, y: touch.clientY };
    };

    const end = (event) => {
      if (!start) return;
      const touch = event.changedTouches[0];
      const dx = touch.clientX - start.x;
      const dy = touch.clientY - start.y;
      start = null;

      if (Math.max(Math.abs(dx), Math.abs(dy)) < threshold) return;
      const horizontal = Math.abs(dx) > Math.abs(dy);
      onswipe(horizontal ? (dx > 0 ? 'right' : 'left') : dy > 0 ? 'down' : 'up');
    };

    const cancel = () => {
      start = null;
    };

    element.addEventListener('touchstart', begin, { passive: true });
    element.addEventListener('touchend', end, { passive: true });
    element.addEventListener('touchcancel', cancel, { passive: true });

    return () => {
      element.removeEventListener('touchstart', begin);
      element.removeEventListener('touchend', end);
      element.removeEventListener('touchcancel', cancel);
    };
  };
}
