import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

type SectionId =
  | 'projects'
  | 'studies'
  | 'participants'
  | 'visits'
  | 'toolbox'
  | 'teams'
  | 'documents'
  | 'exports'
  | 'help';

interface SectionCard {
  title: string;
  description: string;
  meta: string;
}

interface SectionAction {
  label: string;
  description: string;
  path?: string;
}

interface SectionContent {
  title: string;
  description: string;
  tags: string[];
  cards: SectionCard[];
  actions: SectionAction[];
  wireframe: string[];
}

const SECTION_CONTENT: Record<SectionId, SectionContent> = {
  projects: {
    title: 'Projects portfolio',
    description:
      'Group funded initiatives, map governance milestones, and align studies to a shared research roadmap.',
    tags: ['Strategy', 'Portfolio', 'Funding'],
    cards: [
      {
        title: 'Portfolio view',
        description: 'Track project status, budgets, and linked studies in one workspace.',
        meta: '4 active initiatives',
      },
      {
        title: 'Governance timeline',
        description: 'Monitor IRB renewals, funding checkpoints, and reporting cadences.',
        meta: 'Next review: Mar 12',
      },
      {
        title: 'Data readiness',
        description: 'Verify data collection and export readiness across projects.',
        meta: '2 exports queued',
      },
    ],
    actions: [
      { label: 'Create project', description: 'Define sponsor and objectives' },
      { label: 'Review pipeline', description: 'Audit milestones' },
    ],
    wireframe: [
      'Header with project filters, funding status chips, and “New project” CTA.',
      'Portfolio table listing project, sponsor, lead, timeline, and study count.',
      'Right rail with upcoming governance actions and export readiness.',
    ],
  },
  studies: {
    title: 'Studies & protocols',
    description:
      'Capture structured study protocols, consent requirements, and visit templates in a repeatable format.',
    tags: ['Protocol', 'IRB', 'Templates'],
    cards: [
      {
        title: 'Structured proposal',
        description: 'Problem statement, hypotheses, outcomes, and safety plan in one record.',
        meta: '9 active studies',
      },
      {
        title: 'Visit templates',
        description: 'Intake, Session 1, Session 2 templates with reusable scripts.',
        meta: '5 templates',
      },
      {
        title: 'Instrumentation',
        description: 'Attach questionnaires, tasks, and scoring rules to each visit.',
        meta: 'AVLT + 3 surveys',
      },
    ],
    actions: [
      { label: 'New study', description: 'Draft protocol + milestones' },
      { label: 'Manage templates', description: 'Edit visit steps' },
      { label: 'Intake builder', description: 'Define form fields + logic', path: '/app/studies/intake-builder' },
      {
        label: 'Compute builder',
        description: 'Add derived variable definitions',
        path: '/app/studies/compute-builder',
      },
      { label: 'Rules builder', description: 'Eligibility + scheduling rules', path: '/app/studies/rules-builder' },
      { label: 'Result viewer', description: 'Review intake evaluation output', path: '/app/studies/intake-results' },
    ],
    wireframe: [
      'Protocol summary with collapsible sections for aims, methods, and data safety.',
      'Template list with drag-and-drop script step builder.',
      'Sidebar with consent assets, inclusion criteria, and eligibility rules.',
    ],
  },
  participants: {
    title: 'Participant registry',
    description:
      'Enroll participants, capture intake data, and monitor eligibility across scheduled visits.',
    tags: ['Cohort', 'Eligibility', 'Scheduling'],
    cards: [
      {
        title: 'Roster management',
        description: 'Searchable participant roster with status and next visit.',
        meta: '84 enrolled',
      },
      {
        title: 'Eligibility signals',
        description: 'Auto-check inclusion criteria from intake questionnaires.',
        meta: '12 pending review',
      },
      {
        title: 'Upcoming visits',
        description: 'Intake sessions and follow-ups queued by coordinator.',
        meta: '6 in next 2 weeks',
      },
    ],
    actions: [
      { label: 'Add participant', description: 'Capture demographics + consent' },
      { label: 'Schedule intake', description: 'Assign coordinator' },
    ],
    wireframe: [
      'Roster table with participant ID, eligibility badge, and next visit.',
      'Intake drawer for demographic capture and questionnaire score summary.',
      'Calendar panel for scheduling intake and next sessions.',
    ],
  },
  visits: {
    title: 'Visit orchestration',
    description:
      'Plan sessions, track completion status, and launch the visit runner for live data capture.',
    tags: ['Scheduling', 'Runner', 'Compliance'],
    cards: [
      {
        title: 'Visit calendar',
        description: 'Session status across intake and follow-up templates.',
        meta: '18 visits scheduled',
      },
      {
        title: 'Template coverage',
        description: 'Track which visits have required script steps configured.',
        meta: '100% steps configured',
      },
      {
        title: 'Completion logs',
        description: 'Audit completion time, signatures, and task results.',
        meta: 'Last visit: 2h ago',
      },
    ],
    actions: [
      { label: 'Launch visit runner', description: 'Start intake flow', path: '/app/visits/runner' },
      { label: 'Review compliance', description: 'Download completion logs' },
    ],
    wireframe: [
      'Calendar and list view toggle for scheduled visits.',
      'Visit details panel with script steps, consent status, and result summary.',
      'Launch runner CTA with progress and required-step validation.',
    ],
  },
  toolbox: {
    title: 'Research toolbox',
    description:
      'Catalog instruments, tasks, questionnaires, and scoring rules for reuse across studies.',
    tags: ['Tasks', 'Questionnaires', 'Scoring'],
    cards: [
      {
        title: 'Task library',
        description: 'AVLT task placeholder with configurable stimuli and scoring.',
        meta: '1 cognitive task',
      },
      {
        title: 'Questionnaire bank',
        description: 'Reusable surveys with auto-scoring and eligibility rules.',
        meta: '3 intake forms',
      },
      {
        title: 'Scoring rules',
        description: 'Define thresholds to auto-check eligibility and next-step scheduling.',
        meta: '2 eligibility rules',
      },
    ],
    actions: [
      { label: 'Add task', description: 'Upload stimuli + instructions' },
      { label: 'Build questionnaire', description: 'Define questions' },
    ],
    wireframe: [
      'Library grid with task cards and scoring metadata.',
      'Questionnaire builder with section navigation and branching logic.',
      'Rules console listing thresholds and auto-check triggers.',
    ],
  },
  teams: {
    title: 'Research teams',
    description:
      'Assign coordinators, manage access roles, and coordinate training for study delivery.',
    tags: ['Roles', 'Assignments', 'Training'],
    cards: [
      {
        title: 'Role matrix',
        description: 'PI, coordinator, analyst, and data manager permissions.',
        meta: '7 team members',
      },
      {
        title: 'Assignment board',
        description: 'Link staff to projects, studies, and visits.',
        meta: '4 coordinators active',
      },
      {
        title: 'Training status',
        description: 'Track SOP completion and compliance certifications.',
        meta: '2 certifications due',
      },
    ],
    actions: [
      { label: 'Invite member', description: 'Add collaborator' },
      { label: 'Assign visits', description: 'Map coordinator coverage' },
    ],
    wireframe: [
      'Team roster with role chips and last activity.',
      'Assignment board showing coverage by study and visit type.',
      'Training checklist with SOP links and due dates.',
    ],
  },
  documents: {
    title: 'Documents hub',
    description:
      'Centralize protocols, consent forms, recruitment materials, and signed artifacts.',
    tags: ['IRB', 'Consent', 'Assets'],
    cards: [
      {
        title: 'Protocol archive',
        description: 'Versioned protocol and amendment storage.',
        meta: '18 files',
      },
      {
        title: 'Consent library',
        description: 'IRB-approved consent templates with signature capture.',
        meta: '5 templates',
      },
      {
        title: 'Recruitment assets',
        description: 'Email copy, flyers, and scripts for outreach.',
        meta: '12 assets',
      },
    ],
    actions: [
      { label: 'Upload document', description: 'Store signed PDF' },
      { label: 'Manage versions', description: 'Track amendments' },
    ],
    wireframe: [
      'Document list with category filters and version tags.',
      'Consent template preview with signature placeholder.',
      'Audit trail for uploads and approvals.',
    ],
  },
  exports: {
    title: 'Exports & datasets',
    description:
      'Package datasets, review audit logs, and stage exports for analysis pipelines.',
    tags: ['Data', 'Audit', 'Analytics'],
    cards: [
      {
        title: 'Export queue',
        description: 'Scheduled exports for analysts and sponsors.',
        meta: '2 pending',
      },
      {
        title: 'Audit trail',
        description: 'Track exports by study, user, and timestamp.',
        meta: 'Last export yesterday',
      },
      {
        title: 'Dataset health',
        description: 'Verify missing fields and completion coverage.',
        meta: '98% complete',
      },
    ],
    actions: [
      { label: 'Generate export', description: 'Select study + date range' },
      { label: 'Review logs', description: 'Confirm compliance' },
    ],
    wireframe: [
      'Export builder with dataset checklists and filter chips.',
      'Audit log table with download and approval status.',
      'Quality dashboard summarizing missing data.',
    ],
  },
  help: {
    title: 'Help & enablement',
    description:
      'Guide researchers through onboarding, SOPs, and live support for study operations.',
    tags: ['Onboarding', 'SOP', 'Support'],
    cards: [
      {
        title: 'Quickstart',
        description: 'Step-by-step onboarding for projects, studies, and visits.',
        meta: '5 guided tours',
      },
      {
        title: 'SOP library',
        description: 'Standard operating procedures with training checkpoints.',
        meta: '12 SOPs',
      },
      {
        title: 'Support tickets',
        description: 'Escalate issues and track responses from the platform team.',
        meta: '1 open request',
      },
    ],
    actions: [
      { label: 'Launch walkthrough', description: 'Visit runner training' },
      { label: 'Contact support', description: 'Open a ticket' },
    ],
    wireframe: [
      'Support hub with searchable FAQs and SOP links.',
      'Onboarding checklist with progress tracking.',
      'Ticket panel with status and assigned responder.',
    ],
  },
};

@Component({
  selector: 'app-researcher-section',
  imports: [CommonModule, RouterLink],
  templateUrl: './researcher-section.html',
  styleUrl: './researcher-section.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResearcherSectionComponent {
  private readonly route = inject(ActivatedRoute);
  protected readonly sectionId = this.route.snapshot.data['sectionId'] as SectionId | undefined;
  protected readonly content = this.resolveContent(this.sectionId);

  private resolveContent(sectionId: SectionId | undefined): SectionContent {
    if (!sectionId || !SECTION_CONTENT[sectionId]) {
      const validSections = Object.keys(SECTION_CONTENT).join(', ');
      console.error(
        `Unknown sectionId parameter "${sectionId ?? 'undefined'}". Expected one of: ${validSections}. ` +
          'Defaulting to projects.'
      );
      return SECTION_CONTENT.projects;
    }
    return SECTION_CONTENT[sectionId];
  }
}
