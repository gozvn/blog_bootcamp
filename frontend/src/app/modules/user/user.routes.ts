import { Route } from "@angular/router";
import { MainComponent } from "./pages/main.component";

export const UserRoutes: Route[] = [
    {
        path: '',
        component: MainComponent,
        title: 'User Posts'
    },
    {
        path: 'page/:page',
        component: MainComponent,
        title: 'User Posts - Page'
    }
    // {
    //     path: 'add',
    //     component: MainComponent,
    //     title: 'Add Post'
    // },
    // {
    //     path: 'edit/:id',
    //     component: MainComponent,
    //     title: 'User Detail'
    // },

];