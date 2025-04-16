import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Documentation } from './app/pages/documentation/documentation';
import { Landing } from './app/pages/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';
import { AuthGuard } from './app/core/guards/auth.guard';

export const appRoutes: Routes = [
    { path: '', component: Landing },
    {
        path: '',
        component: AppLayout,
        children: [
            { path: 'dashboard', component: Dashboard, canActivate: [AuthGuard] },
            { path: 'uikit', canActivate: [AuthGuard], loadChildren: () => import('./app/pages/uikit/uikit.routes') },
            { path: 'documentation', component: Documentation, canActivate: [AuthGuard] },
            { path: 'pages', canActivate: [AuthGuard], loadChildren: () => import('./app/pages/pages.routes') }
        ]
    },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }
];
