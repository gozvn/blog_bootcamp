import { Component } from '@angular/core';
import { LoginService } from './services/login.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Toast } from 'bootstrap';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
})
export class LoginHome {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  loading: boolean = false;

  constructor(private loginService: LoginService, private router: Router) {}

  private showToast(id: string) {
    const toastEl = document.getElementById(id);
    if (toastEl) {
      const toast = new Toast(toastEl);
      toast.show();
    }
  }

  onSubmit() {
    this.errorMessage = '';
    this.loading = true;
    this.loginService.login(this.email, this.password).subscribe({
      next: (res) => {
        this.loading = false;
        // ✅ Hiện toast success
        const msgEl = document.getElementById('successMessage');
        if (msgEl) msgEl.textContent = 'Đăng nhập thành công!';
        this.showToast('successToast');

        // Sau 1s điều hướng
        setTimeout(() => this.router.navigate(['/dashboard']), 1000);
      },
      error: (err) => {
        this.loading = false;
        const msg = err.error?.message || 'Đăng nhập thất bại';
        this.errorMessage = msg;

        // ✅ Hiện toast error
        const msgEl = document.getElementById('errorMessage');
        if (msgEl) msgEl.textContent = msg;
        this.showToast('errorToast');
      },
    });
  }
}