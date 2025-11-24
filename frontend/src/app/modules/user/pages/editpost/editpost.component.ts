import { Component } from '@angular/core';
import { DashboardHeaderComponent } from '../../../../layouts/dashboard/header/header.component';
import { DashboardSidebarComponent } from '../../../../layouts/dashboard/sidebar/sidebar.component';
import { DashboardFooterComponent } from '../../../../layouts/dashboard/footer/footer.component';
import { ToastService } from '../../../../services/toast.service';
import { ToastComponent } from '../../../../layouts/default/partials/toast/toast.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../services/auth.service';
import { UserService } from '../../service/user.service'

@Component({
  selector: 'app-editpost',
  standalone: true,
  imports: [DashboardHeaderComponent, DashboardSidebarComponent, DashboardFooterComponent, ToastComponent],
  templateUrl: './editpost.component.html',
  styleUrl: './editpost.component.scss'
})
export class EditpostComponent {
  constructor(private toastService: ToastService) { }

}
