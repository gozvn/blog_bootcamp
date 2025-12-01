import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostCommentComponent } from '../post-comment/post-comment.component';

@Component({
  selector: 'app-reply-comment',
  standalone: true,
  imports: [CommonModule, PostCommentComponent],
  templateUrl: './reply-comment.component.html',
  styleUrl: './reply-comment.component.scss'
})
export class ReplyCommentComponent {
  @Input() replies: any[] = [];
  @Input() user: any = null;
  @Input() postId: number = 0;
  @Input() rootCommentId: number = 0;
  @Output() replySubmitted = new EventEmitter<void>();

  replyingToId: number | null = null;

  onReply(commentId: number) {
    this.replyingToId = this.replyingToId === commentId ? null : commentId;
  }

  onSubmitReply() {
    this.replyingToId = null;
    this.replySubmitted.emit();
  }
}
