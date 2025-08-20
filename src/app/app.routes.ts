import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { permissionGuard } from './guards/permission-guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        loadComponent: () => import('./features/home/home').then(m => m.Home)
    },
    {
        path: 'login',
        loadComponent: () => import('./features/login/login').then(m => m.Login)
    },
    {
        path: 'signup',
        loadComponent: () => import('./features/signup/signup').then(m => m.Signup)
    },
    {
        path:'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard').then(m => m.Dashboard),
        canActivate: [authGuard]
    },
    {
        path: 'admin-panel',
        loadComponent: () => import('./features/admin-panel/admin-panel').then(m => m.AdminPanel),
        canActivate: [permissionGuard],
        data: { permissions: ['admin'] }
    },
    {
        path: 'forbidden',
        loadComponent: () => import('./features/forbidden/forbidden').then(m => m.Forbidden)
    }
    
];
