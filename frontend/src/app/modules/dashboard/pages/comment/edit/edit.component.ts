import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DashboardService } from '../../../services/dashboard.service';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../../../services/toast.service';
import { ToastComponent } from '../../../../../layouts/default/partials/toast/toast.component';

@Component({
    selector: 'app-edit-comment',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, ToastComponent],
    templateUrl: './edit.component.html',
    styleUrl: './edit.component.scss'
})
export class EditCommentComponent implements OnInit {
    @Input() comment: any;
    editForm!: FormGroup;
    isSubmitting = false;
    originalContent: string = '';

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
            content: ['', [Validators.required, Validators.minLength(10)]]
        });
    }

    populateForm(): void {
        if (this.comment) {
            this.originalContent = this.comment.content || '';
            this.editForm.patchValue({
                content: this.comment.content || ''
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

        // Kiểm tra xem có thay đổi không
        if (this.editForm.value.content === this.originalContent) {
            this.toastService.showMessage('errorToast', 'No changes detected.');
            return;
        }

        this.isSubmitting = true;

        // Gửi request update
        this.dashboardService.editComment(this.comment.id, { content: this.editForm.value.content }).subscribe({
            next: (response) => {
                this.isSubmitting = false;

                // Hiển thị toast success
                this.toastService.showMessage('successToast', 'Comment updated successfully!');

                // Đợi một chút để toast hiển thị trước khi đóng modal
                setTimeout(() => {
                    this.activeModal.close(response);
                }, 500);
            },
            error: (error) => {
                this.isSubmitting = false;
                const errorMessage = error?.error?.message || error?.message || 'Failed to update comment.';
                this.toastService.showMessage('errorToast', errorMessage);
            }
        });
    }

    cancel(): void {
        this.activeModal.dismiss('cancel');
    }
}
