<script>
  import { base } from '$app/paths';
</script>

<footer class="site-footer">
  <div class="container">
    <img class="footer-ornament" src="{base}/images/ornament.svg" width="120" height="16" alt="" />
    <div class="site-footer__inner">
      <p>&copy; 2026 Xuanye Zeng</p>
      <p>Built with SvelteKit. Game logic from <code>@xuanye-zeng/arcade-core</code>.</p>
      <p><a href="#top">Back to top</a></p>
    </div>
  </div>
</footer>

<style>
  .site-footer {
    margin-top: var(--space-16);
    padding-block: var(--space-8);
    font-family: var(--font-sans);
    font-size: var(--step--1);
    color: var(--color-text-muted);
    border-top: var(--rule-double);
  }

  .site-footer__inner {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-2) var(--space-8);
  }

  .site-footer p {
    margin: 0;
  }

  .site-footer a {
    display: inline-flex;
    align-items: center;
    min-height: var(--tap-size);
  }

  .footer-ornament {
    width: 7.5rem;
    margin: 0 auto var(--space-6);
  }
</style>
