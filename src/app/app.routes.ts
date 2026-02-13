import { Routes } from '@angular/router';
import { authGuard } from './services/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register').then((m) => m.RegisterComponent),
  },
  {
    path: 'app',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layout/researcher-layout/researcher-layout').then((m) => m.ResearcherLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/researcher-dashboard/researcher-dashboard').then(
            (m) => m.ResearcherDashboardComponent
          ),
      },
      {
        path: 'projects',
        loadComponent: () =>
          import('./pages/researcher-section/researcher-section').then(
            (m) => m.ResearcherSectionComponent
          ),
        data: { sectionId: 'projects' },
      },
      {
        path: 'studies',
        loadComponent: () =>
          import('./pages/researcher-section/researcher-section').then(
            (m) => m.ResearcherSectionComponent
          ),
        data: { sectionId: 'studies' },
      },
      {
        path: 'studies/intake-builder',
        loadComponent: () =>
          import('./pages/study-intake-builder/study-intake-builder').then(
            (m) => m.StudyIntakeBuilderComponent
          ),
      },
      {
        path: 'studies/compute-builder',
        loadComponent: () =>
          import('./pages/study-compute-builder/study-compute-builder').then(
            (m) => m.StudyComputeBuilderComponent
          ),
      },
      {
        path: 'studies/rules-builder',
        loadComponent: () =>
          import('./pages/study-rules-builder/study-rules-builder').then(
            (m) => m.StudyRulesBuilderComponent
          ),
      },
      {
        path: 'studies/intake-results',
        loadComponent: () =>
          import('./pages/study-intake-results/study-intake-results').then(
            (m) => m.StudyIntakeResultsComponent
          ),
      },
      {
        path: 'participants',
        loadComponent: () =>
          import('./pages/researcher-section/researcher-section').then(
            (m) => m.ResearcherSectionComponent
          ),
        data: { sectionId: 'participants' },
      },
      {
        path: 'visits/runner',
        loadComponent: () =>
          import('./pages/visit-runner/visit-runner').then((m) => m.VisitRunnerComponent),
      },
      {
        path: 'visits',
        loadComponent: () =>
          import('./pages/researcher-section/researcher-section').then(
            (m) => m.ResearcherSectionComponent
          ),
        data: { sectionId: 'visits' },
      },
      {
        path: 'toolbox',
        loadComponent: () =>
          import('./pages/researcher-section/researcher-section').then(
            (m) => m.ResearcherSectionComponent
          ),
        data: { sectionId: 'toolbox' },
      },
      {
        path: 'teams',
        loadComponent: () =>
          import('./pages/researcher-section/researcher-section').then(
            (m) => m.ResearcherSectionComponent
          ),
        data: { sectionId: 'teams' },
      },
      {
        path: 'documents',
        loadComponent: () =>
          import('./pages/researcher-section/researcher-section').then(
            (m) => m.ResearcherSectionComponent
          ),
        data: { sectionId: 'documents' },
      },
      {
        path: 'exports',
        loadComponent: () =>
          import('./pages/researcher-section/researcher-section').then(
            (m) => m.ResearcherSectionComponent
          ),
        data: { sectionId: 'exports' },
      },
      {
        path: 'help',
        loadComponent: () =>
          import('./pages/researcher-section/researcher-section').then(
            (m) => m.ResearcherSectionComponent
          ),
        data: { sectionId: 'help' },
      },
    ],
  },
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
        path: 'about',
        loadComponent: () => import('./pages/site/about-page/about-page').then((m) => m.AboutPageComponent),
      },
      {
        path: 'research',
        loadComponent: () => import('./pages/site/research/research').then((m) => m.ResearchPageComponent),
      },
      {
        path: 'clinical-applications',
        loadComponent: () => import('./pages/site/clinical-applications/clinical-applications').then((m) => m.ClinicalApplicationsPageComponent),
      },
      {
        path: 'dementia-ai-assistant',
        loadComponent: () => import('./pages/site/dementia-ai-assistant/dementia-ai-assistant').then((m) => m.DementiaAiAssistantPageComponent),
      },
      {
        path: 'ethics-safety',
        loadComponent: () => import('./pages/site/ethics-safety/ethics-safety').then((m) => m.EthicsSafetyPageComponent),
      },
      {
        path: 'research-updates',
        loadComponent: () => import('./pages/site/research-updates/research-updates').then((m) => m.ResearchUpdatesPageComponent),
      },
      {
        path: 'contact',
        loadComponent: () => import('./pages/site/contact/contact').then((m) => m.ContactPageComponent),
      },
      {
        path: '**',
        loadComponent: () =>
          import('./pages/site/not-found-page/not-found-page').then((m) => m.NotFoundPageComponent),
      },
    ],
  },
];
