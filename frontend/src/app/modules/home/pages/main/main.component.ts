import { Component,OnInit } from '@angular/core';
import { FeaturedPostComponent } from './featured-post/featured-post.component';
import { LastestPostComponent } from './lastest-post/lastest-post.component';
import { SidebarComponent } from '../../../../layouts/partials/sidebar/sidebar.component';

@Component({
  selector: 'app-main',
  standalone:true,
  imports: [FeaturedPostComponent,LastestPostComponent, SidebarComponent],
  templateUrl: './main.component.html',
})

export class mainHome { 
}
