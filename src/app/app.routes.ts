import { Routes } from '@angular/router';
import { roleGuard } from './core/guards/role-guard';
import { noAuthGuard } from './core/guards/no-auth-guard';

export const RoutePath = {
    Home : "home",
    Login:"login",
    Signup:"signup",
    Dashboard:"dashboard",
    AdminDashboard:"admin-dashbaord",
    BusinessDashboard:"business-dashboard",
    NotFound:"not-found"
} as const;

export const routes: Routes = [
    {
        path: '',
        redirectTo: RoutePath.Home,
        pathMatch: 'full'
    },
    {
        path: RoutePath.Home,
        loadComponent: () => import('./features/home/home').then(m => m.Home)
    },
    {
        path: RoutePath.Login,
        loadComponent: () => import('./features/login/login').then(m => m.Login),
        canActivate:[noAuthGuard]
    },
    {
        path: RoutePath.Signup,
        loadComponent: () => import('./features/signup/signup').then(m => m.Signup),
        canActivate:[noAuthGuard]
    },
    {
        path: RoutePath.Dashboard,
        loadComponent: () => import('./features/dashboard/dashboard').then(m => m.Dashboard),
        canActivate: [roleGuard([ 'User'])]
    },
    {
        path: RoutePath.AdminDashboard,
        loadComponent: () => import('./features/admin-dashboard/admin-dashboard').then(m => m.AdminDashboard),
        canActivate: [roleGuard(['admin'])]
    },
    {
        path: RoutePath.BusinessDashboard,
        loadComponent: () => import('./features/business-dashboard/business-dashboard').then(m => m.BusinessDashboard),
        canActivate: [roleGuard(['businessadmin'])]
    },
    {
        path: RoutePath.NotFound,
        loadComponent: () => import('./features/not-found/not-found').then(m => m.NotFound)
    },
    {
        path: '**',
        redirectTo: RoutePath.NotFound
    }
    
];


