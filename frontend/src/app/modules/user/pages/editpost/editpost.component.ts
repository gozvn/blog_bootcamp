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
import { QuillModule } from 'ngx-quill';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-editpost',
  standalone: true,
  imports: [Header, Footer, ToastComponent, ReactiveFormsModule, CommonModule, QuillModule, TranslateModule],
  templateUrl: './editpost.component.html',
  styleUrl: './editpost.component.scss'
})
export class EditpostComponent implements OnInit {
  editPostForm: FormGroup;
  postId: number = 0;
  tags: any[] = [];
  categories: any[] = [];
  languages: any[] = [];
  imagePreview: string | null = null;
  loading: boolean = false;

  // Cấu hình Quill Editor
  quillConfig = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ 'header': 1 }, { 'header': 2 }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'script': 'sub' }, { 'script': 'super' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['clean'],
      ['link', 'image', 'video']
    ]
  };

  constructor(
    private toastService: ToastService,
    private authService: AuthService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService
  ) {
    this.editPostForm = new FormGroup({
      title: new FormControl('', [Validators.minLength(3), Validators.maxLength(255)]),
      content: new FormControl('', [Validators.minLength(10)]),
      category: new FormControl('', [Validators.required]),
      lang_id: new FormControl('', [Validators.required]),
      thumbnail: new FormControl(''),
      featured: new FormControl(false),
    });
  }

  ngOnInit(): void {
    this.postId = Number(this.route.snapshot.params['id']);
    this.loadCategories();
    this.loadLanguages();
    this.loadPost();
  }

  loadCategories(): void {
    this.userService.getCategories().subscribe({
      next: (res) => {
        this.categories = res.rows || [];
      },
      error: (err) => {
        this.toastService.showMessage('errorToast', this.translate.instant('USER.LOAD_CATEGORIES_FAILED'));
      }
    });
  }

  loadLanguages(): void {
    this.userService.getLanguages().subscribe({
      next: (res) => {
        this.languages = res.rows || [];
      },
      error: (err) => {
        this.toastService.showMessage('errorToast', this.translate.instant('USER.LOAD_LANGUAGES_FAILED'));
      }
    });
  }

  loadPost(): void {
    this.userService.getPostById(this.postId).subscribe({
      next: (res) => {
        if (res) {
          const categoryId = res.categories && res.categories.length > 0 ? res.categories[0].id : '';
          this.editPostForm.patchValue({
            title: res.title || '',
            content: res.content || '',
            category: categoryId,
            lang_id: res.lang_id || res.language_id || '',
            thumbnail: res.thumbnail || '',
            featured: res.featured || false
          });
          this.imagePreview = res.thumbnail || null;
          this.tags = res.tags || [];
        }
      },
      error: (err) => {
        this.toastService.showMessage('errorToast', err?.error?.message || this.translate.instant('USER.LOAD_POST_FAILED'));
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
            this.editPostForm.patchValue({ thumbnail: res.url });
            this.imagePreview = res.url;
            this.toastService.showMessage('successToast', this.translate.instant('USER.IMAGE_UPLOADED'));
          }
        },
        error: (err) => {
          this.loading = false;
          this.editPostForm.get('thumbnail')?.setErrors({ uploadFailed: true });
          this.toastService.showMessage('errorToast', this.translate.instant('USER.UPLOAD_FAILED'));
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
            this.toastService.showMessage('errorToast', this.translate.instant('USER.CREATE_TAG_FAILED'));
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
          this.toastService.showMessage('successToast', this.translate.instant('USER.POST_UPDATED'));
          this.router.navigate(['/user']);
        },
        error: (err) => {
          this.toastService.showMessage('errorToast', err?.error?.message || err?.error?.data || this.translate.instant('USER.UPDATE_FAILED'));
        }
      });
    } else {
      this.toastService.showMessage('errorToast', this.translate.instant('USER.FILL_REQUIRED_FIELDS'));
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
        this.toastService.showMessage('successToast', this.translate.instant('USER.DRAFT_SAVED'));
      },
      error: (err) => {
        this.toastService.showMessage('errorToast', err?.error?.message || this.translate.instant('USER.DRAFT_SAVE_FAILED'));
      }
    });
  }
}
