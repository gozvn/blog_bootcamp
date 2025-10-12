import { Routes } from '@angular/router';
import { defaultLayout } from './layouts/default/default';

export const routes: Routes = [
    { 
        path : '',
        component : defaultLayout,
        loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule),
        title : 'Trang Chủ'
    },
];