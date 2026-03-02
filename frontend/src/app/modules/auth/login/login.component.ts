import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';
import { ToastComponent } from '../../../layouts/default/partials/toast/toast.component';
import { TranslateModule } from '@ngx-translate/core';
import { environment } from '../../../../environments/environment';

// Khai báo để TypeScript biết window.google tồn tại (inject từ GSI script)
declare const google: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ToastComponent, RouterLink, TranslateModule],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  googleLoading = false;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false],
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.form.disable();

    const { email, password } = this.form.value;

    this.authService.login(email, password).subscribe({
      next: async (res) => {
        this.loading = false;
        this.form.enable();
        await this.toastService.showMessage('successToast', 'Success! Logged in');
        setTimeout(() => this.router.navigate(['/']), 1000);
      },
      error: async (err) => {
        this.loading = false;
        this.form.enable();
        const errdata = err.error.data;
        let msg = "Failed to login. Please try again.";
        if (errdata === 'validation.email' || errdata === 'validation.password') {
          msg = "Invalid email or password";
        }
        console.error('Login error:', err);
        await this.toastService.showMessage('errorToast', msg);
      },
    });
  }

  /**
   * Mở Google popup để user chọn tài khoản.
   * Sau khi chọn xong, Google trả về credential (id_token)
   * → gửi lên backend để verify và login.
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
          console.warn('Google prompt bị suppress:', notification.getNotDisplayedReason() || notification.getSkippedReason());
          this.toastService.showMessage('errorToast', 'Popup bị chặn. Vui lòng tắt trình chặn popup và thử lại.');
        }
      });
    } catch (err) {
      console.error('Google init error:', err);
    }
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
        await this.toastService.showMessage('successToast', 'Đăng nhập Google thành công!');
        setTimeout(() => this.router.navigate(['/']), 1000);
      },
      error: async (err: any) => {
        this.googleLoading = false;
        console.error('Google login error:', err);
        await this.toastService.showMessage('errorToast', 'Đăng nhập Google thất bại. Vui lòng thử lại.');
      },
    });
  }
}
