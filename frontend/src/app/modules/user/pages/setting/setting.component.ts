import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Header } from '../../../../layouts/default/partials/header/header';
import { Footer } from '../../../../layouts/default/partials/footer/footer';
import { ToastComponent } from '../../../../layouts/default/partials/toast/toast.component';
import { ToastService } from '../../../../services/toast.service';
import { AuthService } from '../../../../services/auth.service';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-setting',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Header, Footer, ToastComponent, TranslateModule],
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.scss'
})
export class SettingComponent implements OnInit {
  settingsForm: FormGroup;
  userId: number = 0;
  languages: any[] = [];
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private toastService: ToastService,
    private router: Router,
    private translate: TranslateService
  ) {
    this.settingsForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      lang_id: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.minLength(6)]),
      confirmPassword: new FormControl('')
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    const currentUser = this.authService.getUserInfo();
    if (currentUser && currentUser.id) {
      this.userId = currentUser.id;
      this.loadLanguages();
      this.loadUserProfile();
    } else {
      this.router.navigate(['/auth/login']);
    }
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    // Only validate match if password is provided
    if (password && password.value && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    // If we have errors on confirmPassword but they match now (or password empty), clear error
    if (confirmPassword?.hasError('passwordMismatch')) {
      confirmPassword.setErrors(null);
    }

    return null;
  }

  loadLanguages(): void {
    this.userService.getLanguages().subscribe({
      next: (res) => {
        this.languages = res.rows || [];
      },
      error: (err) => {
        console.error('Failed to load languages', err);
      }
    });
  }

  loadUserProfile(): void {
    this.userService.getUserById(this.userId).subscribe({
      next: (res) => {
        if (res) {
          this.settingsForm.patchValue({
            username: res.username,
            email: res.email,
            lang_id: res.lang_id
          });
        }
      },
      error: (err) => {
        this.toastService.showMessage('errorToast', this.translate.instant('SETTINGS.UPDATE_FAILED'));
      }
    });
  }

  updateSettings(): void {
    if (this.settingsForm.valid) {
      const payload: any = {};

      // Explicitly check for dirty controls to only send changed data
      Object.keys(this.settingsForm.controls).forEach(key => {
        const control = this.settingsForm.get(key);
        if (control?.dirty) {
          payload[key] = control.value;
        }
      });

      // Remove confirmPassword from payload if it got in there
      if (payload.confirmPassword !== undefined) {
        delete payload.confirmPassword;
      }

      // Use helper to check for empty payload
      // But also check if password is just empty string (which means it wasn't really "changed" to a new valid password)
      if (payload.password === '') {
        delete payload.password;
      }

      if (Object.keys(payload).length === 0) {
        this.toastService.showMessage('warningToast', this.translate.instant('SETTINGS.NO_CHANGES'));
        // Reset the form state to pristine to reflect "saved" state of what's currently there
        this.settingsForm.markAsPristine();
        return;
      }

      this.loading = true;
      this.userService.updateUser(this.userId, payload).subscribe({
        next: (res) => {
          this.loading = false;
          // Use message from backend if available, otherwise default
          const message = res?.message || this.translate.instant('SETTINGS.PROFILE_UPDATED');
          this.toastService.showMessage('successToast', message);

          // Update local storage
          const currentUser = this.authService.getUserInfo();
          if (currentUser) {
            if (payload.username) currentUser.username = payload.username;
            if (payload.email) currentUser.email = payload.email;
            // lang_id or other fields if stored in user object
            localStorage.setItem('user', JSON.stringify(currentUser));
          }

          // Clear password fields and reset form state
          if (payload.password) {
            this.settingsForm.patchValue({
              password: '',
              confirmPassword: ''
            });
          }
          this.settingsForm.markAsPristine();
        },
        error: (err) => {
          this.loading = false;
          this.toastService.showMessage('errorToast', err?.error?.message || this.translate.instant('SETTINGS.UPDATE_FAILED'));
        }
      });
    } else {
      this.settingsForm.markAllAsTouched();
      this.toastService.showMessage('errorToast', this.translate.instant('USER.FILL_REQUIRED_FIELDS'));
    }
  }
}
