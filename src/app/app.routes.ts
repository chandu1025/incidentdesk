import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./features/login/login.component').then((m) => m.LoginComponent), title: 'Sign in' },
  { path: 'status', loadComponent: () => import('./features/status-page/status-page.component').then((m) => m.StatusPageComponent), title: 'System status' },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./features/shell/shell.component').then((m) => m.ShellComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent), title: 'Dashboard' },
      { path: 'incidents', loadComponent: () => import('./features/incidents/incidents.component').then((m) => m.IncidentsComponent), title: 'Incidents' },
      { path: 'incidents/:id', loadComponent: () => import('./features/incident-detail/incident-detail.component').then((m) => m.IncidentDetailComponent), title: 'Incident' },
      { path: 'settings', canActivate: [roleGuard], data: { roles: ['admin'] }, loadComponent: () => import('./features/settings/settings.component').then((m) => m.SettingsComponent), title: 'Settings' },
    ],
  },
  { path: '**', loadComponent: () => import('./features/not-found/not-found.component').then((m) => m.NotFoundComponent), title: 'Not found' },
];
