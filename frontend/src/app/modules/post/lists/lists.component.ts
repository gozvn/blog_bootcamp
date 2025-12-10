import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PostService } from '../services/post.service';
import { Title, Meta } from '@angular/platform-browser';
import { PaginationService } from '../../../services/pagination.service';
import { Header } from '../../../layouts/default/partials/header/header';
import { Footer } from '../../../layouts/default/partials/footer/footer';
import { SidebarComponent } from '../../../layouts/default/partials/sidebar/sidebar.component';
import { TruncatePipe } from '../../../pipes/truncate.pipe';

@Component({
    selector: 'app-list-post',
    standalone: true,
    imports: [CommonModule, RouterLink, Header, Footer, SidebarComponent, TruncatePipe],
    templateUrl: './lists.component.html',
    styleUrls: ['./lists.component.scss']
})
export class ListPostComponent implements OnInit {
    listPosts: any[] = [];
    totalPages: number = 0;
    currentPage: number = 1;
    isFeatured: boolean = false;
    pageTitle: string = 'All Posts';
    pageDescription: string = 'Browse all latest posts from our blog.';

    pages: number[] = [];

    constructor(
        private postService: PostService,
        private route: ActivatedRoute,
        private title: Title,
        private meta: Meta,
        public paginationService: PaginationService
    ) { }

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            const page = params.get('page');
            this.currentPage = page ? parseInt(page) : 1;

            // Check URL path to toggle isFeatured
            const url = this.route.snapshot.url.map(segment => segment.path).join('/');
            this.isFeatured = url.includes('featured');
            this.setupPageMeta();
            this.loadPosts();
        });
    }

    setupPageMeta() {
        if (this.isFeatured) {
            this.pageTitle = 'Featured Posts';
            this.pageDescription = 'Discover our most popular and highlighted stories.';
        } else {
            this.pageTitle = 'All Posts';
            this.pageDescription = 'Browse all latest posts from our blog.';
        }
        this.title.setTitle(`${this.pageTitle} | My Blog`);
        this.meta.updateTag({ name: 'description', content: this.pageDescription });
    }

    loadPosts() {
        const params: any = {
            page: this.currentPage,
            limit: 10,
            status: 1 // Published
        };

        if (this.isFeatured) {
            params.featured = 1;
        }



        this.postService.getPosts({ params }).subscribe(data => {
            if (data && data.rows) {
                this.listPosts = data.rows;
                this.totalPages = data.pagination?.totalPages ?? 0;
                this.pages = this.paginationService.generatePages(this.currentPage, this.totalPages);
            } else {
                this.listPosts = [];
                this.totalPages = 0;
                this.pages = [];
            }
        });
    }
    getBaseUrl(): string {
        return this.isFeatured ? '/post/featured/page' : '/post/all/page';
    }
}
