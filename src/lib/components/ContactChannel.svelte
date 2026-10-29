<script>
  import Icon from './Icon.svelte';

  /** One way to get in touch. With an `href` the whole card is clickable. */
  let { icon, label, value, href = null, note } = $props();
</script>

<li class="channel" class:channel--linked={href !== null}>
  <Icon name={icon} size="2rem" class="channel__icon" />
  <span class="channel__label">{label}</span>

  {#if href}
    <a class="channel__link" {href}>{value}</a>
  {:else}
    <span class="channel__value">{value}</span>
  {/if}

  <span class="channel__note">{note}</span>
</li>

<style>
  .channel {
    position: relative;
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    align-content: start;
    gap: var(--space-1) var(--space-4);
    max-width: none;
    padding: var(--space-6);
    background-color: var(--color-surface);
    border: var(--rule-strong);
    transition: transform var(--transition), box-shadow var(--transition);
  }

  .channel :global(.channel__icon) {
    color: var(--color-text);
  }

  .channel__label {
    align-self: center;
    font-family: var(--font-sans);
    font-size: var(--step--1);
    font-weight: 700;
    letter-spacing: var(--tracking-caps);
    text-transform: uppercase;
    color: var(--color-text-muted);
  }

  .channel__link,
  .channel__value,
  .channel__note {
    grid-column: 1 / -1;
  }

  .channel__link,
  .channel__value {
    font-family: var(--font-sans);
    font-weight: 600;
    overflow-wrap: break-word;
  }

  /* Stretch the link over the card so the whole card is clickable */
  .channel__link::after {
    content: "";
    position: absolute;
    inset: 0;
  }

  .channel__link:focus-visible {
    outline: none;
  }

  .channel:has(.channel__link:focus-visible) {
    outline: var(--focus-ring);
    outline-offset: 3px;
  }

  .channel--linked:hover {
    box-shadow: 4px 4px 0 var(--color-rule-strong);
    transform: translate(-2px, -2px);
  }

  .channel__note {
    font-family: var(--font-sans);
    font-size: var(--step--1);
    color: var(--color-text-muted);
  }

  @media (min-width: 46em) {
    .channel :global(.channel__icon) {
      grid-row: span 3;
    }

    .channel__label {
      align-self: auto;
    }

    .channel__link,
    .channel__value,
    .channel__note {
      grid-column: 2;
    }
  }
</style>
