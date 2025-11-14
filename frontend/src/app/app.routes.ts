import { Routes } from '@angular/router';
import { defaultLayout } from './layouts/default/default';
import { DashboardComponent } from './layouts/dashboard/dashboard.component';

export const routes: Routes = [
    { 
        path : '',
        component : defaultLayout,
        loadChildren: () => import('./modules/home/home.routes').then(m => m.HomeRoutes),
        title : 'Trang Chủ'
    },
    {
        path : 'auth',
        component : defaultLayout,
        loadChildren: () => import('./modules/auth/auth.routes').then(m => m.AuthRoutes),
        title : 'Đăng nhập'
    },
    {
        path : 'dashboard',
        component : DashboardComponent,
        loadChildren: () => import('./modules/dashboard/dashboard.routes').then(m => m.DashboardRoutes),
        title : 'Dashboard'
    },
    {
        path : 'post',
        loadChildren: () => import('./modules/post/post.routes').then(m => m.PostRoutes),
        title : 'Bài viết'
    },
    {
        path : 'category',
        loadChildren: () => import('./modules/category/category.routes').then(m => m.categoryRoutes),
        title : 'Danh mục'
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