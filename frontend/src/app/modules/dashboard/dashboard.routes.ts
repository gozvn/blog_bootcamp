import { Routes } from "@angular/router";
import { MainComponent } from "./main/main.component";
import { CategoryComponent } from "./pages/category/category.component";
import { PostComponent } from "./pages/post/post.component";
import { UserComponent } from "./pages/user/user.component";
import { CommentComponent } from "./pages/comment/comment.component";
import { SettingComponent } from "./pages/setting/setting.component";

export const DashboardRoutes: Routes = [
    {
        path: '',
        component: MainComponent,
        title: 'Dashboard'
    },
    {
        path: 'categories',
        component: CategoryComponent,
        title: 'Categories'
    },
    {
        path: 'posts',
        component: PostComponent,
        title: 'Posts'
    },
    {
        path: 'users',
        component: UserComponent,
        title: 'Users'
    },
    {
        path: 'comments',
        component: CommentComponent,
        title: 'Comments'
    },
    {
        path: 'settings',
        component: SettingComponent,
        title: 'Settings'
    }
]