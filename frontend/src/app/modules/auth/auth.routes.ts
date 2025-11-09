import { Routes } from "@angular/router";
import { Login } from "./login/login.component";

export const AuthRoutes : Routes = [
    {
        path : '',
        redirectTo : 'login',
        pathMatch : 'full'
    },
    {
        path : 'login',
        component : Login,
        title : 'Đăng nhập'
    }
]
