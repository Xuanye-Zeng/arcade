<script>
  import '../app.css';
  import SiteHeader from '$components/SiteHeader.svelte';
  import SiteFooter from '$components/SiteFooter.svelte';

  let { children } = $props();
</script>

<a class="skip-link" href="#main">Skip to main content</a>

<SiteHeader />

<main id="main" class="container">
  {@render children()}
</main>

<SiteFooter />
