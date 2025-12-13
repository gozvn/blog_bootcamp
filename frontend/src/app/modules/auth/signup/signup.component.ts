import { Component } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastComponent } from '../../../layouts/default/partials/toast/toast.component';
import { CommonModule } from '@angular/common';
import { passwordMatchValidator } from '../../../validations/password.validation';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RouterLink,CommonModule, ToastComponent,ReactiveFormsModule,TranslateModule ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  // Thêm form group để quản lý form đăng ký, loading state và hiển thị mật khẩu
  form: FormGroup;
  showPassword = false;
  showconfirmPassword = false;
  // toggle pass cho mắt hiển thị mật khẩu
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
    // Khởi tạo form với các trường email, username, password và rememberMe
    this.form = this.fb.group({
          email: [ '', [Validators.required, Validators.email]],
          username: ['', [Validators.required]],
          password: ['', [Validators.required, Validators.minLength(6)]],
          confirmPassword: ['', [Validators.required]],
          terms: [false, [Validators.requiredTrue]],
        }, 
        // Thêm validator để kiểm tra mật khẩu có khớp không
        { validators: passwordMatchValidator()
    });
  }

  // Tạo hàm onSignup này để xử lý đăng ký người dùng
  onSignup(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
  }

    const { email, username, password } = this.form.value;

    this.authService.signup(email, username, password).subscribe({
      next: async(response) => {
        await this.toastService.showMessage('successToast', ' Signup successful! Please log in.');
        setTimeout(() => this.router.navigate(['/auth/login']), 2000);
      },
      error: async (error) => {
        console.error('Signup error:', error);
        if (error.status === 422) {
          if (error.error.data && error.error.data.includes("validation.email.exists")) {
            await this.toastService.showMessage('errorToast', 'Email already exists. Please use a different email.');
          } else {
            await this.toastService.showMessage('errorToast', 'Validation Error ! Please check your input fields.');
          }
        } else {
          await this.toastService.showMessage('errorToast',error.error.message || 'An error occurred during signup. Please try again.');
        }
      }

    });

  }
}
