import { Component, OnInit } from '@angular/core';
import { HomeService } from '../../../../modules/home/services/home.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {
  constructor(
    private homeService: HomeService
  ) { }

  recentPosts: any[] = [];

  ngOnInit(): void {
    // Initialization logic here
    this.homeService.getPosts(5).subscribe(data => {
      this.recentPosts = data.rows ?? [];
    });
  }

}
