import { Component } from '@angular/core';
import { LoginService } from './services/login.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

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

  onSubmit() {
    this.errorMessage = '';
    this.loading = true;
    this.loginService.login(this.email, this.password).subscribe({
      next: (res) => {
        this.loading = false;
        // Giả sử login thành công, chuyển hướng dashboard hoặc trang chính
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Đăng nhập thất bại';
      },
    });
  }
}