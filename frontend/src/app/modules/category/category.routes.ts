import { Route } from "@angular/router";
import { CategoryComponent } from "./pages/all/category.component";

export const categoryRoutes: Route[] = [
    {
        path: '',
        component: CategoryComponent,
        title: 'All Categories'
    },
    {
        path: ':id/:slug',
        loadComponent: () => import('./pages/list/list.component').then(m => m.ListComponent),
        title: 'Category'
    },
    {
        path: ':id/:slug/page/:page',
        loadComponent: () => import('./pages/list/list.component').then(m => m.ListComponent),
        title: 'Category - Paginated'
    }   
];