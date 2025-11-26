import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DashboardService } from '../../../services/dashboard.service';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../../../services/toast.service';
import { ToastComponent } from '../../../../../layouts/default/partials/toast/toast.component';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ToastComponent],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent implements OnInit {
  @Input() user: any;
  editForm!: FormGroup;
  isSubmitting = false;
  originalValues: any = {};

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private dashboardService: DashboardService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.populateForm();
  }

  initForm(): void {
    this.editForm = this.fb.group({
      username: [''],
      email: ['', [Validators.email]],
      role: [''],
      password: ['', [Validators.minLength(6)]]
    });
  }

  populateForm(): void {
    if (this.user) {
      // Lưu giá trị ban đầu để so sánh
      this.originalValues = {
        username: this.user.username || '',
        email: this.user.email || '',
        role: this.user.role || ''
      };

      // Populate form với dữ liệu user hiện tại
      this.editForm.patchValue({
        username: this.user.username || '',
        email: this.user.email || '',
        role: this.user.role || '',
        password: '' // Password luôn để trống
      });
    }
  }

  get f() {
    return this.editForm.controls;
  }

  onSubmit(): void {
    // Mark all fields as touched để hiển thị validation errors
    this.editForm.markAllAsTouched();

    // Kiểm tra validation
    if (this.editForm.invalid) {
      return;
    }

    this.isSubmitting = true;

    // Chỉ gửi các field đã thay đổi
    const formData: any = {};

    // Kiểm tra username có thay đổi không
    if (this.editForm.value.username && this.editForm.value.username !== this.originalValues.username) {
      formData.username = this.editForm.value.username;
    }

    // Kiểm tra email có thay đổi không
    if (this.editForm.value.email && this.editForm.value.email !== this.originalValues.email) {
      formData.email = this.editForm.value.email;
    }

    // Kiểm tra role có thay đổi không
    if (this.editForm.value.role && this.editForm.value.role !== this.originalValues.role) {
      formData.role = this.editForm.value.role;
    }

    // Password: chỉ gửi nếu user đã nhập
    if (this.editForm.value.password && this.editForm.value.password.trim() !== '') {
      formData.password = this.editForm.value.password;
    }

    // Kiểm tra xem có field nào thay đổi không
    if (Object.keys(formData).length === 0) {
      this.toastService.showMessage('errorToast', 'No changes detected.');
      this.isSubmitting = false;
      return;
    }

    // Thêm updatedAt với timestamp hiện tại
    formData.updated_at = new Date().toISOString();

    // Gửi request update
    this.dashboardService.editUser(this.user.id, formData).subscribe({
      next: (response) => {
        this.isSubmitting = false;

        // Hiển thị toast success
        this.toastService.showMessage('successToast', 'User updated successfully!');

        // Đợi một chút để toast hiển thị trước khi đóng modal
        setTimeout(() => {
          this.activeModal.close(response);
        }, 1000);
      },
      error: (error) => {
        this.isSubmitting = false;
        const errorMessage = error?.error?.message || error?.message || 'Failed to update user.';
        this.toastService.showMessage('errorToast', errorMessage);
      }
    });
  }

  cancel(): void {
    this.activeModal.dismiss('cancel');
  }
}
