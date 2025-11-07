import { Routes } from "@angular/router";
import { DashboardComponent } from "../../layouts/dashboard/dashboard.component";

export const DashboardRoutes : Routes = [
    {
        path : '',
        component : DashboardComponent,
        title : 'Dashboard'
    }
]