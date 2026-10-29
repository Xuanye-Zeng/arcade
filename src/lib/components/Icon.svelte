<script>
  import { base } from '$app/paths';

  /**
   * One symbol from the shared SVG sprite. Icons here are always decoration
   * next to a visible label, so they are hidden from assistive technology.
   */
  let { name, size = '1.25em', class: className = '' } = $props();
</script>

<svg class={className} style:--icon-size={size} aria-hidden="true" focusable="false">
  <use href="{base}/icons/sprite.svg#{name}" />
</svg>

<style>
  svg {
    width: var(--icon-size);
    height: var(--icon-size);
    flex: none;
  }
</style>
