import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DashboardService } from '../../../services/dashboard.service';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../../../services/toast.service';
import { ToastComponent } from '../../../../../layouts/default/partials/toast/toast.component';

@Component({
    selector: 'app-create-language',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, ToastComponent],
    templateUrl: './create.component.html',
    styleUrl: './create.component.scss'
})
export class CreateLanguageComponent implements OnInit {
    @Input() language: any;
    form!: FormGroup;
    isSubmitting = false;

    constructor(
        public activeModal: NgbActiveModal,
        private fb: FormBuilder,
        private dashboardService: DashboardService,
        private toastService: ToastService
    ) { }

    ngOnInit(): void {
        this.initForm();
        if (this.language) {
            this.populateForm();
        }
    }

    initForm(): void {
        this.form = this.fb.group({
            lang_name: ['', [Validators.required, Validators.minLength(5)]],
            lang_code: ['', [Validators.required, Validators.minLength(1)]]
        });
    }

    populateForm(): void {
        this.form.patchValue({
            lang_name: this.language.lang_name,
            lang_code: this.language.lang_code
        });
    }

    get f() {
        return this.form.controls;
    }

    onSubmit(): void {
        this.form.markAllAsTouched();
        if (this.form.invalid) return;

        this.isSubmitting = true;
        const data = this.form.value;

        const request = this.language
            ? this.dashboardService.editLanguage(this.language.id, data)
            : this.dashboardService.createLanguage(data);

        request.subscribe({
            next: (response) => {
                this.isSubmitting = false;
                const msg = this.language ? 'Language updated successfully!' : 'Language created successfully!';
                this.toastService.showMessage('successToast', msg);
                setTimeout(() => {
                    this.activeModal.close(response);
                }, 500);
            },
            error: (error) => {
                this.isSubmitting = false;
                const errorMessage = error?.error?.message || error?.message || 'An error occurred';
                this.toastService.showMessage('errorToast', errorMessage);
            }
        });
    }

    cancel(): void {
        this.activeModal.dismiss('cancel');
    }
}
