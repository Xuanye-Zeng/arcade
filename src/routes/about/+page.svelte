<script>
  import { base } from '$app/paths';
  import ProjectCard from '$components/ProjectCard.svelte';
  import SkillList from '$components/SkillList.svelte';
  import TimelineEntry from '$components/TimelineEntry.svelte';
  import { education, experience, projects, skills } from '$data/profile.js';
</script>

<svelte:head>
  <title>About · Xuanye Zeng&rsquo;s Arcade</title>
  <meta name="description" content="Xuanye Zeng: experience, projects, education and skills." />
</svelte:head>

<article class="profile">
  <header class="page-head">
    <p class="kicker">Profile</p>
    <h1>Xuanye Zeng</h1>
    <p class="deck">
      M.S. Computer Science student at Northeastern University in Seattle. I work mostly on
      backend and AI systems.
    </p>
  </header>

  <div class="profile-intro">
    <figure class="portrait">
      <img
        src="{base}/images/portrait-720.jpg"
        srcset="{base}/images/portrait-360.jpg 360w, {base}/images/portrait-720.jpg 720w"
        sizes="(min-width: 46em) 16rem, 14rem"
        width="720"
        height="720"
        alt="Portrait of Xuanye Zeng, smiling, wearing a gray sweater over a white collared shirt."
      />
      <figcaption>Xuanye Zeng &middot; M.S. Computer Science, expected December 2027</figcaption>
    </figure>

    <div class="lede">
      <p>
        Computer science is my second degree. I studied mechanical engineering at the University
        of Science and Technology Beijing, and a research project there on reinforcement learning
        for context management in AI systems is what got me into software. I&rsquo;m now doing my
        master&rsquo;s in computer science at Northeastern University&rsquo;s Seattle campus.
      </p>
      <p>
        Most of what I build is backend and AI infrastructure. This summer I interned at Smart
        Carrier (Onki), where I built the service that turns merchant product data into the
        structured records their voice AI agent runs on. In my own projects I spend a lot of time
        on validation and evaluation, so that model output gets checked before anything depends
        on it.
      </p>
      <p>
        This site is my project for a web development course this semester. It began as a
        crossword in plain HTML and CSS, and is now a SvelteKit app with 2048 alongside it,
        running on game logic I published as its own npm package.
      </p>
      <p class="status">
        <strong>Currently:</strong> open to 2027 new grad SDE and AI Engineer roles.
      </p>
    </div>
  </div>

  <section class="profile-section" aria-labelledby="experience-title">
    <h2 id="experience-title" class="section-title">Experience</h2>
    <ol class="timeline">
      {#each experience as job (job.id)}
        <li>
          <TimelineEntry
            from={job.from}
            to={job.to}
            organisation={job.organisation}
            role={job.role}
            points={job.points}
          />
        </li>
      {/each}
    </ol>
  </section>

  <section class="profile-section" aria-labelledby="projects-title">
    <h2 id="projects-title" class="section-title">Projects</h2>
    <div class="project-grid">
      {#each projects as project (project.id)}
        <ProjectCard title={project.title} meta={project.meta} points={project.points} />
      {/each}
    </div>
  </section>

  <section class="profile-section" aria-labelledby="education-title">
    <h2 id="education-title" class="section-title">Education</h2>
    <ol class="timeline">
      {#each education as school (school.id)}
        <li>
          <TimelineEntry
            from={school.from}
            to={school.to}
            organisation={school.organisation}
            role={school.role}
            note={school.note ?? ''}
          >
            {#if school.research}
              <section class="research" aria-labelledby="research-{school.id}">
                <h5 id="research-{school.id}">Research</h5>
                <p>{school.research.summary}</p>
                <h6>Recognition</h6>
                <p>{school.research.recognition}</p>
              </section>
            {/if}
          </TimelineEntry>
        </li>
      {/each}
    </ol>
  </section>

  <section class="profile-section" aria-labelledby="skills-title">
    <h2 id="skills-title" class="section-title">Skills</h2>
    <SkillList groups={skills} />
  </section>
</article>

<style>
  .profile-intro {
    display: grid;
    gap: var(--space-8);
    margin-bottom: var(--space-12);
  }

  .portrait {
    max-width: 14rem;
    margin: 0;
  }

  .portrait img {
    width: 100%;
    aspect-ratio: 1;
    object-fit: cover;
    border: var(--rule-strong);
  }

  .portrait figcaption {
    margin-top: var(--space-2);
    padding-top: var(--space-2);
    font-family: var(--font-sans);
    font-size: var(--step--1);
    line-height: 1.4;
    color: var(--color-text-muted);
    border-top: var(--rule-thin);
  }

  /* Drop cap sized to span three lines of body text */
  .lede > p:first-child::first-letter {
    float: left;
    margin: 0.1em 0.08em 0 0;
    font-size: 4.1em;
    font-weight: 800;
    line-height: 0.8;
    color: var(--color-accent);
  }

  .status {
    padding: var(--space-3) var(--space-4);
    font-family: var(--font-sans);
    font-size: var(--step--1);
    background-color: var(--color-surface-alt);
    border-left: 4px solid var(--color-accent);
  }

  .profile-section {
    margin-bottom: var(--space-12);
  }

  .timeline {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .timeline > li {
    max-width: none;
  }

  .timeline > li:first-child :global(.entry) {
    padding-top: 0;
  }

  .research {
    margin-top: var(--space-4);
    padding-left: var(--space-4);
    border-left: var(--rule-thin);
  }

  .research h5,
  .research h6 {
    margin-bottom: var(--space-1);
  }

  .research p:last-child {
    margin-bottom: 0;
  }

  .project-grid {
    display: grid;
    gap: var(--space-6);
  }

  @media (min-width: 46em) {
    .profile-intro {
      grid-template-columns: 16rem minmax(0, 1fr);
      align-items: start;
    }

    .portrait {
      max-width: none;
    }

    .project-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
</style>
