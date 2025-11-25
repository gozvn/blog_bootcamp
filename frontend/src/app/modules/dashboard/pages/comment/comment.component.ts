import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { TruncatePipe } from '../../../../pipes/truncate.pipe';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [RouterLink, CommonModule, TruncatePipe],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss'
})
export class CommentComponent {
  limit: number = 10;
  page: number = 1;
  comments: any[] = [];
  total: number = 0;
  totalPages: number = 0;

  constructor(
    private dashboardService: DashboardService
  ) { }

  ngOnInit(): void {
    this.getComments();
  }

  getComments() {
    this.dashboardService.getComments(this.limit, this.page).subscribe((response: any) => {
      this.comments = response.rows;
      this.total = response.pagination.total;
      this.totalPages = response.pagination.totalPages;
      this.page = response.pagination.page;
      this.limit = response.pagination.limit;
    });
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.page = page;
      this.getComments();
    }
  }

  changeLimit(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.limit = parseInt(target.value);
    this.page = 1;
    this.getComments();
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;

    if (this.totalPages <= maxPagesToShow) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(1, this.page - 2);
      let endPage = Math.min(this.totalPages, this.page + 2);

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
