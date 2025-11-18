import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '../../services/toast.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommentService } from './services/comment.service';
import { CommonModule } from '@angular/common';
import { PostCommentComponent } from './post-comment/post-comment.component';
import { ReplyCommentComponent } from './reply-comment/reply-comment.component';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [ReactiveFormsModule,RouterLink,CommonModule,PostCommentComponent,ReplyCommentComponent],
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

  isLoggedIn: boolean = false;
  user: any = null;
  postId: number = 0;
  listComments: any[] = [];
  currentPage: number = 1;
  totalPages: number = 0;

  constructor(
    private commentService: CommentService, 
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute, 
    private toastService: ToastService) { }

  // Kiểm tra trạng thái đăng nhập khi khởi tạo component
  ngOnInit(): void {
    // Lấy postId từ route parameters
    this.route.paramMap.subscribe(params => {
      this.postId = Number(params.get('id'));
    });

    const user = this.authService.getUserInfo();
    
    if (user) {
      this.isLoggedIn = true;
      this.user = user;
    }
    // Lấy comment 
    this.commentService.getCommentsByPostId(this.postId, 1, 10).subscribe(
      data => {
        this.listComments = data.rows ?? [];
        this.totalPages = data.pagination.totalPages ?? 0;
        this.currentPage = data.pagination.page ?? 1;
        // console.log(this.listComments);
    });

  }

  loadComments() {
    this.commentService.getCommentsByPostId(this.postId, 1, 10).subscribe(res => {
      this.listComments = res.rows ?? [];
      this.totalPages = res.pagination.totalPages ?? 0;
      this.currentPage = res.pagination.page ?? 1;
    });
  }

}
