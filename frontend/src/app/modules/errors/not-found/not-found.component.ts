import { Component } from '@angular/core';
import { Header } from '../../../layouts/partials/header/header';
import { Footer } from '../../../layouts/partials/footer/footer';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [Header,Footer],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss'
})
export class NotFoundComponent {

}
