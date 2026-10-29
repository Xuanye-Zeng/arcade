<script>
  import Crossword from '$components/crossword/Crossword.svelte';
</script>

<svelte:head>
  <title>The Mini Crossword · Xuanye Zeng&rsquo;s Arcade</title>
  <meta name="description" content="Play a five-by-five mini crossword, built in Svelte." />
</svelte:head>

<header class="page-head">
  <p class="kicker">Puzzle No. 1</p>
  <h1>The Mini</h1>
  <p class="deck">
    A 5&times;5 crossword. Click or tap a square to start typing; arrow keys move around the grid.
  </p>
</header>

<Crossword />
