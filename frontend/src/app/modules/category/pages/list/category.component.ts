import { Component } from '@angular/core';
import { Header } from '../../../../layouts/partials/header/header';
import { Footer } from '../../../../layouts/partials/footer/footer';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [Header,Footer, CommonModule],
  templateUrl: './category.component.html',
//   styleUrl: './category.component.scss'
})
export class CategoryComponent {

}
