import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../../../services/toast.service';
import { ToastComponent } from '../../../../layouts/default/partials/toast/toast.component';
import { ModalComponent } from '../../../../layouts/default/partials/modal/modal.component';
import { CreateLanguageComponent } from './create/create.component';

@Component({
    selector: 'app-language',
    standalone: true,
    imports: [RouterLink, CommonModule, ToastComponent],
    templateUrl: './language.component.html',
    styleUrl: './language.component.scss'
})
export class LanguageComponent implements OnInit {
    limit: number = 10;
    page: number = 1;
    languages: any[] = [];
    total: number = 0;
    totalPages: number = 0;

    constructor(
        private dashboardService: DashboardService,
        private modal: NgbModal,
        private toastService: ToastService
    ) { }

    ngOnInit(): void {
        this.getLanguages();
    }

    getLanguages() {
        this.dashboardService.getLanguages(this.limit, this.page).subscribe({
            next: (response: any) => {
                this.languages = response.rows;
                this.total = response.pagination.total;
                this.totalPages = response.pagination.totalPages;
                this.page = response.pagination.page;
                this.limit = response.pagination.limit;
            },
            error: (error) => {
                console.error("Failed to load languages", error);
                this.toastService.showMessage('errorToast', 'Failed to load languages.');
            }
        });
    }

    changePage(page: number): void {
        if (page >= 1 && page <= this.totalPages) {
            this.page = page;
            this.getLanguages();
        }
    }

    changeLimit(event: Event): void {
        const target = event.target as HTMLSelectElement;
        this.limit = parseInt(target.value);
        this.page = 1;
        this.getLanguages();
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

    // Create/Edit
    openModal(language?: any) {
        const modalRef = this.modal.open(CreateLanguageComponent, {
            centered: true,
            backdrop: 'static',
            keyboard: false
        });

        if (language) {
            modalRef.componentInstance.language = { ...language };
        }

        modalRef.result.then(
            (result) => {
                if (result) {
                    this.getLanguages();
                }
            },
            (reason) => { }
        );
    }

    // Delete
    deleteLanguage(language: any) {
        const modalRef = this.modal.open(ModalComponent, {
            centered: true,
            backdrop: 'static',
            keyboard: false
        });

        modalRef.componentInstance.data = {
            title: 'Delete Language',
            message: `Are you sure you want to delete language "${language.lang_name}"?`,
            icon: 'bi-trash',
            status: 'danger',
            confirmText: 'Delete',
            cancelText: 'Cancel'
        };

        modalRef.result.then(
            (confirmed) => {
                if (confirmed) {
                    this.dashboardService.deleteLanguage(language.id).subscribe({
                        next: (response) => {
                            this.toastService.showMessage('successToast', 'Language deleted successfully!');
                            this.getLanguages();
                        },
                        error: (error) => {
                            const errorMessage = error?.error?.message || error?.message || 'Failed to delete language.';
                            this.toastService.showMessage('errorToast', errorMessage);
                        }
                    });
                }
            },
            (reason) => { }
        );
    }
}
