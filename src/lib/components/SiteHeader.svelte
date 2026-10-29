<script>
  import { page } from '$app/state';
  import { base } from '$app/paths';
  import { navLinks } from '$data/nav.js';
  import Icon from './Icon.svelte';

  // The path with the base prefix taken off, so link matching works the same
  // at a domain root and under a repository subpath.
  const path = $derived(page.url.pathname.slice(base.length) || '/');

  const isCurrent = (link) =>
    link.exact ? path === link.href : path === link.href || path.startsWith(`${link.href}/`);
</script>

<header class="site-header">
  <nav class="site-nav container" aria-label="Primary">
    <a class="brand" href="{base}/">
      <Icon name="logo" size="1.75rem" class="brand__mark" />
      <span>Xuanye Zeng&rsquo;s Arcade</span>
    </a>

    <ul class="nav-list">
      {#each navLinks as link (link.href)}
        <li>
          <a
            class="nav-link"
            class:nav-link--current={isCurrent(link)}
            href="{base}{link.href === '/' ? '/' : link.href}"
            aria-current={isCurrent(link) ? 'page' : undefined}
          >
            <Icon name={link.icon} size="1.375rem" class="nav-icon" />
            {link.label}
          </a>
        </li>
      {/each}
    </ul>
  </nav>
</header>

<style>
  /* Mobile first: the brand stays in a slim sticky bar at the top and the
     links become a tab bar fixed to the bottom of the screen. */
  .site-header {
    position: sticky;
    top: 0;
    z-index: 50;
    padding-top: env(safe-area-inset-top);
    background-color: var(--color-bg);
    border-bottom: var(--rule-double);
  }

  .site-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-4);
    min-height: var(--header-height);
  }

  .brand {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    min-height: var(--tap-size);
    font-family: var(--font-serif);
    font-size: var(--step-1);
    font-weight: 800;
    line-height: 1;
    letter-spacing: -0.01em;
    color: var(--color-text);
    text-decoration: none;
  }

  .brand :global(.brand__mark) {
    transition: transform var(--transition);
  }

  .brand:hover :global(.brand__mark) {
    transform: rotate(-8deg);
  }

  .nav-list {
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 50;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    margin: 0;
    padding: 0 0 env(safe-area-inset-bottom);
    list-style: none;
    background-color: var(--color-bg);
    border-top: var(--rule-double);
  }

  .nav-list li {
    max-width: none;
  }

  .nav-link {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--space-1);
    min-height: var(--tabbar-height);
    padding: var(--space-1);
    font-family: var(--font-sans);
    font-size: var(--step--2);
    font-weight: 600;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    color: var(--color-text);
    text-decoration: none;
  }

  /* Underline bar: shown on hover and on the current page */
  .nav-link::after {
    content: "";
    position: absolute;
    top: 0;
    right: 25%;
    left: 25%;
    height: 3px;
    background-color: currentColor;
    transform: scaleX(0);
    transition: transform var(--transition);
  }

  .nav-link:hover {
    color: var(--color-accent);
  }

  .nav-link:hover::after,
  .nav-link--current::after {
    transform: scaleX(1);
  }

  .nav-link--current {
    font-weight: 800;
    color: var(--color-accent);
  }

  .nav-link:focus-visible {
    outline-offset: -3px;
  }

  @media (min-width: 46em) {
    .nav-list {
      position: static;
      display: flex;
      gap: var(--space-1);
      padding: 0;
      background-color: transparent;
      border-top: 0;
    }

    .nav-link {
      flex-direction: row;
      min-height: var(--header-height);
      padding-inline: var(--space-3);
      font-size: var(--step--1);
      letter-spacing: var(--tracking-caps);
    }

    .nav-link::after {
      top: auto;
      right: var(--space-3);
      bottom: var(--space-2);
      left: var(--space-3);
      transform-origin: left;
    }

    .nav-link :global(.nav-icon) {
      display: none;
    }
  }
</style>
