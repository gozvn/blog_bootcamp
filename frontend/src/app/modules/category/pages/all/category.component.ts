import { Component } from '@angular/core';
import { Header } from '../../../../layouts/partials/header/header';
import { Footer } from '../../../../layouts/partials/footer/footer';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../services/category.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [Header,Footer, CommonModule, RouterLink],
  templateUrl: './category.component.html',
//   styleUrl: './category.component.scss'
})
export class CategoryComponent {
  constructor(private categoryService: CategoryService) { }
    listcategories: any[] = [];
    ngOnInit(): void {
      this.categoryService.getCategories().subscribe((categories) => {
        this.listcategories = categories.data.rows;
        // console.log('Categories:', this.listcategories);
      });
    }
}
