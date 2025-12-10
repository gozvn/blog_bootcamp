import { Routes } from "@angular/router";
import { DetailPostComponent } from "./detail/detail/detail.component";
import { ListPostComponent } from "./lists/lists.component";


export const PostRoutes: Routes = [
    {
        path: ':id/:slug',
        component: DetailPostComponent,
        title: 'Post Detail'
    },
    {
        path: 'all',
        component: ListPostComponent,
        title: 'All Posts'
    },
    {
        path: 'all/page/:page',
        component: ListPostComponent,
        title: 'All Posts'
    },
    {
        path: 'featured',
        component: ListPostComponent,
        title: 'Featured Posts'
    },
    {
        path: 'featured/page/:page',
        component: ListPostComponent,
        title: 'Featured Posts'
    }
]