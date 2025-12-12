import { Component, OnInit } from '@angular/core';
import { HomeService } from '../../../services/home.service';
import { CommonModule } from '@angular/common';
import { TruncatePipe } from '../../../../../pipes/truncate.pipe';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-featured-post',
  standalone: true,
  imports: [CommonModule, TruncatePipe, RouterLink, TranslateModule],
  templateUrl: './featured-post.component.html',
})

export class FeaturedPostComponent implements OnInit {
  constructor(private homeService: HomeService) {
  }
  featuredPosts: any[] = [];

  ngOnInit(): void {
    this.homeService.getfeaturedPosts(2).subscribe(posts => {
      // console.log(posts);
      this.featuredPosts = posts;
    });
  }
}

