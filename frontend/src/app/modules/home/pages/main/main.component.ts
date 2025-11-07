import { Component,OnInit } from '@angular/core';
import { HomeService } from '../../services/home.service';

@Component({
  selector: 'app-main',
  standalone:true,
  imports: [],
  templateUrl: './main.component.html',
})

export class mainHome implements OnInit {
  listPost:any = [];
  constructor(private homeService: HomeService) { }

  ngOnInit(): void {
    this.homeService.getPosts(6).subscribe((res: any) => {
      console.log(res);
      this.listPost = res;
    })
  }
}
