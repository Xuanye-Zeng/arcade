<script>
  /** The skills table: a label and its tags, one row per group. */
  let { groups } = $props();
</script>

<dl class="skills">
  {#each groups as group (group.id)}
    <div>
      <dt>{group.label}</dt>
      <dd>
        <ul class="tags">
          {#each group.items as item (item)}
            <li>{item}</li>
          {/each}
        </ul>
      </dd>
    </div>
  {/each}
</dl>

<style>
  .skills {
    display: grid;
    gap: var(--space-6);
    margin: 0;
  }

  .skills > div {
    display: grid;
    gap: var(--space-2) var(--space-8);
  }

  dt {
    font-family: var(--font-sans);
    font-size: var(--step--1);
    font-weight: 700;
    letter-spacing: var(--tracking-caps);
    text-transform: uppercase;
  }

  dd {
    margin: 0;
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .tags li {
    padding: var(--space-1) var(--space-3);
    font-family: var(--font-sans);
    font-size: var(--step--1);
    background-color: var(--color-surface);
    border: var(--rule-thin);
  }

  @media (min-width: 46em) {
    .skills > div {
      grid-template-columns: 10rem minmax(0, 1fr);
    }
  }
</style>
