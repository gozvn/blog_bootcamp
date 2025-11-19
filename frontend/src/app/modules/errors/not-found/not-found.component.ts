import { Component } from '@angular/core';
import { Header } from '../../../layouts/default/partials/header/header';
import { Footer } from '../../../layouts/default/partials/footer/footer';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [Header,Footer],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss'
})
export class NotFoundComponent {

}
