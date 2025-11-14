import { Route } from "@angular/router";
import { CategoryComponent } from "./pages/list/category.component";

export const categoryRoutes: Route[] = [
    {
        path: '',
        component: CategoryComponent,
        title: 'Danh mục'
    }   
];