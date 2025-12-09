import { Component, OnInit } from '@angular/core';
import { HomeService } from '../../../services/home.service';
import { TruncatePipe } from '../../../../../pipes/truncate.pipe';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lastest-post',
  standalone: true,
  imports: [TruncatePipe, CommonModule],
  templateUrl: './lastest-post.component.html'
})

export class LastestPostComponent implements OnInit {

  lastestPost: any[] = [];
  page = 1;
  limit = 6;
  totalPages = 1;
  loading = false;

  constructor(private homeService: HomeService) { }

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts() {
    this.loading = true;
    this.homeService.getPosts(this.limit, this.page).subscribe(data => {
      this.loading = false;

      this.totalPages = data.pagination?.totalPages ?? 1;

      // Append posts mới vào mảng hiện tại
      this.lastestPost = [...this.lastestPost, ...data.rows];
    });
  }

  onViewMore() {
    if (this.loading || this.page >= this.totalPages) return;
    this.page++;
    this.loadPosts();
  }

}
