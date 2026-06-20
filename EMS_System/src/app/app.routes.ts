import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'employees',
    canActivate: [authGuard],
    loadComponent: () => import('./features/employees/employee-list.component').then(m => m.EmployeeListComponent)
  },
  {
    path: 'employees/new',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./features/employees/employee-form.component').then(m => m.EmployeeFormComponent)
  },
  {
    path: 'employees/:id',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./features/employees/employee-form.component').then(m => m.EmployeeFormComponent)
  },
  { path: '**', redirectTo: 'dashboard' }
];
