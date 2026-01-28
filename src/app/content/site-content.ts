import { SiteContent } from './site-content.model';

export const SITE_CONTENT: SiteContent = {
  nav: [
    { label: 'Home', path: '/' },
    { label: 'Functions', path: '/functions' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ],
  footer: {
    projectName: 'Mind Toolbox',
    mission:
      'Empowering clinicians and researchers with a focused toolkit for neurodiagnostic insight.',
  },
  pages: {
    home: {
      hero: {
        title: 'Mind Toolbox',
        description:
          'A focused hub for collaborators and investors to align on the clinical mission, opportunity landscape, and execution roadmap.',
        actions: [
          {
            label: 'Explore Functions',
            path: '/functions',
            variant: 'primary',
          },
          {
            label: 'Contact the Team',
            path: '/contact',
            variant: 'secondary',
          },
        ],
      },
      sections: [
        {
          id: 'why',
          title: 'Why this exists',
          paragraphs: [
            'Neurodiagnostic programs demand alignment across research, clinical delivery, and investment strategy. The Mind Toolbox anchors that alignment with a shared narrative and curated operational context.',
            'We translate complex scientific ambition into a concise experience that highlights decision-ready signals, ensuring collaborators understand what is real today and what is ahead.',
            'The outcome is a clear, investor-ready summary of the mission, the team, and the near-term execution plan.',
          ],
        },
        {
          id: 'who',
          title: "Who it\u2019s for",
          features: [
            {
              title: 'Neuropsychologists',
              description:
                'Clinicians looking for evidence-informed workflows, reference material, and shared clinical language.',
            },
            {
              title: 'Clinical psychologists',
              description:
                'Leaders shaping assessment strategy and continuity of care across multidisciplinary teams.',
            },
            {
              title: 'Psychotherapists',
              description:
                'Partners focused on therapeutic outcomes who need a clear view into diagnostic context and referrals.',
            },
          ],
        },
        {
          id: 'coming',
          title: "What\u2019s coming",
          bullets: [
            'Expanded function briefs with clinical evidence notes and operational readiness tags.',
            'Investor-facing milestones tied to pilot deployments and validation studies.',
            'Partner onboarding playbooks for coordinated research and clinical rollout.',
          ],
        },
      ],
    },
    functions: {
      hero: {
        title: 'Functions',
        description: 'Core features and workflows supporting the Mind Toolbox.',
      },
      sections: [
        {
          id: 'catalog',
          title: 'Function Catalog',
          bullets: [
            'Clinical workflow snapshots to guide diagnostic decisions.',
            'Research playbooks that align data capture with analysis goals.',
            'Operational checklists for governance and compliance readiness.',
          ],
        },
        {
          id: 'delivery',
          title: 'Delivery Focus',
          body: 'Each function emphasizes clarity, repeatability, and accessibility for clinical and research teams.',
        },
      ],
    },
    about: {
      hero: {
        title: 'About',
        description: 'Why the Mind Toolbox exists and how it supports neurodiagnostic programs.',
      },
      sections: [
        {
          id: 'mission',
          title: 'Mission',
          body: 'Support interdisciplinary teams with a concise set of tools and context for neurodiagnostic decisions.',
        },
        {
          id: 'approach',
          title: 'Approach',
          bullets: [
            'Reduce cognitive load with clear navigation and structured content.',
            'Highlight what matters most for clinicians, researchers, and partners.',
            'Maintain accessibility and responsive design at every step.',
          ],
        },
        {
          id: 'values',
          title: 'Values',
          body: 'Focus, transparency, and collaboration guide every update to the toolbox.',
        },
      ],
    },
    contact: {
      hero: {
        title: 'Contact',
        description: 'Reach the Mind Toolbox team for collaboration, feedback, or support.',
      },
      sections: [
        {
          id: 'general',
          title: 'General Inquiries',
          body: 'Email: info@mind-neuro.org for general questions or program updates.',
        },
        {
          id: 'collaboration',
          title: 'Collaboration Requests',
          ordered: [
            'Send a brief overview of your project goals and timeline.',
            'We will respond within five working days with next steps.',
            'A follow-up call will be scheduled for qualified requests.',
          ],
        },
        {
          id: 'media',
          title: 'Feedback',
          body: 'Share feedback on the toolbox experience to help us prioritize improvements.',
        },
      ],
    },
  },
} as const;
