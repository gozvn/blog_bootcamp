import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { TruncatePipe } from '../../../../pipes/truncate.pipe';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../../../services/toast.service';
import { ToastComponent } from '../../../../layouts/default/partials/toast/toast.component';
import { ModalComponent } from '../../../../layouts/default/partials/modal/modal.component';
import { EditCommentComponent } from './edit/edit.component';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [RouterLink, CommonModule, TruncatePipe, ToastComponent],
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
    private dashboardService: DashboardService,
    private modal: NgbModal,
    private toastService: ToastService
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

  // Edit Comment
  editComment(comment: any) {
    const modalRef = this.modal.open(EditCommentComponent, {
      centered: true,
      backdrop: 'static',
      keyboard: false,
      size: 'lg'
    });

    modalRef.componentInstance.comment = { ...comment };

    modalRef.result.then(
      (updatedComment) => {
        if (updatedComment) {
          this.getComments();
        }
      },
      (reason) => {
        console.log('Edit modal dismissed', reason);
      }
    );
  }

  // Delete Comment
  deleteComment(comment: any) {
    const modalRef = this.modal.open(ModalComponent, {
      centered: true,
      backdrop: 'static',
      keyboard: false
    });

    modalRef.componentInstance.data = {
      title: 'Delete Comment',
      message: `Are you sure you want to delete this comment by "${comment.user?.username || 'Unknown'}"?`,
      icon: 'bi-trash',
      status: 'danger',
      confirmText: 'Delete',
      cancelText: 'Cancel'
    };

    modalRef.result.then(
      (confirmed) => {
        if (confirmed) {
          this.dashboardService.deleteComment(comment.id).subscribe({
            next: (response) => {
              this.toastService.showMessage('successToast', 'Comment deleted successfully!');
              this.getComments();
            },
            error: (error) => {
              const errorMessage = error?.error?.message || error?.message || 'Failed to delete comment.';
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
