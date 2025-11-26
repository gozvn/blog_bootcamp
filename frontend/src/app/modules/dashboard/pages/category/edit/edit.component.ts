import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DashboardService } from '../../../services/dashboard.service';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../../../services/toast.service';
import { ToastComponent } from '../../../../../layouts/default/partials/toast/toast.component';

@Component({
    selector: 'app-edit-category',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, ToastComponent],
    templateUrl: './edit.component.html',
    styleUrl: './edit.component.scss'
})
export class EditCategoryComponent implements OnInit {
    @Input() category: any;
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
            name: ['', [Validators.required]],
            slug: [''],
            description: ['']
        });
    }

    populateForm(): void {
        if (this.category) {
            // Lưu giá trị ban đầu để so sánh
            this.originalValues = {
                name: this.category.name || '',
                slug: this.category.slug || '',
                description: this.category.description || ''
            };

            // Populate form với dữ liệu category hiện tại
            this.editForm.patchValue({
                name: this.category.name || '',
                slug: this.category.slug || '',
                description: this.category.description || ''
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

        // Kiểm tra name có thay đổi không
        if (this.editForm.value.name && this.editForm.value.name !== this.originalValues.name) {
            formData.name = this.editForm.value.name;
        }

        // Kiểm tra slug có thay đổi không
        if (this.editForm.value.slug && this.editForm.value.slug !== this.originalValues.slug) {
            formData.slug = this.editForm.value.slug;
        }

        // Kiểm tra description có thay đổi không
        if (this.editForm.value.description !== this.originalValues.description) {
            formData.description = this.editForm.value.description;
        }

        // Kiểm tra xem có field nào thay đổi không
        if (Object.keys(formData).length === 0) {
            this.toastService.showMessage('errorToast', 'No changes detected.');
            this.isSubmitting = false;
            return;
        }
        // Gửi request update
        this.dashboardService.editCategory(this.category.id, formData).subscribe({
            next: (response) => {
                this.isSubmitting = false;

                // Hiển thị toast success
                this.toastService.showMessage('successToast', 'Category updated successfully!');

                // Đợi một chút để toast hiển thị trước khi đóng modal
                setTimeout(() => {
                    this.activeModal.close(response);
                }, 500);
            },
            error: (error) => {
                this.isSubmitting = false;
                const errorMessage = error?.error?.message || error?.message || 'Failed to update category.';
                this.toastService.showMessage('errorToast', errorMessage);
            }
        });
    }

    cancel(): void {
        this.activeModal.dismiss('cancel');
    }
}
