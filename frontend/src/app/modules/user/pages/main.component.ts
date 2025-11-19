import { Component, OnInit } from '@angular/core';
import { Header } from '../../../layouts/default/partials/header/header';
import { Footer } from '../../../layouts/default/partials/footer/footer';
import { UserService } from '../service/user.service';
import { AuthService } from '../../../services/auth.service';
import { RouterLink } from '@angular/router';
import { TruncatePipe } from '../../../helper/truncate.pipe';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [Header,Footer,RouterLink, TruncatePipe, CommonModule],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
    
    constructor(
    private userService: UserService,
    private authService: AuthService
    ) {}
    page: number = 1;
    limit: number = 10;
    userInfo: any;
    total: number = 0;
    posts: any[] = [];
    
    ngOnInit(): void {
        this.userInfo = this.authService.getUserInfo();
        this.userService.getPostByUser(this.userInfo.id, this.page, this.limit).subscribe((data) => {
        this.posts = data.rows || [];
        this.page = data.pagination.page;
        this.limit = data.pagination.limit;
        this.total = data.pagination.total;
        console.log("asd", data);
        });
    }

}
