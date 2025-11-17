import { Routes } from "@angular/router";
import { MainHome } from "./pages/main/main.component";

export const HomeRoutes : Routes = [
    {
        path : '',
        component : MainHome,
        title : 'Trang chủ'
    }
]