import { Component, Input, OnInit, HostListener, Output, EventEmitter, AfterViewInit, OnChanges } from '@angular/core';
import { ApiServiceService } from 'src/app/Services/api-service.service';

@Component({
  selector: 'app-media-banner',
  templateUrl: './media-banner.component.html',
  styleUrls: ['./media-banner.component.scss']
})
export class MediaBannerComponent implements OnInit , OnChanges {
  @Input() data_input: any;
  moreCheck: boolean = true;
  @Output() ScrollBar = new EventEmitter<boolean>();
  helperArray: any = []
  count: any = 1;
  constructor(private _apiservice : ApiServiceService) { }
  @HostListener("window:scroll", [])
  async OnScroll() {   
    if (this.bottomReached()) {
      // window.scroll(0,600)
      this.count = this.count + 1;
      await this._apiservice.getAllBlogs(this.count).then(res=>{
        this.data_input = [];
        console.log(res);    
        res.data.data.map((blog: any) => {
          this.data_input.push(blog);
        })
      })
      this.data_input.map((res:any)=>{
        this.helperArray.push(res)
      })
    }  
  }
  bottomReached(): boolean {
    // console.log((window.innerHeight,  window.scrollY) ,document.body.offsetHeight)
    var pageHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight,  document.documentElement.clientHeight,  document.documentElement.scrollHeight,  document.documentElement.offsetHeight );
    return (window.innerHeight + window.scrollY + 1) >= pageHeight;
  }
  ngOnInit(): void {
    console.log("this.data_input",this.data_input);
    this.helperArray = [];
    this.data_input.map((res: any) => {
      this.helperArray.push(res);
    })
    console.log(this.helperArray);
  }

  ngOnChanges(): void {
    console.log(this.data_input);
    this.helperArray = [];
    this.helperArray = this.data_input;
  }

}
