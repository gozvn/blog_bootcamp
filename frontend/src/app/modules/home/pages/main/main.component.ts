import { Component,OnInit } from '@angular/core';
import { HomeService } from '../../services/home.service';
import { FeaturedPostComponent } from './featured-post/featured-post.component';
import { LastestPostComponent } from './lastest-post/lastest-post.component';
import { SidebarComponent } from './sidebar/sidebar.component';

@Component({
  selector: 'app-main',
  standalone:true,
  imports: [FeaturedPostComponent,LastestPostComponent, SidebarComponent],
  templateUrl: './main.component.html',
})

export class mainHome { 
}
