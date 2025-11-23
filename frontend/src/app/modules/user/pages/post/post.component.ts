import { Component, OnInit } from '@angular/core';
import { Footer } from '../../../../layouts/default/partials/footer/footer';
import { Header } from '../../../../layouts/default/partials/header/header';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../service/user.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [Header, Footer, ReactiveFormsModule, CommonModule],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent implements OnInit {
  fb: FormGroup

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.fb = new FormGroup({
      id: new FormControl(''),
      title: new FormControl('', [Validators.required]),
      content: new FormControl('', [Validators.required]),
      category_id: new FormControl('', [Validators.required]),
      tags: new FormControl('', [Validators.required]),
      image: new FormControl('', [Validators.required, Validators.pattern(/\.(jpg|jpeg|png|gif)$/)]),
    })
  }
  categories: any[] = [];
  image: File | null = null;
  imagePreview: string | null = null;

  ngOnInit(): void {
    this.userService.getCategories().subscribe((res) => {
      if (res.status === 200 && res.success === 'true') {
        this.categories = res.rows;
      }
    })
  }

  uploadImage(image: File) {
    this.userService.uploadImage(image).subscribe({
      next: (res) => {
        this.imagePreview = res.data.path || null;
        this.fb.get('image')?.setValue(this.imagePreview);
      },
      error: (err) => {
        this.fb.get('image')?.setErrors({ uploadFailed: true });
      }
    })
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    this.image = file;
    if (file) {
      this.uploadImage(file);
    }
  }

  // savePost() {
  //   if (this.fb.valid) {
  //     this.userService.createPost(this.fb.value).subscribe((res) => {
  //       if (res.status === 200 && res.success === 'true') {
  //         this.router.navigate(['/user/post']);
  //       }
  //     })
  //   }
  // }
}
