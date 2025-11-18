import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommentService } from '../services/comment.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-post-comment',
  standalone: true,
  imports: [],
  templateUrl: './post-comment.component.html',
  styleUrl: './post-comment.component.scss'
})
export class PostCommentComponent {
    @Input() postId: number = 0;
    @Input() user: any = null;
    // Khởi tạo form để gửi bình luận
    form: FormGroup;

    constructor(
      private fb: FormBuilder, 
      private commentService: CommentService,
      private toastService: ToastService
    ) {
        this.form = this.fb.group({
            content: ['', Validators.required],
            parentId: [null]
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
