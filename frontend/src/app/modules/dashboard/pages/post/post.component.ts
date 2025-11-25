import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent {
  constructor(
    private dashboardService: DashboardService
  ) { }
  listPosts: any[] = [];
  page: number = 1;
  limit: number = 10;
  total: number = 0;
  totalPages: number = 0;
  orderBy: string = 'DESC';

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.dashboardService.getPosts(this.page, this.limit, this.orderBy).subscribe((response: any) => {
      this.listPosts = response.rows;
      this.total = response.pagination.total;
      this.totalPages = response.pagination.totalPages;
      this.page = response.pagination.page;
      this.limit = response.pagination.limit;
    });
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.page = page;
      this.loadPosts();
    }
  }

  changeLimit(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.limit = parseInt(target.value);
    this.page = 1; // Reset về trang 1 khi thay đổi limit
    this.loadPosts();
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;

    if (this.totalPages <= maxPagesToShow) {
      // Hiển thị tất cả các trang nếu tổng số trang <= 5
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Hiển thị trang hiện tại và 2 trang trước/sau
      let startPage = Math.max(1, this.page - 2);
      let endPage = Math.min(this.totalPages, this.page + 2);

      // Điều chỉnh nếu ở đầu hoặc cuối
      if (this.page <= 3) {
        endPage = maxPagesToShow;
      } else if (this.page >= this.totalPages - 2) {
        startPage = this.totalPages - maxPagesToShow + 1;
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  }

  get showingFrom(): number {
    return this.total === 0 ? 0 : (this.page - 1) * this.limit + 1;
  }

  get showingTo(): number {
    return Math.min(this.page * this.limit, this.total);
  }

}
