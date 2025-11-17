import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CategoryService } from '../../../modules/category/services/category.service';
import { AuthService } from '../../../modules/auth/services/auth.service';

@Component({
  selector: 'app-header',
  standalone:true,
  imports: [RouterLink],
  templateUrl: './header.html',
  // styleUrl: './header.scss'
})
export class Header implements OnInit {
  constructor(private categoryService: CategoryService, private authService: AuthService) { }
  listcategories: any[] = [];
  isLoggedIn: boolean = false;
  user: any = null;
  ngOnInit(): void {
    // Lấy danh sách category từ CategoryService khi khởi tạo component.
    this.categoryService.getCategories().subscribe((categories) => {
      this.listcategories = categories.data.rows;
      // console.log('Categories:', this.listcategories);
    });

    // Lấy thông tin user từ local storage.
    const user = this.authService.getUserInfo();
    if (user) {
      this.isLoggedIn = true;
      this.user = user;
    }
    
    // console.log('User Info:', user);
  }
}
