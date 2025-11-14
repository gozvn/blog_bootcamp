import { Routes } from "@angular/router";
import { DetailPostComponent } from "./detail/detail/detail.component";


export const PostRoutes : Routes = [
    {
        path : ':id/:slug',
        component : DetailPostComponent,
        title : 'Trang chủ'
    }
]