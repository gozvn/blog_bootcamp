import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SearchService } from '../services/search.service';
import { PaginationService } from '../../../services/pagination.service';
import { TruncatePipe } from '../../../pipes/truncate.pipe';
import { SidebarComponent } from '../../../layouts/default/partials/sidebar/sidebar.component';


@Component({
  selector: 'app-result',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    TruncatePipe,
    SidebarComponent
  ],
  templateUrl: './result.component.html',
  styleUrl: './result.component.scss'
})
export class ResultComponent implements OnInit {
  listPosts: any[] = [];
  totalResults = 0;
  currentPage = 1;
  loading = false;
  keyword = '';
  isFeatured = false;
  totalPages = 0;
  pages: number[] = [];
  Math = Math; // Expose Math to template

  constructor(
    private searchService: SearchService,
    private paginationService: PaginationService,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    // Listen to route params for search keyword
    this.route.queryParams.subscribe(params => {
      this.keyword = params['q'] || '';
      this.currentPage = +params['page'] || 1;
      
      if (this.keyword) {
        this.performSearch();
      }
    });
  }

  performSearch(): void {

    if (!this.keyword.trim()) return;
    
    this.loading = true;
    this.searchService.searchPosts(this.keyword, this.currentPage, 10).subscribe({
      next: (response) => {
        this.listPosts = response?.rows || [];
        this.totalResults = response?.pagination?.total || 0;
        this.totalPages = Math.ceil(this.totalResults / 10);
        this.pages = this.paginationService.generatePages(this.currentPage, this.totalPages);
        this.loading = false;
      },
      error: (error) => {
        console.error('Search error:', error);
        this.listPosts = [];
        this.totalResults = 0;
        this.loading = false;
      }
    });
  }



  onPageChange(page: number): void {
    this.router.navigate(['/search'], {
      queryParams: { q: this.keyword, page: page }
    });
  }

  get paginationPages(): number[] {
    return this.paginationService.generatePages(this.currentPage, Math.ceil(this.totalResults / 10));
  }

  getShowingResults(): { start: number; end: number; total: number } {
    const start = ((this.currentPage - 1) * 10) + 1;
    const end = Math.min(this.currentPage * 10, this.totalResults);
    return {
      start: start,
      end: end,
      total: this.totalResults
    };
  }

  trackByPostId(index: number, post: any): number {
    return post.id;
  }
}
