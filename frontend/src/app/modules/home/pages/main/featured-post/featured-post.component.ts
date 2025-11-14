import { Component, OnInit } from '@angular/core';
import { HomeService } from '../../../services/home.service';
import { CommonModule } from '@angular/common';
import { TruncatePipe } from '../../../../../helper/truncate.pipe';

@Component({
  selector: 'app-featured-post',
  standalone: true,
  imports: [CommonModule,TruncatePipe],
  templateUrl: './featured-post.component.html',
})

export class FeaturedPostComponent implements  OnInit {
  constructor(private homeService: HomeService) {
  }
  featuredPosts: any[] = [];

  ngOnInit(): void {
      this.homeService.getfeaturedPosts(2).subscribe(posts => {
          this.featuredPosts = posts;
      });
  }
}

