<script>
  /** One job or degree: dates on the left, details on the right. */
  let { from, to, organisation, role, points = [], note = '', children } = $props();
</script>

<article class="entry">
  <p class="entry__date">
    <time datetime={from.date}>{from.label}</time>
    {#if to}
      &ndash; <time datetime={to.date}>{to.label}</time>
    {/if}
  </p>

  <div class="entry__body">
    <h3>{organisation}</h3>
    <h4>{role}</h4>

    {#if points.length > 0}
      <ul class="entry__points">
        {#each points as point, index (index)}
          <li>{point}</li>
        {/each}
      </ul>
    {/if}

    {#if note}
      <p>{note}</p>
    {/if}

    {#if children}
      {@render children()}
    {/if}
  </div>
</article>

<style>
  .entry {
    display: grid;
    gap: var(--space-1) var(--space-8);
    padding-block: var(--space-6);
    border-bottom: var(--rule-thin);
  }

  .entry__date {
    margin: 0;
    font-family: var(--font-sans);
    font-size: var(--step--1);
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--color-text-muted);
  }

  .entry__body h3 {
    margin-bottom: var(--space-1);
  }

  .entry__body h4 {
    margin-bottom: var(--space-3);
    font-style: italic;
    color: var(--color-text-muted);
  }

  .entry__body > :global(p:last-child) {
    margin-bottom: 0;
  }

  .entry__points {
    margin-bottom: 0;
    padding-left: 1.25em;
  }

  .entry__points li {
    margin-bottom: var(--space-2);
  }

  .entry__points li::marker {
    color: var(--color-accent);
  }

  @media (min-width: 46em) {
    .entry {
      grid-template-columns: 10rem minmax(0, 1fr);
    }

    .entry__date {
      padding-top: 0.4em;
    }
  }
</style>
