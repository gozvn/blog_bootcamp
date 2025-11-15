import { Route } from "@angular/router";
import { CategoryComponent } from "./pages/all/category.component";

export const categoryRoutes: Route[] = [
    {
        path: '',
        component: CategoryComponent,
        title: 'Danh mục'
    },
    {
        path: ':id/:slug',
        loadComponent: () => import('./pages/list/list.component').then(m => m.ListComponent),
        title: 'Danh mục'
    },
    {
        path: ':id/:slug/page/:page',
        loadComponent: () => import('./pages/list/list.component').then(m => m.ListComponent),
        title: 'Danh mục'
    }   
];