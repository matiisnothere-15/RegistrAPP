import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'scanner',
        loadComponent: () =>
          import('../home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('../api-morty/api-morty.page').then((m) => m.ApiMortyPage),
      },
      {
        path: '',
        redirectTo: '/tabs/scanner',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/scanner',
    pathMatch: 'full',
  },
];