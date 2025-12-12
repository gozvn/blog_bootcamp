import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-dashboard-header',
  standalone: true,
  imports: [RouterLink, NgbDropdownModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class DashboardHeaderComponent {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }
  isLoggedIn: boolean = false;
  user: any = null;
  ngOnInit(): void {
    // Lấy thông tin user từ local storage.
    const user = this.authService.getUserInfo();
    if (user) {
      this.isLoggedIn = true;
      this.user = user;
    }
    // console.log('User Info:', user);
  }
  // Log out 
  onLogout() {
    this.authService.logout();
    // Sau logout, chuyển hướng về trang login hoặc homepage
    this.router.navigate(['/auth/login']);
  }

}
