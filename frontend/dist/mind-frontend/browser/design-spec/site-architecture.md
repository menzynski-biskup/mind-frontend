# Mind Neuro Diagnostics Platform – Information Site Architecture

## 1. Site Map Tree
```
/
├── Home
├── Vision & Mission
├── Scientific Scope
│   ├── Domains of Inquiry
│   ├── Methodologies
│   └── Key Research Questions
├── Clinical Scope
│   ├── Diagnostic Pathways
│   ├── Clinical Integration
│   └── Patient Safeguards
├── Researcher Mode
│   ├── Research Pipeline Overview
│   ├── Study Creation & Management
│   ├── Intake Forms & Assessments
│   └── Data Organization & Export
├── Knowledge Architecture
│   ├── Data Taxonomy
│   ├── Ontologies & Standards
│   └── Documentation Index
├── Technology Stack
│   ├── Platform Infrastructure
│   ├── Data Services
│   └── Interface Layer
├── Ethics & Governance
│   ├── Ethical Framework
│   ├── Governance Model
│   └── Compliance Matrix
├── Research Roadmap
│   ├── Milestone Timeline
│   ├── Work Packages
│   └── Dependency Map
├── Collaboration & Open Science
│   ├── Partnership Models
│   ├── Data Sharing Policies
│   └── Contribution Guidelines
├── Publications / Preprints (Future)
│   ├── Published Papers
│   ├── Preprints
│   └── Citation Library
├── Team (Future)
│   ├── Scientific Leadership
│   ├── Clinical Advisors
│   └── Technical Contributors
└── Contact
    ├── General Inquiries
    ├── Collaboration Requests
    └── Press & Media (optional)
```

## 2. Page-by-Page Content Intent
- **Home**
  - **Role**: Orientation hub summarising initiative purpose, audience, and current focus.
  - **Content**: Concise overview, immediate access to latest updates, highlighted pathways into deeper sections.
  - **Evolution**: Embed live status widgets (e.g., roadmap milestones, data portal availability) once APIs exist.
- **Vision & Mission**
  - **Role**: Define strategic objectives and guiding principles.
  - **Content**: Mission statement, long-term vision, measurable objectives, governance alignment.
  - **Evolution**: Link to living strategy documents; enable version comparison and stakeholder endorsements.
- **Scientific Scope**
  - **Role**: Document research pillars, methodologies, and hypotheses.
  - **Content**: Structured prose, diagrams (static first), references, summary tables.
  - **Evolution**: Integrate data visualisations and publication cross-links via API once research outputs publish.
- **Clinical Scope**
  - **Role**: Clarify clinical integration pathways and guardrails.
  - **Content**: Care pathway diagrams, compliance requirements, clinician engagement processes.
  - **Evolution**: Host clinician portal entry points and training modules later.
- **Researcher Mode**
  - **Role**: Provide tools for researchers to build and manage research studies similar to clinical pipelines.
  - **Content**: Overview of research pipeline capabilities, study creation workflows, intake form design, test administration, participant management, and data organization.
  - **Evolution**: Integrate with data collection APIs, participant tracking systems, and analytics dashboards as development progresses.
- **Knowledge Architecture**
  - **Role**: Describe information architecture, taxonomies, and documentation.
  - **Content**: Data model summaries, ontology references, documentation index.
  - **Evolution**: Connect to knowledge graph browser and API specification repository.
- **Technology Stack**
  - **Role**: Present technical foundations and infrastructure roadmap.
  - **Content**: Platform layers, integration patterns, security posture, technology decisions log.
  - **Evolution**: Surface live system status, API explorer, and deployment changelog via automation.
- **Ethics & Governance**
  - **Role**: Communicate ethical standards, governance structures, compliance adherence.
  - **Content**: Ethics framework, governance board composition, regulatory alignment matrix.
  - **Evolution**: Link to audit reports, consent frameworks, decision logs as systems go live.
- **Research Roadmap**
  - **Role**: Outline phased development and research milestones.
  - **Content**: Timeline, milestone descriptions, dependencies, risk register excerpts.
  - **Evolution**: Integrate with project management feeds for live progress and milestone completion data.
- **Collaboration & Open Science**
  - **Role**: Provide pathways for academic, clinical, and technical partners.
  - **Content**: Collaboration models, open data policies, contribution guidelines, onboarding steps.
  - **Evolution**: Automate submission portals, contributor dashboards, and dataset registries.
- **Publications / Preprints (Future)**
  - **Role**: Curate scientific outputs.
  - **Content**: Placeholder structure for bibliographic entries, citation formats, links to repositories.
  - **Evolution**: Dynamically populated lists via publication APIs; integrate ORCID, DOI feeds.
