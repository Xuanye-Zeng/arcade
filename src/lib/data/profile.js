// Everything the About page lists. Keeping it here rather than in the markup
// means the page is one set of small components over a few arrays, and adding
// a job or a project is a data change.

export const experience = [
  {
    id: 'onki',
    from: { date: '2026-05', label: 'May' },
    to: { date: '2026-08', label: 'Aug 2026' },
    organisation: 'Smart Carrier Inc. (Onki)',
    role: 'AI Engineering Intern',
    points: [
      'Built a catalog-intake service in Python and FastAPI that turns unstructured merchant product data into the structured records a voice AI agent runs on, replacing a manual ops workflow.',
      'Shipped an LLM-based validator that flags missing fields and anomalous values before data reaches the model, catching bad input at ingestion instead of as a wrong answer later.',
      'Made state transitions idempotent so duplicate submits cannot corrupt state, and replaced server-side sessions with stateless HMAC-SHA256 tokens verified in constant time.',
      'Cut the onboarding lifecycle from six states to three over two cross-functional design reviews, making resubmission one click.'
    ]
  },
  {
    id: 'jingdiao',
    from: { date: '2024-07', label: 'Jul' },
    to: { date: '2024-08', label: 'Aug 2024' },
    organisation: 'Beijing Jingdiao Group',
    role: 'Software & Automation Engineer Intern',
    points: [
      'Wrote a sensor fault-detection workflow in C that found failure patterns in diagnostic logs and triggered automated recovery, cutting equipment downtime 33%.',
      'Added a pre-run validation script that gated jobs on machine-state checks, blocking runs that would have failed mid-job and reducing unplanned stops 15%.'
    ]
  }
];

export const projects = [
  {
    id: 'nexus',
    title: 'Nexus: Multi-Agent LLM Platform',
    meta: 'May – Aug 2026 · LangGraph, PostgreSQL, pgvector, React, TypeScript',
    points: [
      'Built a LangGraph agent that orchestrates 8 tools behind an intent classifier, with conversation state in PostgreSQL and a React and TypeScript frontend.',
      'Implemented RAG over pgvector with cosine top-k retrieval and a re-scoring pass, so answers are grounded in retrieved records.',
      'Designed a CI evaluation loop with hard checks that fail the build and soft checks that only report. Its first run caught the model inventing numbers that were not in the input.',
      'Resolved employer names across 404K records into 48K entities with a 4-layer name matcher (97% hit rate).'
    ]
  },
  {
    id: 'clinical',
    title: 'Clinical Data Reconciliation Engine',
    meta: 'Apr 2026',
    points: [
      'Kept the LLM out of the decision path: a deterministic rule engine scores each medication source and owns drug selection and the safety check, and the model only rewrites the explanation.',
      'Checked every response for groundedness, JSON shape and length before use, falling back to rule-based output when the model is slow or off-format.'
    ]
  },
  {
    id: 'ml-pipeline',
    title: 'ML Feature Pipeline and Training System',
    meta: 'Mar 2026 · PyTorch, scikit-learn, Ray Tune',
    points: [
      'Made every training run reproducible from a config file, with a pipeline covering ingestion, schema validation, drift monitoring, tuning and evaluation across 15 runs.',
      'Compared logistic regression, random forest and a PyTorch MLP across 60 Ray Tune trials with cross-validation, selecting on F1.'
    ]
  },
  {
    id: 'cloudscale',
    title: 'CloudScale: Distributed Inventory and Order System',
    meta: 'Oct – Dec 2025 · Go, Docker, Kubernetes',
    points: [
      'Split an order system into 4 Go microservices on Docker and Kubernetes, sustaining 35K requests per second at 1.3 ms p50 with zero errors over 525K requests.',
      'Traced a 97.7% error rate to the load generator, not the service: Go’s default transport keeps only two idle connections per host, so the client ran out of ephemeral ports. Pooling connections raised throughput 6x.'
    ]
  }
];

export const education = [
  {
    id: 'neu',
    from: { date: '2025-09', label: 'Sep 2025' },
    to: { date: '2027-12', label: 'Dec 2027' },
    organisation: 'Northeastern University – Seattle',
    role: 'Master of Science, Computer Science',
    note: 'GPA 4.0 / 4.0 · Expected graduation December 2027'
  },
  {
    id: 'ustb',
    from: { date: '2021-09', label: 'Sep 2021' },
    to: { date: '2025-07', label: 'Jul 2025' },
    organisation: 'University of Science and Technology Beijing',
    role: 'Bachelor of Engineering, Mechanical Engineering',
    research: {
      summary:
        'Reinforcement learning for context management in AI systems: running experiments and tuning.',
      recognition: 'Second Prize, Student Research Training Program'
    }
  }
];

export const skills = [
  {
    id: 'languages',
    label: 'Languages',
    items: ['Python', 'Go', 'Java', 'TypeScript / JavaScript', 'C / C++', 'SQL']
  },
  {
    id: 'ai',
    label: 'AI and ML',
    items: [
      'PyTorch',
      'scikit-learn',
      'Ray Tune',
      'LangGraph',
      'RAG',
      'pgvector',
      'Ollama',
      'Anthropic and OpenAI APIs'
    ]
  },
  {
    id: 'backend',
    label: 'Backend and infra',
    items: [
      'FastAPI',
      'Spring Boot',
      'PostgreSQL',
      'Redis',
      'Celery',
      'Docker',
      'Kubernetes',
      'AWS',
      'GitHub Actions',
      'pytest',
      'Linux'
    ]
  },
  {
    id: 'web',
    label: 'Web',
    items: ['Svelte / SvelteKit', 'HTML and CSS', 'npm packaging', 'Accessibility (WCAG)']
  },
  {
    id: 'foundations',
    label: 'Foundations',
    items: ['Data structures and algorithms', 'Operating systems', 'Distributed systems']
  }
];
