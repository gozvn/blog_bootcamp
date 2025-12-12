import { Component, OnInit } from '@angular/core';
import { FeaturedPostComponent } from './featured-post/featured-post.component';
import { LastestPostComponent } from './lastest-post/lastest-post.component';
import { SidebarComponent } from '../../../../layouts/default/partials/sidebar/sidebar.component';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [FeaturedPostComponent, LastestPostComponent, SidebarComponent, TranslatePipe, TranslateModule],
  templateUrl: './main.component.html',
})

export class MainHome {
}
