import { Component } from '@angular/core';
import { Footer } from '../../../../layouts/default/partials/footer/footer';
import { Header } from '../../../../layouts/default/partials/header/header';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [Header, Footer],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent {

}
