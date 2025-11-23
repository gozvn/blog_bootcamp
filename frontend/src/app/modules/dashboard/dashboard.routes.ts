import { Routes } from "@angular/router";
import { MainComponent } from "./main/main.component";

export const DashboardRoutes: Routes = [
    {
        path: '',
        component: MainComponent,
        title: 'Dashboard'
    }
]