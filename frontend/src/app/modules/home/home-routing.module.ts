import { Routes, RouterModule } from "@angular/router";
import { mainHome } from "./pages/main/main.component";
import { NgModule } from "@angular/core";

const routes: Routes = [
    {path: '', component: mainHome, data: { title: 'Home Page' }}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class HomeRouting {

}