import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DashboardService } from '../../../services/dashboard.service';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../../../services/toast.service';
import { ToastComponent } from '../../../../../layouts/default/partials/toast/toast.component';

@Component({
    selector: 'app-add-category',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, ToastComponent],
    templateUrl: './add.component.html',
    styleUrl: './add.component.scss'
})
export class AddCategoryComponent implements OnInit {
    addForm!: FormGroup;
    isSubmitting = false;

    constructor(
        public activeModal: NgbActiveModal,
        private fb: FormBuilder,
        private dashboardService: DashboardService,
        private toastService: ToastService
    ) { }

    ngOnInit(): void {
        this.initForm();
    }

    initForm(): void {
        this.addForm = this.fb.group({
            name: ['', [Validators.required]],
            slug: [''],
            description: ['', [Validators.minLength(11)]]
        });
    }

    get f() {
        return this.addForm.controls;
    }

    onSubmit(): void {
        // Mark all fields as touched để hiển thị validation errors
        this.addForm.markAllAsTouched();

        // Kiểm tra validation
        if (this.addForm.invalid) {
            return;
        }

        this.isSubmitting = true;

        // Chuẩn bị dữ liệu để gửi
        const formData: any = {
            name: this.addForm.value.name
        };

        // Thêm slug nếu có
        if (this.addForm.value.slug) {
            formData.slug = this.addForm.value.slug;
        }

        // Thêm description nếu có
        if (this.addForm.value.description) {
            formData.description = this.addForm.value.description;
        }

        // Gửi request tạo category mới
        this.dashboardService.addCategory(formData).subscribe({
            next: (response) => {
                this.isSubmitting = false;

                // Hiển thị toast success
                this.toastService.showMessage('successToast', 'Category created successfully!');

                // Đợi một chút để toast hiển thị trước khi đóng modal
                setTimeout(() => {
                    this.activeModal.close(response);
                }, 500);
            },
            error: (error) => {
                this.isSubmitting = false;
                const errorMessage = error?.error?.message || error?.message || 'Failed to create category.';
                this.toastService.showMessage('errorToast', errorMessage);
            }
        });
    }

    cancel(): void {
        this.activeModal.dismiss('cancel');
    }
}
