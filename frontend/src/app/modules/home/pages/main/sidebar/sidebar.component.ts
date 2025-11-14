import { Component, OnInit } from '@angular/core';
import { HomeService } from '../../../services/home.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {
  constructor(
    private homeService: HomeService
  ) {}

  recentPosts: any[] = [];

  ngOnInit(): void {
    // Initialization logic here
    this.homeService.getPosts(5).subscribe(data => {
      this.recentPosts = data.rows ?? [];
    });
  }

}
