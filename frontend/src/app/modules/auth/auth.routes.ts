import { Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";

export const AuthRoutes : Routes = [
    {
        path : '',
        redirectTo : 'login',
        pathMatch : 'full'
    },
    {
        path : 'login',
        component : LoginComponent,
        title : 'Đăng nhập'
    }
]
