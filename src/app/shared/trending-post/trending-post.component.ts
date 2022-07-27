import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from 'src/app/Services/api-service.service';

@Component({
  selector: 'app-trending-post',
  templateUrl: './trending-post.component.html',
  styleUrls: ['./trending-post.component.scss']
})
export class TrendingPostComponent implements OnInit {
  getCategory:any=[];
  constructor(private __apiservice:ApiServiceService) { }

  ngOnInit(): void {
    this.__apiservice.getAllCategories().subscribe(res => {
      this.getCategory = res;
    })
    setTimeout(() => {
      console.log(this.getCategory)
    }, 1000);
  }

}
