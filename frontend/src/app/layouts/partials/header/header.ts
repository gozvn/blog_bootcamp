import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CategoryService } from '../../../modules/category/services/category.service';

@Component({
  selector: 'app-header',
  standalone:true,
  imports: [RouterLink],
  templateUrl: './header.html',
  // styleUrl: './header.scss'
})
export class Header implements OnInit {
  constructor(private categoryService: CategoryService) { }
  listcategories: any[] = [];
  ngOnInit(): void {
    this.categoryService.getCategories().subscribe((categories) => {
      this.listcategories = categories.data.rows;
      // console.log('Categories:', this.listcategories);
    });
  }
}
