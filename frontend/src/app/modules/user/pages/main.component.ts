import { Component, OnInit } from '@angular/core';
import { Header } from '../../../layouts/default/partials/header/header';
import { Footer } from '../../../layouts/default/partials/footer/footer';
import { UserService } from '../service/user.service';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TruncatePipe } from '../../../pipes/truncate.pipe';
import { CommonModule } from '@angular/common';
import { ToastComponent } from '../../../layouts/default/partials/toast/toast.component';
import { ToastService } from '../../../services/toast.service';
import { ModalService } from '../../../services/modal.service';
import { FormControl, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [Header, Footer, RouterLink, TruncatePipe, CommonModule, ToastComponent, ReactiveFormsModule, TranslateModule],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  fb !: FormGroup;
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private modal: ModalService,
    private toast: ToastService,
    private translate: TranslateService
  ) {
    this.fb = new FormGroup({
      title: new FormControl(''),
      categoryId: new FormControl(''),
      featured: new FormControl(''),
      status: new FormControl(''),
    });
  }
  page: number = 1;
  limit: number = 10;
  userInfo: any;
  categoryId: number = 0;
  featured: number = 0;
  status: string = '';
  title: string = '';
  total: number = 0;
  totalPages: number = 0;
  totalAllPosts: number = 0;
  publishedCount: number = 0;
  draftCount: number = 0;
  posts: any[] = [];
  categories: any[] = [];

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      this.page = parseInt(paramMap.get('page') || '1', 10);
      this.userInfo = this.authService.getUserInfo();
      this.filterPosts();
      this.loadCategories();
      this.loadTotalAllPosts();
      this.loadPublishedCount();
      this.loadDraftCount();
    });
  }
  loadCategories() {
    this.userService.getCategories().subscribe((data) => {
      this.categories = data.rows || [];
    });
  }
  loadPost(page: number = 1, limit: number = 10, categoryId: number = 0, title: string = '', status: string = '') {
    this.userService.getPostByUser(this.userInfo.id, categoryId, title, status, page, limit).subscribe((data) => {
      // console.log("Data : ", data);
      this.posts = data.rows || [];
      this.total = data.pagination.total;
      this.limit = data.pagination.limit;
      this.totalPages = data.pagination.totalPages;
    });
  }
  filterPosts() {
    // console.log("Filter : ", this.fb.value);
    this.page = 1;
    this.title = this.fb.value.title;
    this.categoryId = Number(this.fb.value.categoryId);
    this.status = this.fb.value.status;
    this.loadPost(this.page, this.limit, this.categoryId, this.title, this.status);
  }
  loadTotalAllPosts() {
    this.userService.getPostByUser(this.userInfo.id, 0, '', '', 1, 1).subscribe((data) => {
      this.totalAllPosts = data.pagination.total || 0;
    });
  }

  loadPublishedCount() {
    this.userService.getPostByUser(this.userInfo.id, 0, '', 'published', 1, 1).subscribe((data) => {
      this.publishedCount = data.pagination.total || 0;
    });
  }

  loadDraftCount() {
    this.userService.getPostByUser(this.userInfo.id, 0, '', 'draft', 1, 1).subscribe((data) => {
      this.draftCount = data.pagination.total || 0;
    });
  }

  deletePost(postId: number): void {
    this.modal.confirm({
      title: this.translate.instant('USER.DELETE_POST'),
      message: this.translate.instant('USER.DELETE_CONFIRM'),
      status: 'danger',
      confirmText: this.translate.instant('USER.DELETE'),
      cancelText: this.translate.instant('USER.CANCEL')
    }).then((confirmed) => {
      if (confirmed) {
        this.userService.deletePost(postId).subscribe(() => {
          this.posts = this.posts.filter(post => post.id !== postId);
          this.toast.showMessage('successToast', this.translate.instant('USER.POST_DELETED'));
          // Cập nhật lại số liệu sau khi xóa
          this.loadTotalAllPosts();
          this.loadPublishedCount();
          this.loadDraftCount();
          this.filterPosts();
        }, (error) => {
          this.toast.showMessage('errorToast', this.translate.instant('USER.DELETE_FAILED'));
        });
      }
    });
  }

}
