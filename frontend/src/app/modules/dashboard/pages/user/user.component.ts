import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { CommonModule } from '@angular/common';
import { RoleNamePipe } from '../../../../pipes/userRole.pipe';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditComponent } from './edit/edit.component';
import { ToastService } from '../../../../services/toast.service';
import { ModalComponent } from '../../../../layouts/default/partials/modal/modal.component';
import { ToastComponent } from '../../../../layouts/default/partials/toast/toast.component';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [RouterLink, CommonModule, RoleNamePipe, ToastComponent,],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent {
  constructor(
    private dashboardService: DashboardService,
    private modal: NgbModal,
    private toastService: ToastService
  ) { }
  listUsers: any[] = [];
  page: number = 1;
  limit: number = 10;
  total: number = 0;
  totalPages: number = 0;

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.dashboardService.getUser(this.limit, this.page).subscribe((response) => {
      this.listUsers = response.rows;
      this.total = response.pagination.total;
      this.totalPages = response.pagination.totalPages;
      this.page = response.pagination.page;
      this.limit = response.pagination.limit;
    });
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.page = page;
      this.loadUsers();
    }
  }

  changeLimit(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.limit = parseInt(target.value);
    this.page = 1;
    this.loadUsers();
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
  // Edit User
  editUser(user: any) {
    const modalRef = this.modal.open(EditComponent, {
      centered: true,
      backdrop: 'static',
      keyboard: false
    });

    // Truyền dữ liệu user vào modal
    modalRef.componentInstance.user = { ...user }; // clone để tránh sửa trực tiếp

    modalRef.result.then(
      (updatedUser) => {
        if (updatedUser) {
          // Có thể gọi API cập nhật hoặc reload lại danh sách user
          console.log('User updated:', updatedUser);
          this.loadUsers();
        }
      },
      (reason) => {
        // modal bị đóng hoặc hủy
        console.log('Edit modal dismissed', reason);
      }
    );
  }

  // Delete User
  deleteUser(user: any) {
    // Tạo modal confirm với ModalComponent có sẵn
    const modalRef = this.modal.open(ModalComponent, {
      centered: true,
      backdrop: 'static',
      keyboard: false
    });

    // Truyền data vào modal theo cấu trúc của ModalComponent
    modalRef.componentInstance.data = {
      title: 'Delete User',
      message: `Are you sure you want to delete user "${user.email}"?`,
      icon: 'bi-trash',
      status: 'danger',
      confirmText: 'Delete',
      cancelText: 'Cancel'
    };

    // Xử lý kết quả từ modal
    modalRef.result.then(
      (confirmed) => {
        if (confirmed) {
          // Gọi API delete
          this.dashboardService.deleteUser(user.id).subscribe({
            next: (response) => {
              // Hiển thị toast success
              this.toastService.showMessage('successToast', `User "${user.email}" has been deleted successfully!`);

              // Reload lại danh sách user
              this.loadUsers();
            },
            error: (error) => {
              const errorMessage = error?.error?.message || error?.message || 'Failed to delete user.';
              this.toastService.showMessage('errorToast', errorMessage);
            }
          });
        }
      },
      (reason) => {
        // Modal bị dismiss/cancel - không làm gì
        console.log('Delete cancelled', reason);
      }
    );
  }
  get showingFrom(): number {
    return this.total === 0 ? 0 : (this.page - 1) * this.limit + 1;
  }

  get showingTo(): number {
    return Math.min(this.page * this.limit, this.total);
  }
}
