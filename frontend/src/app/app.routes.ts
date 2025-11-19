import { Routes } from '@angular/router';
import { defaultLayout } from './layouts/default/default';
import { DashboardComponent } from './layouts/dashboard/dashboard.component';
import { authGuard } from './guard/auth.guard';

export const routes: Routes = [
    { 
        path : '',
        component : defaultLayout,
        loadChildren: () => import('./modules/home/home.routes').then(m => m.HomeRoutes),
        title : 'Home Page'
    },
    {
        path : 'auth',
        component : defaultLayout,
        loadChildren: () => import('./modules/auth/auth.routes').then(m => m.AuthRoutes),
        title : 'Login'
    },
    {
        path : 'dashboard',
        component : DashboardComponent,
        canActivate: [authGuard],
        loadChildren: () => import('./modules/dashboard/dashboard.routes').then(m => m.DashboardRoutes),
        title : 'Dashboard'
    },
    {
        path : 'user',        
        canActivate: [authGuard],
        loadChildren: () => import('./modules/user/user.routes').then(m => m.UserRoutes),
        title : 'User Panel'
    },
    {
        path : 'post',
        loadChildren: () => import('./modules/post/post.routes').then(m => m.PostRoutes),
        title : 'Posts'
    },
    {
        path : 'category',
        loadChildren: () => import('./modules/category/category.routes').then(m => m.categoryRoutes),
        title : 'Categories'
    },
    {
        path: 'error',
        loadChildren: () => import('./modules/errors/errors.routes').then(m => m.ErrorsRoutes),
        title : 'Error'
    },
    {
        path: '**',
        redirectTo: 'error/404'
    }
];