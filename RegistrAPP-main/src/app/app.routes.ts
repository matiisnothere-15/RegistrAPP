import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./tabs/tabs.router').then((m) => m.routes),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'restablecer-contrasena',
    loadComponent: () => import('./restablecer-contrasena/restablecer-contrasena.page').then( m => m.RestablecerContrasenaPage)
  },
];
