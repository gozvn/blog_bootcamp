import { Routes } from "@angular/router";
import { mainHome } from "./pages/main/main.component";

export const HomeRoutes : Routes = [
    {
        path : '',
        component : mainHome,
        title : 'Trang chủ'
    }
]