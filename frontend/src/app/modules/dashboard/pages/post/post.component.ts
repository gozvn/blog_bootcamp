import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../../../services/toast.service';
import { ModalComponent } from '../../../../layouts/default/partials/modal/modal.component';
import { ToastComponent } from '../../../../layouts/default/partials/toast/toast.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [RouterLink, CommonModule, ToastComponent, FormsModule],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent {
  constructor(
    private dashboardService: DashboardService,
    private modal: NgbModal,
    private toastService: ToastService
  ) { }
  listPosts: any[] = [];
  page: number = 1;
  limit: number = 10;
  total: number = 0;
  totalPages: number = 0;
  orderBy: string = 'DESC';
  categories: any[] = [];

  // Filter properties
  selectedLanguage: any = '';
  selectedStatus: string = '';
  selectedCategory: any = '';

  ngOnInit(): void {
    this.loadCategories();
    this.loadPosts();
  }
  loadCategories(): void {
    this.dashboardService.getCategories().subscribe((response: any) => {
      this.categories = response.rows;
    });
  }
  loadPosts(): void {
    this.dashboardService.getPosts(this.page, this.limit, this.orderBy, this.selectedCategory, this.selectedLanguage, this.selectedStatus).subscribe((response: any) => {
      this.listPosts = response.rows;
      this.total = response.pagination.total;
      this.totalPages = response.pagination.totalPages;
      this.page = response.pagination.page;
      this.limit = response.pagination.limit;
    });
  }

  filterPosts(): void {
    this.page = 1;
    this.loadPosts();
  }

  clearFilters(): void {
    this.selectedLanguage = '';
    this.selectedStatus = '';
    this.selectedCategory = '';
    this.filterPosts();
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

  // Delete Post
  deletePost(post: any) {
    const modalRef = this.modal.open(ModalComponent, {
      centered: true,
      backdrop: 'static',
      keyboard: false
    });

    modalRef.componentInstance.data = {
      title: 'Delete Post',
      message: `Are you sure you want to delete post "${post.title}"?`,
      icon: 'bi-trash',
      status: 'danger',
      confirmText: 'Delete',
      cancelText: 'Cancel'
    };

    modalRef.result.then(
      (confirmed) => {
        if (confirmed) {
          this.dashboardService.deletePost(post.id).subscribe({
            next: (response) => {
              this.toastService.showMessage('successToast', `Post "${post.title}" has been deleted successfully!`);
              this.loadPosts();
            },
            error: (error) => {
              const errorMessage = error?.error?.message || error?.message || 'Failed to delete post.';
              this.toastService.showMessage('errorToast', errorMessage);
            }
          });
        }
      },
      (reason) => {
        console.log('Delete cancelled', reason);
      }
    );
  }

}
