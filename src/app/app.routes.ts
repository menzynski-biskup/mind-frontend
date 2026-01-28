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
        path: 'functions',
        loadComponent: () =>
          import('./pages/site/functions-page/functions-page').then((m) => m.FunctionsPageComponent),
      },
      {
        path: 'about',
        loadComponent: () => import('./pages/site/about-page/about-page').then((m) => m.AboutPageComponent),
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
