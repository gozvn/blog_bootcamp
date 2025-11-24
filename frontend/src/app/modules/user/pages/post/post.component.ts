import { Component, OnInit } from '@angular/core';
import { Footer } from '../../../../layouts/default/partials/footer/footer';
import { Header } from '../../../../layouts/default/partials/header/header';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../service/user.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { environment } from '../../../../../environments/environment.prod';
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [Header, Footer, ReactiveFormsModule, CommonModule, QuillModule],
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss', 'quill.scss']
})
export class PostComponent implements OnInit {
  // Khởi tạo form  submitContentForm từ FormGroup
  submitContentForm: FormGroup
  loading: boolean = false;
  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.submitContentForm = new FormGroup({
      id: new FormControl(''),
      title: new FormControl('', [Validators.required]),
      content: new FormControl('', [Validators.required]),
      category_id: new FormControl('', [Validators.required]),
      tags: new FormControl('', [Validators.required]),
      imagePreview: new FormControl(''),
      image: new FormControl('', [Validators.required, Validators.pattern(/\.(jpg|jpeg|png|gif)$/)]),
    })
  }
  categories: any[] = [];
  image: File | null = null;
  imagePreview: string | null = null;

  ngOnInit(): void {
    // console.log(" Bắt đầu chạy component post ")
    // Lấy danh sách category
    this.userService.getCategories().subscribe((res) => {
      // console.log(res);
      this.categories = res.rows;
    })
  }

  // Tải ảnh lên
  uploadImage(image: File) {
    this.loading = true;
    this.userService.uploadImage(image).subscribe({
      next: (res) => {
        this.imagePreview = res?.file?.path
          ? environment.cdn.baseimageUrl + res.file.path
          : null;
        this.submitContentForm.get('imagePreview')?.setValue(this.imagePreview);
        this.loading = false;
      },
      error: (err) => {
        this.submitContentForm.get('imagePreview')?.setErrors({ uploadFailed: true });
        this.loading = false;
      }
    })
  }

  // Xử lý khi chọn file
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    this.image = file;
    this.submitContentForm.get('image')?.markAsDirty();
    this.uploadImage(file);
  }

  savePost() {
    //   if (this.fb.valid) {
    //     this.userService.createPost(this.fb.value).subscribe((res) => {
    //       if (res.status === 200 && res.success === 'true') {
    //         this.router.navigate(['/user/post']);
    //       }
    //     })
    //   }
  }

  saveDraft() {

  }
}
