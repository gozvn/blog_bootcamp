import { Component, OnInit } from '@angular/core';
import { ToastService } from '../../../../services/toast.service';
import { ToastComponent } from '../../../../layouts/default/partials/toast/toast.component';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../../services/auth.service';
import { UserService } from '../../service/user.service';
import { Header } from '../../../../layouts/default/partials/header/header';
import { Footer } from '../../../../layouts/default/partials/footer/footer';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-editpost',
  standalone: true,
  imports: [Header, Footer, ToastComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './editpost.component.html',
  styleUrl: './editpost.component.scss'
})
export class EditpostComponent implements OnInit {
  editPostForm: FormGroup;
  postId: number = 0;
  tags: any[] = [];
  categories: any[] = [];
  imagePreview: string | null = null;
  loading: boolean = false;

  constructor(
    private toastService: ToastService,
    private authService: AuthService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.editPostForm = new FormGroup({
      title: new FormControl('', [Validators.minLength(3), Validators.maxLength(255)]),
      content: new FormControl('', [Validators.minLength(10)]),
      category: new FormControl('', [Validators.required]),
      thumbnail: new FormControl(''),
      featured: new FormControl(false),
    });
  }

  ngOnInit(): void {
    this.postId = Number(this.route.snapshot.params['id']);
    this.loadCategories();
    this.loadPost();
  }

  loadCategories(): void {
    this.userService.getCategories().subscribe({
      next: (res) => {
        this.categories = res.rows || [];
      },
      error: (err) => {
        this.toastService.showMessage('errorToast', 'Failed to load categories');
      }
    });
  }

  loadPost(): void {
    this.userService.getPostById(this.postId).subscribe({
      next: (res) => {
        if (res) {
          this.editPostForm.patchValue({
            title: res.title || '',
            content: res.content || '',
            category: res.category || '',
            thumbnail: res.thumbnail || '',
            featured: res.featured || false
          });
          this.imagePreview = res.thumbnail || null;
          this.tags = res.tags || [];
        }
      },
      error: (err) => {
        this.toastService.showMessage('errorToast', err?.error?.message || 'Failed to load post');
      }
    });
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.loading = true;
      this.userService.uploadImage(file).subscribe({
        next: (res) => {
          this.loading = false;
          if (res && res.url) {
            this.editPostForm.patchValue({ image: res.url });
            this.imagePreview = res.url;
            this.toastService.showMessage('successToast', 'Image uploaded successfully');
          }
        },
        error: (err) => {
          this.loading = false;
          this.editPostForm.get('image')?.setErrors({ uploadFailed: true });
          this.toastService.showMessage('errorToast', 'Failed to upload image');
        }
      });
    }
  }

  onTagChange(event: any): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      const tagInput = event.target.value.trim();
      if (tagInput && !this.tags.find(t => t.name === tagInput)) {
        this.userService.createTags(tagInput).subscribe({
          next: (res) => {
            if (res) {
              this.tags.push(res);
              event.target.value = '';
            }
          },
          error: (err) => {
            this.toastService.showMessage('errorToast', 'Failed to create tag');
          }
        });
      }
    }
  }

  removeTag(index: number): void {
    this.tags.splice(index, 1);
  }

  submitPost(): void {
    if (this.editPostForm.valid) {
      const postData = {
        ...this.editPostForm.value,
        category: Array.isArray(this.editPostForm.value.category) ? this.editPostForm.value.category : [Number(this.editPostForm.value.category)],
        tags: this.tags.map(t => t.id || t)
      };

      this.userService.editPost(this.postId, postData).subscribe({
        next: (res) => {
          this.toastService.showMessage('successToast', 'Post updated successfully');
          this.router.navigate(['/user']);
        },
        error: (err) => {
          this.toastService.showMessage('errorToast', err?.error?.message || err?.error?.data || 'Failed to update post');
        }
      });
    } else {
      this.toastService.showMessage('errorToast', 'Please fill all required fields');
    }
  }

  submitDraft(): void {
    const postData = {
      ...this.editPostForm.value,
      tags: this.tags.map(t => t.id || t),
      status: 'draft'
    };

    this.userService.editPost(this.postId, postData).subscribe({
      next: (res) => {
        this.toastService.showMessage('successToast', 'Draft saved successfully');
      },
      error: (err) => {
        this.toastService.showMessage('errorToast', err?.error?.message || 'Failed to save draft');
      }
    });
  }
}
