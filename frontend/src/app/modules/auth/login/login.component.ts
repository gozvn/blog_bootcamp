import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';
import { ToastComponent } from '../../../layouts/default/partials/toast/toast.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ToastComponent, RouterLink],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  form!: FormGroup;
  loading = false;
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
}
