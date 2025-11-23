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

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [Header, Footer, RouterLink, TruncatePipe, CommonModule, ToastComponent],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private modal: ModalService,
    private toast: ToastService
  ) { }
  page: number = 1;
  limit: number = 10;
  userInfo: any;
  total: number = 0;
  totalPages: number = 0;
  posts: any[] = [];

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      this.page = parseInt(paramMap.get('page') || '1', 10);

      this.userInfo = this.authService.getUserInfo();
      this.userService.getPostByUser(this.userInfo.id, this.page, this.limit).subscribe((data) => {
        this.posts = data.rows || [];
        this.total = data.pagination.total;
        this.limit = data.pagination.limit;
        this.totalPages = data.pagination.totalPages;
      });
    });
  }

  deletePost(postId: number): void {
    this.modal.confirm({
      title: 'Delete Post',
      message: 'Are you sure you want to delete this post?',
      status: 'danger',
      confirmText: 'Delete',
      cancelText: 'Cancel'
    }).then((confirmed) => {
      if (confirmed) {
        this.userService.deletePost(postId).subscribe(() => {
          this.posts = this.posts.filter(post => post.id !== postId);
          this.toast.showMessage('successToast', 'Post deleted successfully.');
        }, (error) => {
          this.toast.showMessage('errorToast', 'Failed to delete post.');
        });
      }
    });
  }

}
