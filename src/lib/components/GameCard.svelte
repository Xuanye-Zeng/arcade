<script>
  import { base } from '$app/paths';
  import Icon from './Icon.svelte';

  /**
   * One game on the front page. `note` is the optional line under the
   * heading, used to show the best score once there is one.
   */
  let { kicker, title, meta, preview, previewAlt, href, cta, note = '', children } = $props();
</script>

<article class="story">
  <p class="kicker">{kicker}</p>
  <h2>{title}</h2>
  <p class="meta">{meta}</p>

  <div class="story__body">
    <img class="story__preview" src={preview} width="212" height="212" alt={previewAlt} />
    <div>
      {@render children()}
      {#if note}
        <p class="note">{note}</p>
      {/if}
      <a class="button" href="{base}{href}">
        {cta}
        <Icon name="icon-arrow" />
      </a>
    </div>
  </div>
</article>

<style>
  .story h2 {
    font-size: var(--step-3);
  }

  .story__body {
    display: grid;
    gap: var(--space-6);
    align-items: center;
    margin-top: var(--space-6);
  }

  .story__preview {
    width: 100%;
    max-width: 13rem;
    border: var(--rule-thin);
    transition: transform var(--transition);
  }

  .story:hover .story__preview {
    transform: rotate(-2deg) scale(1.02);
  }

  .note {
    font-family: var(--font-sans);
    font-size: var(--step--1);
    font-weight: 600;
    color: var(--color-accent);
  }

  @media (min-width: 46em) {
    .story__body {
      grid-template-columns: 13rem minmax(0, 1fr);
    }
  }
</style>
