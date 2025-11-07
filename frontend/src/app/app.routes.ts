import { Routes } from '@angular/router';
import { defaultLayout } from './layouts/default/default';
import { DashboardComponent } from './layouts/dashboard/dashboard.component';


export const routes: Routes = [
    { 
        path : '',
        component : defaultLayout,
        loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule),
        title : 'Trang Chủ'
    },
    {
        path : 'dashboard',
        component : DashboardComponent,
        loadChildren: () => import('./modules/dashboard/dashboard.routes').then(m => m.DashboardRoutes),
        title : 'Dashboard'
    }
];