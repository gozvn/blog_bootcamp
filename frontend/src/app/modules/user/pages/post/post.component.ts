import { Component, OnInit } from '@angular/core';
import { Footer } from '../../../../layouts/default/partials/footer/footer';
import { Header } from '../../../../layouts/default/partials/header/header';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../service/user.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { environment } from '../../../../../environments/environment.prod';
import { ToastService } from '../../../../services/toast.service';
import { ToastComponent } from '../../../../layouts/default/partials/toast/toast.component';
import { ModalService } from '../../../../services/modal.service';
import { AuthService } from '../../../../services/auth.service';
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [Header, Footer, ReactiveFormsModule, CommonModule, ToastComponent, QuillModule],
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  // Khởi tạo form  submitContentForm từ FormGroup
  submitContentForm: FormGroup
  loading: boolean = false;
  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private modalService: ModalService,
    private authService: AuthService
  ) {
    this.submitContentForm = new FormGroup({
      id: new FormControl(''),
      featured: new FormControl(false),
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
  tags: any[] = [];
  tagName: string = '';
  tagId: number = 0;
  userInfo: any;

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

  // Xử lý khi chọn tag
  onTagChange(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    // Lấy giá trị tag từ Enter 
    const tag = input.value.trim();
    if ((event.key === 'Enter' || event.key === ',') && input) {
      event.preventDefault(); // ngăn form submit hoặc dấu , xuất hiện trong input
      this.addTag(tag);
      input.value = '';
    }
  }

  addTag(tag: string) {
    this.userService.createTags(tag).subscribe((res) => {
      // console.log(res);
      this.tagName = res.name;
      this.tagId = res.id;
      this.tags.push({ id: this.tagId, name: this.tagName });
      this.submitContentForm.get('tags')?.setValue(this.tags);
      this.submitContentForm.get('tags')?.markAsDirty();
    })
  }

  removeTag(index: number) {
    this.tags.splice(index, 1);
    this.submitContentForm.get('tags')?.setValue(this.tags); // cập nhật form control
  }

  savePost() {
    // Prepare data for submission
    const formValue = this.submitContentForm.value;
    this.userInfo = this.authService.getUserInfo();

    // Validate category_id
    if (!formValue.category_id) {
      this.toastService.showMessage('errorToast', 'Please select a category');
      return;
    }

    // Validate tags
    if (!this.tags || this.tags.length === 0) {
      this.toastService.showMessage('errorToast', 'Please add at least one tag');
      return;
    }

    // Validate image
    if (!this.imagePreview) {
      this.toastService.showMessage('errorToast', 'Please upload an image');
      return;
    }

    const postData = {
      title: formValue.title,
      content: formValue.content,
      thumbnail: this.imagePreview,
      status: 'published',
      featured: formValue.featured || false,
      category: [parseInt(formValue.category_id)],
      lang_id: 1,
      user_id: this.userInfo.id,
      tags: this.tags.map(tag => tag.id)
    };

    // Submit to backend
    this.userService.createPost(postData).subscribe({
      next: (res) => {
        this.toastService.showMessage('successToast', 'Post created successfully');
        this.router.navigate(['/user']);
      },
      error: (err) => {
        console.error('Error creating post:', err);
        this.toastService.showMessage('errorToast', 'Failed to create post. Please try again.');
      }
    });
  }

  saveDraft() {
    // Similar to savePost but with status = 'draft'
    if (!this.submitContentForm.get('title')?.value) {
      this.toastService.showMessage('errorToast', 'Please enter a title for the draft');
      return;
    }
    this.userInfo = this.authService.getUserInfo();
    const formValue = this.submitContentForm.value;

    const draftData = {
      title: formValue.title,
      content: formValue.content || '',
      thumbnail: this.imagePreview || '',
      status: 'draft',
      featured: formValue.featured || false,
      category: formValue.category_id ? [parseInt(formValue.category_id)] : [],
      lang_id: 1,
      user_id: this.userInfo.id, // TODO: Get from auth service
      tags: this.tags.map(tag => tag.id)
    };

    console.log('Saving draft:', draftData);

    this.userService.createPost(draftData).subscribe({
      next: (res) => {
        console.log('Draft saved successfully:', res);
        this.toastService.showMessage('successToast', 'Draft saved successfully');
        this.router.navigate(['/user']);
      },
      error: (err) => {
        console.error('Error saving draft:', err);
        this.toastService.showMessage('errorToast', 'Failed to save draft. Please try again.');
      }
    });
  }

  submitPost() {
    this.modalService.confirm({
      title: 'Confirm',
      message: 'Are you sure you want to submit this post?',
      confirmText: 'Submit',
      cancelText: 'Cancel',
      status: 'warning'
    }).then((result) => {
      if (result) {
        this.savePost();
      }
    });
  }

  submitDraft() {
    this.modalService.confirm({
      title: 'Confirm',
      message: 'Are you sure you want to submit this draft?',
      confirmText: 'Submit',
      cancelText: 'Cancel',
      status: 'warning'
    }).then((result) => {
      if (result) {
        this.saveDraft();
      }
    });
  }




}
