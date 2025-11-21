import { Route } from "@angular/router";
import { MainComponent } from "./pages/main.component";
import { PostComponent } from "./pages/post/post.component";

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
    },
    {
        path: 'addpost',
        component: PostComponent,
        title: 'Add Post'
    },
    // {
    //     path: 'edit/:id',
    //     component: MainComponent,
    //     title: 'User Detail'
    // },

];