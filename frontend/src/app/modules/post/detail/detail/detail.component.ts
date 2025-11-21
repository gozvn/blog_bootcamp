import { CommonModule } from '@angular/common';
import { Component,OnInit } from '@angular/core';
import { PostService } from '../../services/post.service';
import { Header } from '../../../../layouts/default/partials/header/header';
import { Footer } from '../../../../layouts/default/partials/footer/footer';
import { ActivatedRoute } from '@angular/router';
import { CommentComponent } from '../../../comment/comment.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [CommonModule,Header,Footer,CommentComponent],
  templateUrl: './detail.component.html',
})
export class DetailPostComponent implements OnInit {
  constructor(
    private postService: PostService,
    private route: ActivatedRoute,
    private title: Title
  ) { }

  detail: any = null;
  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    // Lấy ID từ route và gọi dịch vụ để lấy chi tiết bài viết
    this.postService.getPost(id).subscribe(post => {
      this.detail = post;
      this.title.setTitle(post.title);
    });
  }
}
