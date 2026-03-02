import { Component } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastComponent } from '../../../layouts/default/partials/toast/toast.component';
import { CommonModule } from '@angular/common';
import { passwordMatchValidator } from '../../../validations/password.validation';
import { TranslateModule } from '@ngx-translate/core';
import { environment } from '../../../../environments/environment';

declare const google: any;

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RouterLink, CommonModule, ToastComponent, ReactiveFormsModule, TranslateModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  form: FormGroup;
  showPassword = false;
  showconfirmPassword = false;
  googleLoading = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleconfirmPassword() {
    this.showconfirmPassword = !this.showconfirmPassword;
  }

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      terms: [false, [Validators.requiredTrue]],
    },
      { validators: passwordMatchValidator() }
    );
  }

  onSignup(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, username, password } = this.form.value;

    this.authService.signup(email, username, password).subscribe({
      next: async (_response: any) => {
        await this.toastService.showMessage('successToast', 'Signup successful! Please log in.');
        setTimeout(() => this.router.navigate(['/auth/login']), 2000);
      },
      error: async (error: any) => {
        console.error('Signup error:', error);
        if (error.status === 422) {
          if (error.error.data && error.error.data.includes("validation.email.exists")) {
            await this.toastService.showMessage('errorToast', 'Email already exists. Please use a different email.');
          } else {
            await this.toastService.showMessage('errorToast', 'Validation Error! Please check your input fields.');
          }
        } else {
          await this.toastService.showMessage('errorToast', error.error?.message || 'An error occurred during signup. Please try again.');
        }
      }
    });
  }

  /**
   * Mở Google popup để user chọn tài khoản.
   * Nếu email chưa tồn tại → backend tự tạo user mới (signup).
   * Nếu đã tồn tại → login luôn.
   */
  onGoogleLogin(): void {
    if (typeof google === 'undefined') {
      console.error('Google GSI script chưa load xong');
      return;
    }

    try {
      google.accounts.id.initialize({
        client_id: environment.googleClientId,
        callback: (response: any) => this.handleGoogleCredential(response),
        ux_mode: 'popup',
        cancel_on_tap_outside: false,
      });

      google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // Prompt bị suppress → fallback dùng OAuth2 token client
          this.googleLoginFallback();
        }
      });
    } catch (err) {
      console.error('Google init error:', err);
    }
  }

  private googleLoginFallback(): void {
    const client = (google as any).accounts.oauth2.initCodeClient({
      client_id: environment.googleClientId,
      scope: 'email profile openid',
      ux_mode: 'popup',
      callback: (codeResponse: any) => {
        console.warn('Fallback flow: cần xử lý authorization code', codeResponse);
      },
    });
    client.requestCode();
  }

  private handleGoogleCredential(response: any): void {
    const idToken = response?.credential;
    if (!idToken) {
      console.error('Không nhận được credential từ Google');
      return;
    }

    this.googleLoading = true;

    this.authService.googleLogin(idToken).subscribe({
      next: async () => {
        this.googleLoading = false;
        await this.toastService.showMessage('successToast', 'Đăng ký Google thành công!');
        setTimeout(() => this.router.navigate(['/']), 1000);
      },
      error: async (err: any) => {
        this.googleLoading = false;
        console.error('Google signup error:', err);
        await this.toastService.showMessage('errorToast', 'Đăng ký Google thất bại. Vui lòng thử lại.');
      },
    });
  }
}
