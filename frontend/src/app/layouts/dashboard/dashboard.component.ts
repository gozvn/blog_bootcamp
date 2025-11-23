import { Component } from '@angular/core';
import { DashboardHeaderComponent } from './header/header.component';
import { DashboardSidebarComponent } from './sidebar/sidebar.component';
import { DashboardFooterComponent } from './footer/footer.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DashboardHeaderComponent, DashboardSidebarComponent, DashboardFooterComponent, RouterOutlet],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
