import { SiteContent } from './site-content.model';

export const SITE_CONTENT: SiteContent = {
  nav: [
    { label: 'Home', path: '/' },
    { label: 'About MIND', path: '/about' },
    { label: 'Research', path: '/research' },
    { label: 'Clinical Applications', path: '/clinical-applications' },
    { label: 'Dementia AI Assistant', path: '/dementia-ai-assistant' },
    { label: 'Ethics & Safety', path: '/ethics-safety' },
    { label: 'Research/Updates', path: '/research-updates' },
    { label: 'Contact', path: '/contact' },
  ],
  footer: {
    projectName: 'MIND',
    mission:
      'A proposed research initiative exploring mechanism-informed, technology-enabled decision support for mental health and neurocognitive disorders.',
  },
  pages: {
    home: {
      hero: {
        title: 'A Concept for Modern Integrated Neurocognitive Diagnostics',
        description:
          'MIND is a proposed research and development initiative exploring mechanism-informed, technology-enabled decision support for mental health and neurocognitive disorders.',
        actions: [
          {
            label: 'Learn about the concept',
            path: '/about',
            variant: 'primary',
          },
          {
            label: 'Explore planned research',
            path: '/research',
            variant: 'secondary',
          },
          {
            label: 'Express interest in collaborating',
            path: '/contact',
            variant: 'secondary',
          },
        ],
      },
      sections: [
        {
          id: 'why',
          title: 'Why a New Approach is Needed',
          paragraphs: [
            'Current assessment tools are valuable but have limitations. Legacy approaches may not fully capture the complexity of neurocognitive and mental health presentations.',
            'Diagnostic heterogeneity in psychiatry and the complexity of dementia differential diagnosis create challenges for clinical teams working within time constraints.',
            'This is the motivation for MIND—a concept for exploring mechanism-informed, technology-enabled approaches to support better clinical decision-making.',
          ],
        },
        {
          id: 'what',
          title: 'What MIND Aims to Explore',
          meta: ['Planned focus areas – not yet implemented'],
          features: [
            {
              title: 'Mechanism-informed cognitive profiles',
              description:
                'We aim to investigate how mechanism-based frameworks could enhance understanding of neurocognitive presentations.',
              tag: 'Planned',
            },
            {
              title: 'Digital / AI-based decision support',
              description:
                'We propose to explore AI tools that would remain under clinician control, supporting rather than replacing clinical judgment.',
              tag: 'Planned',
            },
            {
              title: 'Translational research pathways',
              description:
                'We intend to develop careful pathways from research concepts to potential clinical applications, with rigorous validation.',
              tag: 'Planned',
            },
          ],
        },
        {
          id: 'dementia-highlight',
          title: 'Concept Highlight: Dementia AI Assistant',
          paragraphs: [
            'One potential application is a clinician-facing tool to help structure dementia assessments and support differential diagnosis.',
            'Currently in conceptual and design phase; not available for clinical use.',
          ],
          bullets: [
            'Intended to support clinicians, not replace them',
            'Would structure information for MDT discussions',
            'Requires careful validation before any clinical use',
          ],
        },
        {
          id: 'ethics',
          title: 'Our Ethical Starting Point',
          body: 'Ethics, safety, and regulatory considerations are being integrated from the outset of this project concept.',
        },
        {
          id: 'updates',
          title: 'Stay Informed as MIND Develops',
          body: 'We are in the early stages of developing this concept. Sign up for updates on concept developments, funding calls, and future studies.',
        },
      ],
    },
    about: {
      hero: {
        title: 'About MIND',
        description: 'Understanding the concept behind MIND and why this approach is needed.',
      },
      sections: [
        {
          id: 'what',
          title: 'What is MIND? (Concept Overview)',
          paragraphs: [
            'MIND is currently a research and development concept, not a deployed clinical tool or product.',
            'We are proposing a multidisciplinary program to explore modern, mechanism-informed approaches to neurocognitive and mental health assessment.',
            'If funded and developed, MIND aims to create decision-support tools that assist clinicians while maintaining human oversight and clinical judgment.',
          ],
        },
        {
          id: 'why',
          title: 'Why MIND is Needed: Background',
          paragraphs: [
            'Legacy assessment tools have served clinicians well but have recognized limitations in capturing the full complexity of neurocognitive presentations.',
            'Diagnostic heterogeneity in psychiatry means that broad diagnostic categories may encompass very different underlying mechanisms and treatment responses.',
            'Dementia differential diagnosis is complex and time-demanding, with overlapping syndromes that can be challenging to distinguish in routine clinical practice.',
          ],
        },
        {
          id: 'approach',
          title: 'Proposed Approach',
          paragraphs: [
            'We propose to investigate mechanism-informed cognitive and neuropsychiatric frameworks that could better characterize presentations.',
            'Modern digital data collection and AI-based decision support are potential tools we aim to explore, pending rigorous research and validation.',
            'All development would proceed with careful attention to clinical utility, safety, and regulatory requirements.',
          ],
        },
        {
          id: 'components',
          title: 'Planned Components of the MIND Program',
          bullets: [
            'Research investigating limitations of current tools and potential enhancements',
            'Development of mechanism-informed assessment frameworks',
            'Conceptual design of the Dementia AI Assistant',
            'Ethics and safety considerations embedded from the design phase',
            'Future clinical pilot collaborations (conditional on ethics approval and funding)',
          ],
        },
        {
          id: 'team',
          title: 'Team Vision & Prospective Collaborations',
          paragraphs: [
            'MIND requires an interdisciplinary team bringing together expertise in clinical neuroscience, psychiatry, neuropsychology, AI/machine learning, and research ethics.',
            'We welcome expressions of interest from clinicians in memory clinics and mental health services, researchers in relevant fields, and institutional partners.',
          ],
        },
        {
          id: 'status',
          title: 'Current Status and Next Steps',
          paragraphs: [
            'MIND is at the concept and planning stage.',
            'Next steps include grant applications, feasibility study design, and ethics committee consultations.',
            'Progress updates will be shared via the Research/Updates page.',
          ],
        },
      ],
    },
    research: {
      hero: {
        title: 'Research',
        description: 'Planned research directions and questions we aim to explore.',
      },
      sections: [
        {
          id: 'vision',
          title: 'Research Vision (Planned)',
          paragraphs: [
            'MIND intends to investigate how to address limitations of legacy assessment tools while maintaining clinical pragmatism.',
            'We aim to explore how mechanism-informed frameworks might help characterize meaningful subgroups within broad diagnostic categories.',
            'A key focus is responsible use of AI to support clinical decision-making in dementia and psychiatric assessment.',
          ],
        },
        {
          id: 'questions',
          title: 'Key Research Questions (Concept-Level)',
          bullets: [
            'How can we design cognitive paradigms that are more mechanism-informed yet pragmatic for clinical settings?',
            'How might mechanism-informed cognitive and clinical data suggest meaningful subgroups within broad diagnoses?',
            'How could AI support dementia differential diagnosis in ways that are transparent and clinically useful?',
            'What validation frameworks are needed for AI-based clinical decision support tools?',
          ],
        },
        {
          id: 'themes',
          title: 'Planned Research Themes',
          bullets: [
            'Limitations of existing assessments and potential digital enhancements',
            'Diagnostic heterogeneity and mechanistic/subtyping frameworks',
            'Dementia differential diagnosis and structured support tools',
            'AI clinical decision support principles and evaluation frameworks',
            'Implementation science and human factors in clinical AI adoption',
          ],
        },
        {
          id: 'methods',
          title: 'Methodological Approach (Proposed)',
          paragraphs: [
            'Our planned methodology would include longitudinal cohorts with rich phenotyping, digital cognitive task development, and clinician-in-the-loop AI prototyping.',
            'Implementation and human factors research would be essential for understanding real-world utility.',
            'These are planned methods, contingent on funding and ethics approvals.',
          ],
        },
        {
          id: 'outputs',
          title: 'Planned Outputs',
          bullets: [
            'Concept papers and methods papers',
            'Feasibility studies',
            'Open-source protocols and tools (if/when developed)',
            'Longer-term: clinical trials of decision-support interventions',
          ],
        },
        {
          id: 'collaboration',
          title: 'Opportunities to Co-Develop the Research Program',
          paragraphs: [
            'We welcome academic groups interested in co-leading subprojects, clinics interested in planning future feasibility studies, and funders to support staged development.',
            'Contact us to explore research collaboration opportunities.',
          ],
        },
      ],
    },
    'clinical-applications': {
      hero: {
        title: 'Clinical Applications',
        description: 'Potential future clinical use cases if MIND is developed and validated.',
        meta: ['This page describes potential future clinical applications—not current tools'],
      },
      sections: [
        {
          id: 'what',
          title: 'For Clinicians: What MIND Could Support (in the Future)',
          paragraphs: [
            'This page describes potential future clinical applications of MIND research if the project is funded and successfully developed.',
            'Nothing described here is currently available or clinically validated.',
          ],
        },
        {
          id: 'needs',
          title: 'Clinical Needs We Aim to Address',
          bullets: [
            'Complex psychiatric presentations where mechanism-informed assessment may help guide treatment',
            'Early or subtle cognitive changes requiring careful characterization',
            'Difficult dementia differentials in real-world practice',
            'Time-efficient structured assessment for busy clinical services',
          ],
        },
        {
          id: 'scenarios',
          title: 'Prospective Use Cases (Hypothetical Scenarios)',
          paragraphs: [
            'Memory clinic scenario: A clinician uses structured digital data capture integrated with pattern-highlighting suggestions to support differential diagnosis discussions in multidisciplinary team meetings.',
            'Integrated mental health service: Cognitive profiles informed by mechanistic frameworks help guide treatment planning and monitor response over time.',
            'These are hypothetical illustrations of potential future tools, not descriptions of current capabilities.',
          ],
        },
        {
          id: 'pathway',
          title: 'From Concept to Clinic: Steps Required',
          bullets: [
            'Rigorous research and validation studies',
            'Regulatory and ethical approvals',
            'Co-design with clinical teams',
            'Pilot implementations with careful monitoring',
            'Iterative refinement based on real-world feedback',
          ],
          paragraphs: [
            'We understand the translational pipeline and are committed to following all required steps—no shortcuts.',
          ],
        },
        {
          id: 'engagement',
          title: 'How Clinicians Can Engage Now',
          paragraphs: [
            'Express interest in future pilot studies',
            'Co-develop research questions',
            'Provide input on clinical needs and workflows',
            'Join planning discussions for potential future implementations',
          ],
        },
      ],
    },
    'dementia-ai-assistant': {
      hero: {
        title: 'Dementia AI Assistant',
        description: 'A proposed clinician-facing tool for dementia assessment support.',
        meta: ['Currently in conceptual and design phase—not available for clinical use'],
      },
      sections: [
        {
          id: 'overview',
          title: 'Concept Overview',
          paragraphs: [
            'The Dementia AI Assistant is a concept under design, not an available clinical tool.',
            'Its intended role would be to support clinicians in structuring information and considering differential diagnoses in dementia assessment.',
            'Any implementation would require clinician oversight, rigorous validation, and regulatory approval.',
          ],
        },
        {
          id: 'challenge',
          title: 'Clinical Challenge We Aim to Address',
          bullets: [
            'Overlapping dementia syndromes with similar presentations',
            'Time constraints and fragmented information in clinical practice',
            'Need to structure information for multidisciplinary team discussions',
            'Supporting diagnostic reasoning without replacing clinical judgment',
          ],
        },
        {
          id: 'functionality',
          title: 'Envisioned Functionality (High-Level)',
          paragraphs: [
            'Hypothetical inputs might include cognitive test scores, functional assessments, medical history, and imaging summaries.',
            'Internal processing would involve pattern detection and mechanism- or domain-based reasoning.',
            'Outputs would be structured summaries and suggested areas for further exploration—not diagnoses.',
            'Any implementation would require careful validation and human oversight.',
          ],
        },
        {
          id: 'principles',
          title: 'Planned Development Principles',
          bullets: [
            'Co-design with dementia clinicians and neuropsychologists',
            'Transparent, clinician-readable outputs',
            'Bias and fairness assessment throughout development',
            'Strong data governance and privacy protection',
            'Continuous monitoring if ever deployed',
          ],
        },
        {
          id: 'status',
          title: 'Current Stage & Next Steps',
          paragraphs: [
            'Currently in conceptualization and early design phase.',
            'Next steps include user needs assessments, prototype design, seeking funding, and ethical approvals.',
            'Share your perspective or interest in co-designing this concept by contacting us.',
          ],
        },
      ],
    },
    'ethics-safety': {
      hero: {
        title: 'Ethics & Safety',
        description: 'Responsible AI and digital health principles guiding MIND from the start.',
      },
      sections: [
        {
          id: 'design',
          title: 'Ethical by Design from Day One',
          paragraphs: [
            'MIND is being designed around responsible AI and digital health principles, aligned with international guidance.',
            'Ethics and safety considerations are integral from the concept stage, not afterthoughts.',
          ],
        },
        {
          id: 'oversight',
          title: 'Clinical Oversight and Decision Support Framing',
          paragraphs: [
            'Any future tools developed by MIND will be decision support only, with clinicians retaining responsibility for all clinical decisions.',
            'MIND will not offer direct-to-consumer diagnostic services.',
            'Human oversight and clinical judgment remain central to all planned applications.',
          ],
        },
        {
          id: 'privacy',
          title: 'Data Protection and Privacy (Planned Practices)',
          bullets: [
            'Informed consent procedures',
            'Secure data storage and transmission',
            'Data minimization principles',
            'Pseudonymization and anonymization where appropriate',
            'Compliance with relevant data protection regulations',
          ],
        },
        {
          id: 'equity',
          title: 'Equity and Fairness (Planned)',
          paragraphs: [
            'We are committed to monitoring for bias and ensuring representativeness in any future datasets and models.',
            'Fairness assessment will be embedded throughout development and evaluation.',
          ],
        },
        {
          id: 'validation',
          title: 'Validation and Monitoring (Future Requirements)',
          bullets: [
            'Pre-clinical testing and validation before any clinical use',
            'Ongoing performance monitoring if tools reach deployment',
            'Regular audits and safety reviews',
            'Clear pathways for reporting concerns',
          ],
        },
        {
          id: 'transparency',
          title: 'Transparency and Accountability',
          paragraphs: [
            'We intend to publish methods and findings openly.',
            'Clear pathways for questions, concerns, and accountability will be established.',
          ],
        },
        {
          id: 'status',
          title: 'Current Status',
          paragraphs: [
            'MIND is at the concept and planning stage.',
            'These are commitments and design principles for future development, not descriptions of implemented systems.',
          ],
        },
      ],
    },
    'research-updates': {
      hero: {
        title: 'Research/Updates',
        description: 'Concept progress, planning updates, and future scientific outputs.',
      },
      sections: [
        {
          id: 'intro',
          title: 'What You Will Find Here',
          paragraphs: [
            'This page will host concept notes, grant submissions (where shareable), early methods papers, conference presentations, and over time, empirical results.',
            'As MIND develops, we will share progress on the concept, funding applications, and eventual research outputs.',
          ],
        },
        {
          id: 'concept',
          title: 'Concept and Planning Updates',
          paragraphs: [
            'Updates on concept development, revised architectures, stakeholder workshop summaries.',
            'Progress on funding applications and partnership discussions.',
            'Currently: MIND is in initial concept development phase.',
          ],
        },
        {
          id: 'scientific',
          title: 'Scientific Outputs (as They Emerge)',
          paragraphs: [
            'This section will be populated with peer-reviewed papers, preprints, technical reports, talks, and posters as they become available.',
            'Currently: No publications yet—this is a concept-stage project.',
          ],
        },
        {
          id: 'events',
          title: 'Events and Engagement',
          paragraphs: [
            'Announcements of talks, symposia, or webinars about MIND concept and emerging work.',
            'Opportunities to engage with the team and provide feedback.',
          ],
        },
        {
          id: 'updates',
          title: 'Stay Informed',
          paragraphs: [
            'Sign up for email updates on MIND concept development, funding news, and future research opportunities.',
            'Contact us about research collaboration or to provide feedback on the concept.',
          ],
        },
      ],
    },
    contact: {
      hero: {
        title: 'Contact',
        description: 'Get in touch about collaboration, research, or feedback on the MIND concept.',
      },
      sections: [
        {
          id: 'before',
          title: 'Before You Contact Us',
          paragraphs: [
            'MIND does not provide medical advice or individual diagnoses.',
            'For personal health concerns, please contact your healthcare provider.',
            'MIND is a research concept in development, not a clinical service.',
          ],
        },
        {
          id: 'who',
          title: 'Who Should Reach Out',
          bullets: [
            'Clinicians or services interested in co-developing research or future pilots',
            'Researchers seeking methodological collaboration or joint grants',
            'Funders or partners interested in strategic or philanthropic support',
            'Media, press, or others with general questions or feedback',
          ],
        },
        {
          id: 'general',
          title: 'General Inquiries',
          body: 'For general questions about the MIND concept, collaboration opportunities, or updates, please email: info@mind-neuro.org',
        },
        {
          id: 'collaboration',
          title: 'Research Collaboration',
          paragraphs: [
            'We welcome expressions of interest from researchers, clinicians, and institutions interested in contributing to MIND development.',
            'Please provide a brief overview of your background and areas of interest.',
          ],
        },
        {
          id: 'ethics',
          title: 'Ethics & Governance Contact',
          paragraphs: [
            'For questions about ethics, data governance, or safety considerations, please contact us with "Ethics Query" in the subject line.',
            'See our Ethics & Safety page for more information on our principles and commitments.',
          ],
        },
      ],
    },
  },
} as const;
