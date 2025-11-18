import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommentService } from '../services/comment.service';
import { ToastService } from '../../../services/toast.service';
import { ToastComponent } from '../../../layouts/partials/toast/toast.component';
import { min } from 'rxjs';

@Component({
  selector: 'app-post-comment',
  standalone: true,
  imports: [ReactiveFormsModule, ToastComponent],
  templateUrl: './post-comment.component.html',
  styleUrl: './post-comment.component.scss'
})
export class PostCommentComponent {
    @Input() postId: number = 0;
    @Input() user: any = null;
    // Khởi tạo form để gửi bình luận
    commentForm: FormGroup;
    // OUtput event khi bình luận được gửi thành công gửi sự kiện ra comment component cha
    @Output() submitComment = new EventEmitter<void>();
    constructor(
      private fb: FormBuilder, 
      private commentService: CommentService,
      private toastService: ToastService
    ) {
        this.commentForm = this.fb.group({
            content: ['', [Validators.required, Validators.minLength(10)]],
            parentId: [null]
        });
    }
    
    // Hàm Xử lý khi người dùng gửi bình luận
    onSubmitComment(): void {
      if (this.commentForm.invalid) {
        this.commentForm.markAllAsTouched();
        return;
      }
    
      const { content, parentId } = this.commentForm.value;
      const userId = this.user.id;
      
      this.commentService.postComment(userId, content, this.postId, parentId ).subscribe({
        next: async (response) => {
          console.log('Comment posted successfully:', response);
          await this.toastService.showMessage('successToast', 'Comment posted successfully!');
          this.submitComment.emit();
          console.log('Resetting comment form');
          // this.commentForm.reset();
        },
        error: async (error) => {
          await this.toastService.showMessage('errorToast', 'Failed to post comment. Please try again.');
        }
      });

    }
}
