import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/site-layout/site-layout').then((m) => m.SiteLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/site/home/home').then((m) => m.HomePageComponent),
      },
      {
        path: 'vision',
        loadComponent: () =>
          import('./pages/site/vision-mission/vision-mission').then(
            (m) => m.VisionMissionPageComponent
          ),
      },
      {
        path: 'scientific',
        loadComponent: () =>
          import('./pages/site/scientific-scope/scientific-scope').then(
            (m) => m.ScientificScopePageComponent
          ),
      },
      {
        path: 'clinical',
        loadComponent: () =>
          import('./pages/site/clinical-scope/clinical-scope').then(
            (m) => m.ClinicalScopePageComponent
          ),
      },
      {
        path: 'knowledge',
        loadComponent: () =>
          import('./pages/site/knowledge-architecture/knowledge-architecture').then(
            (m) => m.KnowledgeArchitecturePageComponent
          ),
      },
      {
        path: 'technology',
        loadComponent: () =>
          import('./pages/site/technology-stack/technology-stack').then(
            (m) => m.TechnologyStackPageComponent
          ),
      },
      {
        path: 'ethics',
        loadComponent: () =>
          import('./pages/site/ethics-governance/ethics-governance').then(
            (m) => m.EthicsGovernancePageComponent
          ),
      },
      {
        path: 'roadmap',
        loadComponent: () =>
          import('./pages/site/research-roadmap/research-roadmap').then(
            (m) => m.ResearchRoadmapPageComponent
          ),
      },
      {
        path: 'collaboration',
        loadComponent: () =>
          import('./pages/site/collaboration-open-science/collaboration-open-science').then(
            (m) => m.CollaborationOpenSciencePageComponent
          ),
      },
      {
        path: 'publications',
        loadComponent: () =>
          import('./pages/site/publications/publications').then(
            (m) => m.PublicationsPageComponent
          ),
      },
      {
        path: 'team',
        loadComponent: () => import('./pages/site/team/team').then((m) => m.TeamPageComponent),
      },
      {
        path: 'contact',
        loadComponent: () => import('./pages/site/contact/contact').then((m) => m.ContactPageComponent),
      },
    ],
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.LoginComponent),
  },
  {
    path: 'clinician',
    loadComponent: () =>
      import('./pages/clinician-dashboard/clinician-dashboard').then(
        (m) => m.ClinicianDashboardComponent
      ),
  },
  {
    path: 'researcher',
    loadComponent: () =>
      import('./pages/researcher-dashboard/researcher-dashboard').then(
        (m) => m.ResearcherDashboardComponent
      ),
  },
  { path: '**', redirectTo: '' },
];