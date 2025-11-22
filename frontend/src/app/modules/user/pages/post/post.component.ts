import { Component } from '@angular/core';
import { Footer } from '../../../../layouts/default/partials/footer/footer';
import { Header } from '../../../../layouts/default/partials/header/header';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [Header, Footer],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent {
  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) { }
  categories: any[] = [];

  ngOnInit(): void {
    this.userService.getCategories().subscribe((res) => {
      this.categories = res.rows;
    })
  }
}
