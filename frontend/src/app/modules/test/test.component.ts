import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TestService } from './test.service';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './test.component.html',
})
export class TestComponent {
  email = '';
  password = '';
  result: any = null;
  loading = false;

  constructor(private testService: TestService) {}

  onSubmit() {
    if (!this.email || !this.password) return;

    this.loading = true;
    this.result = null;

    this.testService.login(this.email, this.password).subscribe({
      next: (res) => {
        this.result = res;
        this.loading = false;
      },
      error: (err) => {
        this.result = err.error || err.message;
        this.loading = false;
      },
    });
  }
}