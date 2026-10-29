<script>
  import ContactChannel from '$components/ContactChannel.svelte';
  import { channels } from '$data/contact.js';
</script>

<svelte:head>
  <title>Contact · Xuanye Zeng&rsquo;s Arcade</title>
  <meta name="description" content="How to reach Xuanye Zeng: email, GitHub and LinkedIn." />
</svelte:head>

<header class="page-head">
  <p class="kicker">Get in touch</p>
  <h1>Contact</h1>
  <p class="deck">Email is the best way to reach me. I&rsquo;m also on LinkedIn and GitHub.</p>
</header>

<section aria-labelledby="channels-title">
  <h2 id="channels-title" class="section-title">Where to find me</h2>
  <address>
    <ul class="channels">
      {#each channels as channel (channel.id)}
        <ContactChannel
          icon={channel.icon}
          label={channel.label}
          value={channel.value}
          href={channel.href}
          note={channel.note}
        />
      {/each}
    </ul>
  </address>
</section>

<section class="contact-notes" aria-labelledby="looking-title">
  <h2 id="looking-title" class="section-title">What I&rsquo;m looking for</h2>
  <p>
    I graduate in December 2027 and I&rsquo;m looking for 2027 new grad Software Development
    Engineer and AI Engineer roles.
  </p>
  <p>
    The work I enjoy most is on the backend: services, data pipelines and LLM applications, along
    with the validation and evaluation that keep them reliable. Most of my experience is in
    Python and Go, with FastAPI, PostgreSQL, Docker and Kubernetes.
  </p>
  <p>If you&rsquo;re hiring for one of these roles, send me an email.</p>
</section>

<style>
  .channels {
    display: grid;
    gap: var(--space-4);
    margin: 0 0 var(--space-12);
    padding: 0;
    list-style: none;
  }

  @media (min-width: 46em) {
    .channels {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
</style>
