import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Toast } from 'bootstrap';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login', // Selector component
  standalone: true, // Component độc lập
  imports: [ReactiveFormsModule, CommonModule], // Module import
  templateUrl: './login.component.html', // Template URL
})
export class LoginComponent {
  form: FormGroup; // Form group
  loading = false; // Trạng thái loading
  showPassword = false; // Hiển thị mật khẩu

  /**
   * Constructor
   * @param fb - FormBuilder
   * @param authService - AuthService
   * @param router - Router
   */
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]], // Email
      password: ['', [Validators.required]], // Mật khẩu
      rememberMe: [false], // Ghi nhớ đăng nhập
    });
  }

  /**
   * Hiển thị toast
   */
  private showToast(id: string) {
    const toastEl = document.getElementById(id);
    if (toastEl) {
      const toast = new Toast(toastEl);
      toast.show();
    }
  }

  /**
   * Chuyển trạng thái hiển thị mật khẩu
   */
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  /**
   * Submit form
   */
  // Hàm xử lý form submit
  onSubmit() {
    // Kiểm tra form có hợp lệ hay không, nếu không hợp lệ thì đánh dấu tất cả các control touched và thoát
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // Đặt trạng thái loading = true
    this.loading = true;

    // Lấy giá trị của email và password từ form
    const { email, password } = this.form.value;

    // Gọi hàm login của authService và đăng ký callback
    this.authService.login(email, password).subscribe({
      // Nếu login thành công
      next: (res) => {
        // Đặt trạng thái loading = false
        this.loading = false;
        console.log(res);
        // Lấy thẻ HTML với id 'successMessage' và gán văn bản 'Đăng nhập thành công!'
        const msgEl = document.getElementById('successMessage');
        if (msgEl) msgEl.textContent = 'Success !! Logged in';

        // Hiển thị toast thông báo thành công
        this.showToast('successToast');

        // Sau 1 giây chuyển hướng đến trang dashboard
        setTimeout(() => this.router.navigate(['/dashboard']), 1000);
      },
      // Nếu login thất bại
      error: (err) => {
        // Đặt trạng thái loading = false
        this.loading = false;

        // Lấy thông báo lỗi từ response hoặc trả về 'Đăng nhập thất bại'
        const msg = err.error?.message || 'Failed to login';

        // Lấy thẻ HTML với id 'errorMessage' và gán văn bản thông báo lỗi
        const msgEl = document.getElementById('errorMessage');
        if (msgEl) msgEl.textContent = msg;

        // Hiển thị toast thông báo lỗi
        this.showToast('errorToast');
      },
    });
  }
}