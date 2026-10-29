<script>
  /** One project, as a card in the About page grid. */
  let { title, meta, points } = $props();
</script>

<article class="project">
  <h3>{title}</h3>
  <p class="meta">{meta}</p>
  <ul class="project__points">
    {#each points as point, index (index)}
      <li>{point}</li>
    {/each}
  </ul>
</article>

<style>
  .project {
    padding: var(--space-6);
    background-color: var(--color-surface);
    border: var(--rule-thin);
    border-top: 4px solid var(--color-rule-strong);
    transition: transform var(--transition);
  }

  .project:hover {
    transform: translateY(-3px);
  }

  .project h3 {
    margin-bottom: var(--space-2);
    font-size: var(--step-1);
  }

  .project__points {
    margin-bottom: 0;
    padding-left: 1.25em;
  }

  .project__points li {
    margin-bottom: var(--space-2);
  }

  .project__points li::marker {
    color: var(--color-accent);
  }
</style>
