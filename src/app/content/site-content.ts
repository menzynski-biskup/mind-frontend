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
          'A streamlined workspace for exploring neurodiagnostic functions, program direction, and collaboration.',
      },
      sections: [
        {
          id: 'overview',
          title: 'Purpose',
          body: 'Centralize the essential tools, workflows, and context needed to support neurodiagnostic initiatives.',
        },
        {
          id: 'highlights',
          title: 'Highlights',
          features: [
            {
              title: 'Functions Catalog',
              description: 'Review the latest diagnostic workflows and tooling summaries in one place.',
            },
            {
              title: 'Mission-Driven',
              description: 'Keep the team aligned on the program mission and strategic focus.',
            },
            {
              title: 'Clear Contact Paths',
              description: 'Reach the right stakeholders quickly through a dedicated contact hub.',
            },
          ],
        },
        {
          id: 'next',
          title: 'Next Steps',
          bullets: [
            'Review the functions list and flag updates for the next sprint.',
            'Align the About page with the current quarterly strategy.',
            'Share the contact pathways with partner teams.',
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
