import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DashboardService } from '../../../services/dashboard.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent implements OnInit {
  @Input() user: any;
  editForm!: FormGroup;
  isSubmitting = false;
  errorMessage = '';

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private dashboardService: DashboardService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.editForm = this.fb.group({
      email: [this.user?.email || '', [Validators.required, Validators.email]],
      role: [this.user?.role || '', Validators.required],
      password: ['', [Validators.minLength(6)]] // Optional, only if changing
    });
  }

  get f() {
    return this.editForm.controls;
  }

  onSubmit(): void {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const formData = {
      email: this.editForm.value.email,
      role: this.editForm.value.role,
      ...(this.editForm.value.password && { password: this.editForm.value.password })
    };

    this.dashboardService.editUser(this.user.id, formData).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.activeModal.close(response);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = error.error?.message || 'Failed to update user. Please try again.';
        console.error('Error updating user:', error);
      }
    });
  }

  cancel(): void {
    this.activeModal.dismiss('cancel');
  }
}
