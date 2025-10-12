import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../partials/header/header';
import { Footer } from '../partials/footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Header,Footer],
  templateUrl: './default.component.html',
  styleUrl: './default.component.scss'
})
export class defaultLayout {
  title = 'Hello world ';
}
