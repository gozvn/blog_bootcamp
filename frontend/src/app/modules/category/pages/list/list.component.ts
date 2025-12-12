import { Component, inject, OnInit } from '@angular/core';
import { Header } from '../../../../layouts/default/partials/header/header';
import { Footer } from '../../../../layouts/default/partials/footer/footer';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SidebarComponent } from '../../../../layouts/default/partials/sidebar/sidebar.component';
import { CategoryService } from '../../services/category.service';
import { TruncatePipe } from '../../../../pipes/truncate.pipe';
import { Title, Meta } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [Header, Footer, SidebarComponent, CommonModule, RouterLink, TruncatePipe, TranslateModule],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private title: Title,
    private meta: Meta
  ) { }

  id: number = 0;
  slug: string = '';
  detailCategory: any = {};
  listPosts: any = [];
  totalPages: number = 0;
  currentPage: number = 1;

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      this.id = parseInt(paramMap.get('id') ?? '0');
      this.slug = paramMap.get('slug') ?? '';
      this.currentPage = parseInt(paramMap.get('page') ?? '1');
      // console.log('Category ID:', this.id);
      // console.log('Page Number:', this.currentPage);

      this.categoryService.getCategoryPosts(this.id, this.currentPage).subscribe(data => {
        this.detailCategory = data.data;
        this.listPosts = data.data.posts.rows ?? [];
        this.totalPages = data.data.posts.pagination.totalPages ?? 0;
        this.currentPage = data.data.posts.pagination.page ?? 1;
        // console.log("API DATA:", this.listPosts);
        // Set SEO meta tags
        this.title.setTitle(`Category: ${this.detailCategory.name} | My Blog`);
        this.meta.updateTag({ name: 'description', content: `Browse posts in the ${this.detailCategory.name} category.` });
      });
    });
  }

}
