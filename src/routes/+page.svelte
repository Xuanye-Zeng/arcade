<script>
  import { onMount } from 'svelte';
  import { base } from '$app/paths';
  import GameCard from '$components/GameCard.svelte';
  import Icon from '$components/Icon.svelte';
  import { scoreboard } from '$state/scoreboard.svelte.js';

  // The best score is shared state: the 2048 page writes it, this page reads it.
  onMount(() => scoreboard.load());

  const bestNote = $derived(
    scoreboard.loaded && scoreboard.best > 0 ? `Your best score so far: ${scoreboard.best}.` : ''
  );
</script>

<svelte:head>
  <title>Xuanye Zeng&rsquo;s Arcade</title>
  <meta
    name="description"
    content="Xuanye Zeng's personal site, with a few small browser games built in SvelteKit."
  />
</svelte:head>

<section class="lead" aria-labelledby="lead-title">
  <h1 id="lead-title">The Arcade</h1>
  <p class="deck">
    A few small browser games I&rsquo;m building this semester: a mini crossword and 2048.
  </p>
</section>

<div class="front">
  <div class="front__main">
    <GameCard
      kicker="Puzzle No. 1"
      title="The Mini Crossword"
      meta="5×5 · 10 clues"
      preview="{base}/images/mini-preview.svg"
      previewAlt="Preview of the mini crossword: an empty five-by-five grid with black squares in the top-left and bottom-right corners."
      href="/crossword"
      cta="Play the Mini"
    >
      <p>
        A quick 5&times;5 crossword. Type into the grid, check your letters as you go, or reveal
        the answers if you get stuck.
      </p>
    </GameCard>

    <GameCard
      kicker="Puzzle No. 2"
      title="2048"
      meta="4×4 · arrow keys"
      preview="{base}/images/2048-preview.svg"
      previewAlt="Preview of a 2048 board: a four-by-four grid of blue tiles with the numbers 2 through 2048."
      href="/2048"
      cta="Play 2048"
      note={bestNote}
    >
      <p>
        Slide the tiles with the arrow keys. Equal tiles merge, and the aim is a 2048 tile. Your
        game and your best score are kept between visits.
      </p>
    </GameCard>

    <section class="story story--notes" aria-labelledby="notes-title">
      <p class="kicker">Behind the games</p>
      <h2 id="notes-title">How it works</h2>
      <p>
        The site is a SvelteKit app, and the rules of 2048 live in a package of their own so the
        board logic can be tested without a browser.
      </p>
      <ul class="notes-list">
        <li>
          <code>@xuanye-zeng/arcade-core</code> exports pure functions: give it a board and a
          direction, get a new board back. No Svelte, no DOM.
        </li>
        <li>
          The app installs it from npm and adds only what the screen needs, like tile identity
          so tiles slide instead of flicker.
        </li>
        <li>The crossword is a Svelte component now, rather than the CSS-only form it started as.</li>
      </ul>
      <p>
        <a class="source-link" href="https://www.npmjs.com/package/@xuanye-zeng/arcade-core">
          The package on npm
          <Icon name="icon-arrow" />
        </a>
      </p>
    </section>
  </div>

  <aside class="sidebar" aria-label="About me">
    <section class="story story--intro" aria-labelledby="intro-title">
      <p class="kicker">About</p>
      <img
        class="intro-photo"
        src="{base}/images/portrait-360.jpg"
        width="360"
        height="360"
        alt="Portrait of Xuanye Zeng."
      />
      <h2 id="intro-title">Hi, I&rsquo;m Xuanye.</h2>
      <p>
        I&rsquo;m a CS master&rsquo;s student at Northeastern University in Seattle, graduating in
        December 2027. Most of my work is in backend and AI engineering.
      </p>
      <a class="more-link" href="{base}/about">
        More about me
        <Icon name="icon-arrow" size="1.125em" />
      </a>
    </section>

    <section class="story story--contact" aria-labelledby="contact-title">
      <p class="kicker">Contact</p>
      <h2 id="contact-title">Get in touch</h2>
      <p>Email is the best way to reach me. My GitHub and LinkedIn are on the contact page.</p>
      <a class="more-link" href="{base}/contact">
        Contact info
        <Icon name="icon-arrow" size="1.125em" />
      </a>
    </section>
  </aside>
</div>

<style>
  /* Laid out like a newspaper front page */
  .lead {
    padding-block: var(--space-12) var(--space-8);
    text-align: center;
  }

  .lead h1 {
    font-size: var(--step-6);
  }

  .lead :global(.deck) {
    margin-inline: auto;
  }

  .front {
    display: grid;
    gap: var(--space-8);
    padding-block: var(--space-8);
    border-top: var(--rule-double);
  }

  .front__main {
    display: grid;
    gap: var(--space-8);
    align-content: start;
  }

  /* "How it works" box under the games */
  .story--notes {
    padding: var(--space-6);
    background-color: var(--color-surface-alt);
    border-top: 4px solid var(--color-rule-strong);
  }

  .story--notes p,
  .story--notes li {
    max-width: none;
  }

  .story--notes h2 {
    font-size: var(--step-2);
  }

  .notes-list {
    margin: 0 0 var(--space-4);
    padding-left: 1.25em;
  }

  .notes-list li {
    margin-bottom: var(--space-2);
  }

  .notes-list li::marker {
    color: var(--color-accent);
  }

  .sidebar {
    display: grid;
    gap: var(--space-8);
    align-content: start;
  }

  .sidebar h2 {
    font-size: var(--step-2);
  }

  .story--contact {
    padding-top: var(--space-6);
    border-top: var(--rule-thin);
  }

  .intro-photo {
    width: 100%;
    max-width: 12rem;
    margin-bottom: var(--space-4);
    aspect-ratio: 1;
    object-fit: cover;
    border: var(--rule-strong);
  }

  /* Standalone link with a 44px tap target */
  .more-link,
  .source-link {
    display: inline-flex;
    align-items: center;
    gap: var(--space-1);
    min-height: var(--tap-size);
    font-family: var(--font-sans);
    font-size: var(--step--1);
    font-weight: 700;
    letter-spacing: var(--tracking-caps);
    text-transform: uppercase;
  }

  .more-link :global(svg),
  .source-link :global(svg) {
    transition: transform var(--transition);
  }

  .more-link:hover :global(svg),
  .source-link:hover :global(svg) {
    transform: translateX(3px);
  }

  @media (min-width: 46em) {
    .front {
      grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
      gap: 0;
    }

    .front__main {
      padding-right: var(--space-8);
      border-right: var(--rule-thin);
    }

    .sidebar {
      padding-left: var(--space-8);
    }
  }
</style>
