import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CategoryService } from '../../../../modules/category/services/category.service';
import { AuthService } from '../../../../services/auth.service';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { AppTranslateService } from '../../../../services/translate.service';
import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, NgbDropdownModule, TranslatePipe, TranslateDirective, ReactiveFormsModule],
  templateUrl: './header.html',
  // styleUrl: './header.scss'
})
export class Header implements OnInit {

  searchForm: FormGroup;
  mobileSearchForm: FormGroup;

  constructor(
    private categoryService: CategoryService,
    private authService: AuthService,
    private router: Router,
    private translateService: AppTranslateService
  ) {
    this.searchForm = new FormGroup({
      keyword: new FormControl('')
    });
    this.mobileSearchForm = new FormGroup({
      keyword: new FormControl('')
    });
  }

  listcategories: any[] = [];
  isLoggedIn: boolean = false;
  user: any = null;
  languages: any[] = [];

  ngOnInit(): void {
    this.loadLanguages();
    // Lấy danh sách category từ CategoryService khi khởi tạo component.
    this.categoryService.getCategories().subscribe((categories) => {
      this.listcategories = categories.data.rows;
    });

    // Lấy thông tin user từ local storage.
    const user = this.authService.getUserInfo();
    if (user) {
      this.isLoggedIn = true;
      this.user = user;
    }
  }
  // Log out 
  onLogout() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.user = null;
    // Sau logout, chuyển hướng về trang login hoặc homepage
    this.router.navigate(['/']);
  }

  loadLanguages() {
    this.translateService.getLanguages().subscribe((languages) => {
      this.languages = languages.data.rows;
    });
  }

  changeLanguage(lang: string) {
    this.translateService.setLanguage(lang);
    window.location.reload();
  }

  get currentLanguage() {
    const currentCode = this.translateService.getLanguage();
    return this.languages.find(l => l.lang_code === currentCode) || { lang_name: 'English', lang_code: 'us' };
  }

  getFlag(code: string) {
    if (code === 'en') return 'us';
    return code;
  }

  onSearch(isMobile: boolean = false): void {
    const form = isMobile ? this.mobileSearchForm : this.searchForm;
    const keyword = form.get('keyword')?.value?.trim();
    
    if (keyword) {
      this.router.navigate(['/search'], { queryParams: { q: keyword } });
      // Reset form after search
      form.reset();
      
      // Close mobile menu if searching from mobile
      if (isMobile) {
        const offcanvas = document.getElementById('offcanvasNavbar');
        if (offcanvas) {
          const bsOffcanvas = (window as any).bootstrap?.Offcanvas?.getInstance(offcanvas);
          if (bsOffcanvas) {
            bsOffcanvas.hide();
          }
        }
      }
    }
  }

  onSearchKeyPress(event: KeyboardEvent, isMobile: boolean = false): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.onSearch(isMobile);
    }
  }

}
