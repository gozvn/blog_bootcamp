import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PaginationService {

    generatePages(currentPage: number, totalPages: number, maxPagesToShow = 5): number[] {
        let pages: number[] = [];

        let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

        if (endPage - startPage < maxPagesToShow - 1) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return pages;
    }

    nextPage(currentPage: number, totalPages: number): number {
        return currentPage < totalPages ? currentPage + 1 : currentPage;
    }

    previousPage(currentPage: number): number {
        return currentPage > 1 ? currentPage - 1 : currentPage;
    }

    changeLimit(): number {
        return 1; // luôn reset page về 1 khi thay đổi limit
    }

    goToPage(page: number, totalPages: number, currentPage: number): number {
        if (page < 1 || page > totalPages) return currentPage;
        return page;
    }
}