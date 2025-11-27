import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../../../services/toast.service';
import { ModalComponent } from '../../../../layouts/default/partials/modal/modal.component';
import { EditCategoryComponent } from './edit/edit.component';
import { AddCategoryComponent } from './add/add.component';
import { ToastComponent } from '../../../../layouts/default/partials/toast/toast.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [RouterLink, CommonModule, ToastComponent],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent implements OnInit {
  constructor(
    private dashboardService: DashboardService,
    private modal: NgbModal,
    private toastService: ToastService
  ) { }
  listCategories: any[] = [];
  page: number = 1;
  limit: number = 10;
  total: number = 0;
  totalPages: number = 0;

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.dashboardService.getCategories(this.limit, this.page).subscribe((response) => {
      this.listCategories = response.rows;
      this.total = response.pagination.total;
      this.totalPages = response.pagination.totalPages;
      this.page = response.pagination.page;
      this.limit = response.pagination.limit;
    });
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.page = page;
      this.loadCategories();
    }
  }

  changeLimit(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.limit = parseInt(target.value);
    this.page = 1;
    this.loadCategories();
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

  // Add Category
  addCategory() {
    const modalRef = this.modal.open(AddCategoryComponent, {
      centered: true,
      backdrop: 'static',
      keyboard: false,
      size: 'lg'
    });

    modalRef.result.then(
      (newCategory) => {
        if (newCategory) {
          console.log('Category created:', newCategory);
          this.loadCategories();
        }
      },
      (reason) => {
        console.log('Add modal dismissed', reason);
      }
    );
  }

  // Edit Category
  editCategory(category: any) {
    const modalRef = this.modal.open(EditCategoryComponent, {
      centered: true,
      backdrop: 'static',
      keyboard: false,
      size: 'lg'
    });

    // Truyền dữ liệu category vào modal
    modalRef.componentInstance.category = { ...category };

    modalRef.result.then(
      (updatedCategory) => {
        if (updatedCategory) {
          console.log('Category updated:', updatedCategory);
          this.loadCategories();
        }
      },
      (reason) => {
        console.log('Edit modal dismissed', reason);
      }
    );
  }

  // Delete Category
  deleteCategory(category: any) {
    const modalRef = this.modal.open(ModalComponent, {
      centered: true,
      backdrop: 'static',
      keyboard: false
    });

    modalRef.componentInstance.data = {
      title: 'Delete Category',
      message: `Are you sure you want to delete category "${category.name}"?`,
      icon: 'bi-trash',
      status: 'danger',
      confirmText: 'Delete',
      cancelText: 'Cancel'
    };

    modalRef.result.then(
      (confirmed) => {
        if (confirmed) {
          this.dashboardService.deleteCategory(category.id).subscribe({
            next: (response) => {
              this.toastService.showMessage('successToast', `Category "${category.name}" has been deleted successfully!`);
              this.loadCategories();
            },
            error: (error) => {
              const errorMessage = error?.error?.message || error?.message || 'Failed to delete category.';
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
