import { Routes } from "@angular/router";
import { mainHome } from "./pages/main/main.component";
import { LoginHome } from "./pages/login/login.component";

export const HomeRoutes : Routes = [
    {
        path : '',
        component : mainHome,
        title : 'Trang chủ'
    },
    {
        path : 'login',
        component : LoginHome,
        title : 'Login'
    }
]