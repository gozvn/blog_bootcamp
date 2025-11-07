import { NotFoundComponent } from "./not-found/not-found.component";
import { Routes } from "@angular/router";
import { AccessDeniedComponent } from "./access-denied/access-denied.component";

export const ErrorsRoutes: Routes = [
    {
        path: '404',
        component: NotFoundComponent,
        title: '404 Not Found'
    },
    {
        path: '403',
        component: AccessDeniedComponent,
        title: '403 Access Denied'
    },
];