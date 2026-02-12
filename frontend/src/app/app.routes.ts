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
