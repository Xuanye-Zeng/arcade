<script>
  import Game2048 from '$components/game2048/Game2048.svelte';
</script>

<svelte:head>
  <title>2048 · Xuanye Zeng&rsquo;s Arcade</title>
  <meta
    name="description"
    content="Play 2048: slide the tiles with the arrow keys, merge equal numbers and reach 2048."
  />
</svelte:head>

<header class="page-head">
  <p class="kicker">Puzzle No. 2</p>
  <h1>2048</h1>
  <p class="deck">
    Slide the tiles, merge equal numbers and work your way up to 2048. The board logic comes from
    my <code>@xuanye-zeng/arcade-core</code> package.
  </p>
</header>

<Game2048 />
