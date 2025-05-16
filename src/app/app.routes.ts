import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth/auth.guard';

export const routes: Routes = [
    { 
        path: '', loadComponent: () => import('./features/components/home/home.component')
    },
    { 
        path: 'sign-in', loadComponent: () => import('./core/components/sign-in/sign-in.component'),
        canActivate: [authGuard], data: { requiresAuth: false }
    },
    { 
        path: 'sign-up', loadComponent: () => import('./core/components/sign-up/sign-up.component'),
        canActivate: [authGuard], data: { requiresAuth: false }
    },
    /* { 
        path: 'recovery-password', loadComponent: () => import('./core/components/recovery-password/recovery-password.component'),
        canActivate: [authGuard], data: { requiresAuth: false }
    }, */
    /* { 
        path: 'activate', loadComponent: () => import('./core/components/activate-account/activate-account.component'),
        canActivate: [authGuard], data: { requiresAuth: false }
    }, */
    /* {
        path: 'account', loadChildren: () => import('./account/account.routes'),
        canActivate: [authGuard], data: { requiresAuth: true, breadcrumb: 'Cuenta' }
    }, */
    {
        path: 'faq', loadComponent: () => import('./features/components/faq/faq.component'),
    },
    { 
        path: 'privacy-policy', loadComponent: () => import('./features/components/privacy-policy/privacy-policy.component'),
    },
    { 
        path: 'terms-and-conditions', loadComponent: () => import('./features/components/terms-and-conditions/terms-and-conditions.component')
    },
    {
        path: 'contact', loadComponent: () => import('./features/components/contact/contact.component')
    },
    /* {
        path: 'no-connection', loadComponent: () => import('./shared/components/no-connection/no-connection.component')
    }, */
    { 
        path: '**', redirectTo: '', pathMatch: 'full' 
    },
];
