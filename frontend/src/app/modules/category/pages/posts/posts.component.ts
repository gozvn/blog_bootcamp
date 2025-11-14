import { Component } from '@angular/core';
import { Header } from '../../../../layouts/partials/header/header';
import { Footer } from '../../../../layouts/partials/footer/footer';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [Header,Footer, CommonModule, RouterLink],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss'
})
export class PostsComponent {

}
