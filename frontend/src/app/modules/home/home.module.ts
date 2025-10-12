import { NgModule } from '@angular/core';
import { mainHome } from './pages/main/main.component';
import { HomeRouting } from './home-routing.module';

@NgModule({
    declarations: [],
    imports: [HomeRouting, mainHome],
    exports: [
        mainHome, // export cho các modules khác sử dụng
    ],
    providers: []
})

export class HomeModule {

}