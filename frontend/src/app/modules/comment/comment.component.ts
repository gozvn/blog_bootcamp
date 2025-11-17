import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '../../services/toast.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommentService } from './services/comment.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [ReactiveFormsModule,RouterLink,CommonModule],
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {
  // Khởi tạo form để gửi bình luận
  form: FormGroup;
  commentContent: string = '';
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
    private toastService: ToastService) { 
    // Tạo form với trường commentContent và các validator
    this.form = this.formBuilder.group({
      commentContent: ['', [Validators.required, Validators.minLength(10)]],
      parentId: [null]
    });
  }

  // Kiểm tra trạng thái đăng nhập khi khởi tạo component
  ngOnInit(): void {
    // Lấy postId từ route parameters
    this.route.paramMap.subscribe(params => {
      this.postId = Number(params.get('postId'));
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
        console.log(this.listComments);
      });
  }

  // Hàm Xử lý khi người dùng gửi bình luận
  onSubmitComment(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
   
    const { commentContent, parentId } = this.form.value;
    const userId = this.user.id;
    
    this.commentService.postComment(userId, commentContent, this.postId, parentId ).subscribe({
      next: async (response) => {
        await this.toastService.showMessage('successToast', 'Comment posted successfully!');
        this.form.reset();
      },
      error: async (error) => {
        await this.toastService.showMessage('errorToast', 'Failed to post comment. Please try again.');
      }
    });
  }
}