- **Team (Future)**
  - **Role**: Present leadership and contributors transparently.
  - **Content**: Structured bios, roles, affiliations, governance responsibilities.
  - **Evolution**: Sync with institutional directories and staff management systems.
- **Contact**
  - **Role**: Provide formal communication channels.
  - **Content**: Accessible contact forms (static email instructions initially), response protocols, escalation paths.
  - **Evolution**: Introduce secure request intake workflows and authenticated contact mechanisms.

## 3. Navigation Model
- **Primary Navigation**: Horizontal top-level menu featuring all current sections; future items flagged as "Coming Soon" until content matures.
- **Secondary Navigation**: Contextual sidebar/section menu on documentation-heavy pages (Scientific Scope, Knowledge Architecture, etc.) listing subsections within the page.
- **Breadcrumbs**: Present on every non-home page to indicate hierarchy (e.g., Home › Scientific Scope › Methodologies).
- **Footer Navigation**: Redundant access to key static pages (Home, Vision & Mission, Ethics & Governance, Contact) plus version identifier and repository link.
- **Skip Links**: Provide `Skip to main content`, `Skip to section navigation`, and `Skip to footer` anchors.
- **Responsive Behaviour**: Collapse primary navigation into accessible disclosure (`<button aria-expanded>`) with keyboard focus management at narrower viewports.

## 4. Layout System Description
- **Header**: Contains institutional logotype (text-based initially), primary navigation, site-wide search placeholder (static). Uses `<header>` landmark.
- **Navigation**: Wrapped in `<nav>` with list-based menus; support ARIA attributes for current page indication (`aria-current="page"`).
- **Main Area**: `<main>` containing page-specific content arranged via CSS grid or flex with generous whitespace and typographic hierarchy.
- **Aside**: `<aside>` for contextual sidenotes such as quick facts, key contacts, or navigation on dense pages. Hidden when irrelevant.
- **Footer**: `<footer>` with contact summary, governance attribution, last-updated stamp, repository link, and accessibility statement.
- **Grid Principles**: 12-column fluid grid with max width 1200px, typographic scale 1.2 modular ratio, body font 16–18px, line length 65–80 characters.

## 5. Component Strategy
- **Typography System**: Reusable utility classes for headings, lead paragraphs, data callouts; ensure consistent `rem`-based sizing.
- **Content Blocks**:
  - `section-intro`: Title + summary paragraph.
  - `data-table`: Semantic `<table>` with caption, summaries for research/clinical matrices.
  - `definition-list`: `<dl>` for terminology in Knowledge Architecture.
  - `milestone-card`: `<article>` block describing roadmap items with status tags.
  - `callout`: `<aside role="note">` for ethical considerations or alerts.
  - `contact-panel`: Structured contact channels with accessible icons (SVG inline with `aria-hidden="true"`).
- **Navigation Components**: Primary menu component, secondary sidebar nav, breadcrumb trail, skip link group.
- **Metadata Components**: Last updated badge, version tag referencing Git commit hash, document status label (Draft/Stable).
- **Future Components**: API status badge, dataset catalogue list, user authentication prompts (placeholder markup only until backend exists).

## 6. Content Governance & Versioning Model
- **Repository Structure**: Place all informational content in `/content/<section>/<slug>.md`. Use front matter for metadata (status, last-reviewed, owners).
- **Review Cadence**: Establish quarterly review schedule; assign clinical, scientific, and technical reviewers per section.
- **Version Control**: Use Git branches for content updates; enforce pull request review by subject-matter owner; tag releases (`vYYYY.MM`) aligned with roadmap milestones.
- **Changelog**: Maintain `content/CHANGELOG.md` tracking major updates; link latest change summary in footer.
- **Documentation Style Guide**: Reference editorial style sheet to maintain academic tone, consistent terminology, citation formats.

## 7. Static-First Deployment Model
- **Build Pipeline**: Use static site generator (e.g., Eleventy or Astro) later; initial phase serves plain HTML from `/public` via GitHub Pages/Cloudflare Pages.
- **Asset Strategy**: Store CSS in `/public/assets/css`, future JS in `/public/assets/js`. Minimise dependencies; prefer system fonts.
- **Environment Readiness**: Reserve `/api` path namespace for future reverse proxy or static JSON endpoints describing datasets and roadmap status.
- **Continuous Deployment**: Configure GitHub Actions to lint HTML (accessibility / broken links) and deploy on merge to `main`.
- **Content Delivery**: Leverage immutable file naming for assets, set appropriate cache headers via Pages configuration.
- **Security Baseline**: Enforce HTTPS, HSTS, and content security policy via Pages configuration; no client-side tracking by default.
