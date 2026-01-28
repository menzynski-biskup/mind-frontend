import { SiteContent } from './site-content.model';

export const SITE_CONTENT: SiteContent = {
  nav: [
    { label: 'Home', path: '/' },
    {
      label: 'Vision & Scope',
      path: '/vision',
      children: [
        { label: 'Scientific Scope', path: '/scientific' },
        { label: 'Clinical Scope', path: '/clinical' },
      ],
    },
    {
      label: 'Architecture',
      path: '/knowledge',
      children: [
        { label: 'Technology Stack', path: '/technology' },
        { label: 'Research Roadmap', path: '/roadmap' },
      ],
    },
    {
      label: 'Governance',
      path: '/ethics',
    },
    {
      label: 'Collaboration',
      path: '/collaboration',
      children: [
        { label: 'Publications / Preprints', path: '/publications', future: true },
        { label: 'Team', path: '/team', future: true },
      ],
    },
    { label: 'Contact', path: '/contact' },
  ],
  footer: {
    contact: {
      channels: [
        { label: 'Email', detail: 'info@mind-neuro.org', notes: 'Response within five working days.' },
      ],
      responseTime: 'Within five working days',
    },
    governance: {
      title: 'Governance',
      body: 'Oversight by the Mind Neuro Diagnostics Governance Board.',
      meta: 'Revision cycle: Quarterly',
    },
    repository: {
      label: 'Source Repository',
      url: 'https://github.com/menzynski-biskup/mind-frontend',
      license: 'Content license: CC BY 4.0',
    },
  },
  pages: {
    home: {
      hero: {
        title: 'Interdisciplinary Neuroscience and Clinical Research Initiative',
        description:
          'This hub documents the shared mission, architecture, and collaborative roadmap guiding integrative neurodiagnostics research.',
        meta: ['Last updated · 2025-12-02', 'Version · v2025.12 Draft'],
      },
      sections: [
        {
          id: 'overview',
          title: 'Purpose',
          body: 'The platform aligns neuroscience, neurodiagnostics, and clinical practice to accelerate translational insight. Content on this site prioritises clarity, traceability, and accessibility for clinicians, researchers, and academic partners.',
        },
        {
          id: 'highlights',
          title: 'Current Highlights',
          features: [
            {
              title: 'Scientific Scope Update',
              description:
                'Revised biomarker frameworks and multimodal integration strategies are pending review. Refer to Scientific Scope for structured documentation.',
            },
            {
              title: 'Clinical Alignment',
              description:
                'Clinical advisor interviews completed across neurology and psychiatry departments. Integration guidance will publish alongside clinician onboarding kits.',
            },
            {
              title: 'Governance Charter',
              description:
                'Ethics and oversight charter formalised with interdisciplinary representation. Supporting materials are maintained within Ethics & Governance.',
            },
          ],
        },
        {
          id: 'next',
          title: 'Upcoming Actions',
          bullets: [
            'Release beta documentation for knowledge architecture models and APIs.',
            'Complete WCAG AA audit of clinician-facing prototypes.',
            'Publish collaboration intake and open science contribution standards.',
          ],
        },
      ],
    },
    vision: {
      hero: {
        title: 'Vision and Mission',
        description:
          'The initiative advances integrative neurodiagnostics by uniting scientific rigor, clinical impact, and ethical stewardship.',
        meta: ['Review cadence · Annual strategy workshop'],
      },
      sections: [
        {
          id: 'mission',
          title: 'Mission Statement',
          body: 'Deliver an interoperable, clinically grounded research infrastructure that translates neuroscience discoveries into actionable diagnostics while protecting participant dignity.',
        },
        {
          id: 'guiding',
          title: 'Guiding Principles',
          bullets: [
            'Scientific fidelity through transparent methodologies and reproducible analyses.',
            'Clinical relevance prioritising patient safety, clinician usability, and regulatory alignment.',
            'Ethical governance with inclusive oversight and data minimisation practices.',
            'Open collaboration to accelerate findings across disciplines and institutions.',
          ],
        },
        {
          id: 'objectives',
          title: 'Strategic Objectives',
          table: {
            caption: 'Objectives and Success Measures',
            headers: ['Objective', '2025-2026 Outcome', 'Measurement'],
            rows: [
              [
                'Integrative Biomarkers',
                'Validated multimodal biomarkers ready for clinician pilot.',
                'Peer-reviewed validation study and pilot clinician adoption.',
              ],
              [
                'Clinical Readiness',
                'Standardised diagnostic workflows co-designed with clinicians.',
                'Completion of usability evaluations and governance approval.',
              ],
              [
                'Open Infrastructure',
                'Shared data schemas, API specifications, and documentation portal.',
                'External contributor onboarding within two weeks of request.',
              ],
            ],
          },
        },
        {
          id: 'alignment',
          title: 'Governance Alignment',
          body: 'Strategic objectives are ratified with the Governance Board and clinical partner institutions. Revisions require consensus across scientific, clinical, and ethics leads.',
        },
      ],
    },
    scientific: {
      hero: {
        title: 'Scientific Scope',
        description:
          'Foundational research domains, analytical methodologies, and priority questions guiding the programme.',
        meta: ['Review cadence · Bi-annual', 'Owner · Scientific Council'],
      },
      sections: [
        {
          id: 'domains',
          title: 'Domains of Inquiry',
          bullets: [
            'Neuroimaging biomarkers spanning structural, functional, and diffusion modalities.',
            'Electrophysiological signatures combining EEG, MEG, and invasive recordings.',
            'Computational phenotyping integrating behavioural, cognitive, and neuropsychological measures.',
            'Longitudinal progression modelling for neurodegenerative and psychiatric conditions.',
          ],
        },
        {
          id: 'methods',
          title: 'Methodologies',
          table: {
            caption: 'Core Analytic Approaches',
            headers: ['Method', 'Application', 'Validation Strategy'],
            rows: [
              [
                'Multimodal Fusion',
                'Align heterogeneous data types to derive composite biomarkers.',
                'Cross-modal concordance tests and clinician adjudication sessions.',
              ],
              [
                'Causal Inference',
                'Estimate intervention impacts using counterfactual frameworks.',
                'Simulation studies and retrospective cohort benchmarking.',
              ],
              [
                'Explainable ML',
                'Provide transparent decision-support outputs to clinicians.',
                'Model cards, decision pathway audits, and clinician usability reviews.',
              ],
            ],
          },
        },
        {
          id: 'questions',
          title: 'Key Research Questions',
          ordered: [
            'Which multimodal biomarkers most reliably predict early-stage cognitive decline?',
            'How do electrophysiological dynamics correlate with neuroimaging-derived network metrics?',
            'What explainability thresholds sustain clinician trust in AI-assisted diagnostics?',
            'Which longitudinal trajectories signal differential treatment response in complex neurodegenerative profiles?',
          ],
        },
      ],
    },
    clinical: {
      hero: {
        title: 'Clinical Scope',
        description:
          'Clinical workflows, integration priorities, and patient safeguards supporting responsible deployment.',
        meta: ['Review cadence · Quarterly', 'Owner · Clinical Advisory Group'],
      },
      sections: [
        {
          id: 'pathways',
          title: 'Diagnostic Pathways',
          ordered: [
            'Referral intake and eligibility screening with structured consent confirmation.',
            'Neurodiagnostic data acquisition following protocol-specific standard operating procedures.',
            'Integrated analysis review with interdisciplinary case conference.',
            'Clinical recommendation issuance, documentation, and follow-up schedule.',
          ],
        },
        {
          id: 'integration',
          title: 'Clinical Integration Focus',
          bullets: [
            'Embed decision-support summaries into electronic health record systems via standards-based APIs.',
            'Provide clinician training modules with accessibility features and evidence references.',
            'Maintain outcome tracking dashboards for longitudinal efficacy assessment.',
          ],
        },
        {
          id: 'safeguards',
          title: 'Patient Safeguards',
          callout:
            'All clinical deployments require dual approval from the Governance Board and institutional review boards, with continuous monitoring of consent status and data minimisation.',
          definitions: [
            { term: 'Consent Lifecycle', detail: 'Dynamic consent with participant portal planned for 2026 release.' },
            { term: 'Data Security', detail: 'Encryption in transit and at rest, access logging, and least privilege policies.' },
            { term: 'Clinical Escalation', detail: 'Rapid escalation pathway to specialty clinicians for adverse findings.' },
          ],
        },
      ],
    },
    knowledge: {
      hero: {
        title: 'Knowledge Architecture',
        description:
          'Schema design, ontologies, and knowledge flows supporting reproducible research and clinical translation.',
        meta: ['Status · Draft'],
      },
      sections: [
        {
          id: 'foundations',
          title: 'Architecture Foundations',
          bullets: [
            'Core ontology mapping neurodiagnostic concepts to interoperable schemas.',
            'Versioned knowledge graph supporting provenance and traceability.',
            'APIs enabling read/write access with auditable change history.',
          ],
        },
        {
          id: 'data-governance',
          title: 'Data Governance',
          bullets: [
            'Data minimisation and purpose limitation baked into schema design.',
            'Role-based permissions aligned to governance policies and study protocols.',
            'Validation pipelines ensuring data quality prior to downstream analytics.',
          ],
        },
      ],
    },
    technology: {
      hero: {
        title: 'Technology Stack',
        description:
          'Platform infrastructure, data services, and interface layers supporting a static-first, API-ready architecture.',
        meta: ['Owner · Platform Engineering', 'Status · Draft'],
      },
      sections: [
        {
          id: 'infrastructure',
          title: 'Platform Infrastructure',
          bullets: [
            'Static hosting via GitHub Pages or Cloudflare Pages with immutable asset pipelines.',
            'Infrastructure as code templates prepared for cloud deployment, emphasising reproducibility.',
            'Automated security baselines including HTTP security headers and continuous dependency audits.',
          ],
        },
        {
          id: 'data-services',
          title: 'Data Services',
          table: {
            caption: 'Service Layer Overview',
            headers: ['Service', 'Purpose', 'Status'],
            rows: [
              [
                'Metadata Registry',
                'Stores dataset descriptors and access governance metadata.',
                'Design in progress',
              ],
              [
                'API Gateway',
                'Provides authenticated access to research datasets and analytics.',
                'Planned for 2026 pilot',
              ],
              [
                'Audit Trail Service',
                'Maintains tamper-evident logs of data access and clinical usage.',
                'Prototype Q4 2025',
              ],
            ],
          },
        },
        {
          id: 'interface',
          title: 'Interface Layer',
          body: 'Responsive web interface prioritising accessibility, clinician readability, and modular dashboards. Future enhancements include authenticated portals for data entry and review.',
        },
        {
          id: 'security',
          title: 'Security and Compliance',
          bullets: [
            'Threat modelling and secure design reviews embedded in milestone gates.',
            'Role-based access controls mapped to governance policies.',
            'Continuous monitoring and incident response playbooks aligned with partner institutions.',
          ],
        },
      ],
    },
    collaboration: {
      hero: {
        title: 'Collaboration & Open Science',
        description:
          'Partnership models, contribution standards, and open science commitments guiding collaboration.',
        meta: ['Owner · Partnerships Office'],
      },
      sections: [
        {
          id: 'intake',
          title: 'Collaboration Intake',
          ordered: [
            'Submit a summary of research scope, proposed datasets, and institutional affiliations.',
            'Expect acknowledgement within two working days with next-step guidance.',
            'Formal review occurs within four weeks through the Partnerships Office.',
          ],
        },
        {
          id: 'open-science',
          title: 'Open Science Practices',
          bullets: [
            'Pre-registration of protocols and analysis plans where applicable.',
            'Data sharing under controlled access agreements with clear governance.',
            'Publication of reusable code and documentation following reproducibility standards.',
          ],
        },
      ],
    },
    roadmap: {
      hero: {
        title: 'Research Roadmap',
        description:
          'Sequenced milestones and decision gates guiding platform delivery and clinical translation.',
        meta: ['Status · Draft', 'Review cadence · Quarterly'],
      },
      sections: [
        {
          id: 'phases',
          title: 'Phased Delivery',
          ordered: [
            '2025 Q1–Q2: Finalise knowledge architecture, governance policies, and data standards.',
            '2025 Q3–Q4: Pilot multimodal analytics workflows with partner sites.',
            '2026 Q1–Q2: Launch clinician-facing dashboards and audit-ready reporting.',
          ],
        },
        {
          id: 'dependencies',
          title: 'Critical Dependencies',
          bullets: [
            'Ethics board approval for cross-site data sharing agreements.',
            'Clinical partner validation of diagnostic workflow prototypes.',
            'Security review completion for API and data access layers.',
          ],
        },
      ],
    },
    publications: {
      hero: {
        title: 'Publications / Preprints',
        description: 'Planned catalogue of outputs, preprints, and peer-reviewed publications.',
        meta: ['Status · Planned'],
      },
      sections: [
        {
          id: 'pipeline',
          title: 'Release Pipeline',
          body: 'Forthcoming list of manuscripts, preprints, and conference submissions will appear here.',
        },
      ],
    },
    team: {
      hero: {
        title: 'Team',
        description: 'Interdisciplinary team directory and governance roles (planned).',
        meta: ['Status · Planned'],
      },
      sections: [
        {
          id: 'overview',
          title: 'Overview',
          body: 'Team profiles, governance roles, and advisory networks will be published in upcoming releases.',
        },
      ],
    },
    contact: {
      hero: {
        title: 'Contact',
        description:
          'Formal communication channels for general inquiries, collaboration proposals, and media enquiries.',
        meta: ['Response time · Within five working days', 'Escalation · Program Management Office'],
      },
      sections: [
        {
          id: 'general',
          title: 'General Inquiries',
          body: 'Email: info@mind-neuro.org. Use encrypted channels for sensitive data. Do not include personal health information in initial correspondence.',
        },
        {
          id: 'collaboration',
          title: 'Collaboration Requests',
          ordered: [
            'Submit a summary of research scope, proposed datasets, and institutional affiliations.',
            'Expect acknowledgement within two working days with next-step guidance.',
            'Formal review occurs within four weeks through the Partnerships Office.',
          ],
        },
        {
          id: 'media',
          title: 'Media and Press',
          body: 'For press requests, contact press@mind-neuro.org with deadlines and interview topics.',
        },
        {
          id: 'future',
          title: 'Future Enhancements',
          bullets: [
            'Secure intake forms with authenticated access for collaborators.',
            'Automated ticketing workflow for request tracking and response analytics.',
            'Status dashboard displaying current response times and service levels.',
          ],
        },
      ],
    },
    ethics: {
      hero: {
        title: 'Ethics and Governance',
        description:
          'Oversight structures, ethical frameworks, and compliance alignment sustaining responsible research and clinical practice.',
        meta: ['Owner · Ethics & Oversight Committee', 'Review cadence · Quarterly'],
      },
      sections: [
        {
          id: 'framework',
          title: 'Ethical Framework',
          body: 'The framework aligns with Belmont Report principles, GDPR requirements, and institutional review board guidance to prioritise autonomy, beneficence, and justice.',
          bullets: [
            'Transparent communication of research purpose and data usage.',
            'Continuous risk assessment for algorithmic bias and unintended harm.',
            'Participant empowerment via consent renewal pathways.',
          ],
        },
        {
          id: 'governance-model',
          title: 'Governance Model',
          definitions: [
            {
              term: 'Governance Board',
              detail:
                'Interdisciplinary leadership with rotating chairs from scientific, clinical, and ethics domains.',
            },
            {
              term: 'Advisory Panels',
              detail: 'External advisors from partner institutions provide quarterly input and audit findings.',
            },
            {
              term: 'Decision Logs',
              detail: 'Documented in version-controlled repository with issue tracking for transparency.',
            },
          ],
        },
        {
          id: 'compliance',
          title: 'Compliance Matrix',
          table: {
            caption: 'Regulatory Alignment Snapshot',
            headers: ['Requirement', 'Scope', 'Status'],
            rows: [
              ['GDPR', 'Participant data protection and consent management.', 'In compliance · Annual audit'],
              ['HIPAA', 'Clinical partner data exchanges.', 'Controls defined · Implementation underway'],
              ['ISO 27001', 'Information security management system foundation.', 'Gap analysis complete · Roadmap in progress'],
            ],
          },
        },
      ],
    },
  },
} as const;
