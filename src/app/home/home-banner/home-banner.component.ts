import { ViewportScroller } from '@angular/common';
import { Component, OnInit, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { ApiServiceService } from 'src/app/Services/api-service.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-home-banner',
  templateUrl: './home-banner.component.html',
  styleUrls: ['./home-banner.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomeBannerComponent implements OnInit {
  imageurl = environment.assetsurl;
  newsletter_email: any;
  resSignupMsg:string=''
  resSignupMsgCheck:string=''
  showGlobalSearchSuggestion: boolean = false;
  @Output() newItemEvent = new EventEmitter<string>();
  searchItem: string = '';
  homePageData: any;
  subjectBehaviourResponse: any = [];
  slug: any;
  subslug: any;
  suggestionList: any = []
  showMsg: boolean = false;
  msg: any = '';
  constructor(public _ApiService: ApiServiceService, private scroller: ViewportScroller) { }
  action_array = [
    {
      imgurl: "assets/askchemist.jpeg",
      heading: "Ask The Chemist",
      content: "Need a technical question answered?",
      route: "contact/ask-the-chemist"
    },
    {
      imgurl: "assets/2847970.jpeg",
      heading: "Pricing",
      content: "Bulk pricing is available for 12, 24 or more drums",
      route: "shop"
    },
    {
      imgurl: "assets/Ecolink.jpg",
      heading: "Ecolink",
      content: "Providing Lean(er) chemical solutions for next gen",
      route: "info"
    },
    {
      imgurl: "assets/abouus.jpg",
      heading: "About Us",
      content: "Supplying degreasers internationally for over 30 years",
      route: "about-us"
    },
    {
      imgurl: "assets/manufacturing.jpg",
      heading: "Ecolink Manufacturing",
      content: "Ecolink’s successful work in the manufacturing sector",
      route: "manufacture"
    },
    {
      imgurl: "assets/services.jpeg",
      heading: "Our Services",
      content: "Services and Marketing",
      route: "productlist"
    }
  ]

  ngOnInit(): void {
    this._ApiService.home_page.subscribe(async (res:any)=>{
      // console.log("Subject1 " , res);      
      if(res.length==0){
        await this._ApiService.getPageBySlug('home-page').subscribe((res:any)=>{
          console.log("res" , res.data);
          if(res.data.description){
            this.subjectBehaviourResponse.push(res.data.description);
            this.homePageData = res.data.description;
            this.showMsg = true;
            // console.log(this.homePageData, this.subjectBehaviourResponse);
          }
        })
      }

      else {
        this.showMsg = true;
        this.homePageData = res;
      }

    })

    setTimeout(() => {
      console.log("this.subjectBehaviourResponse", this.subjectBehaviourResponse.length);
      if (this.subjectBehaviourResponse.length > 0) {
        this.showMsg = true;
        this._ApiService.home_page.next(this.subjectBehaviourResponse[0]);
      }
    }, 3000);


  }
  //go to footer for subscribe mail
  subscribe(value: any) {
    this.newItemEvent.emit(value);
  }
  //get product data for suggestion
  getSuggestion(data: any) {
    this.showGlobalSearchSuggestion = false;
    this.slug = data.category.slug;
    this.subslug = data.slug;
    this.searchItem = data.name;
  }

  subscribe_email(){
    // let endpoint = 'newsletter'
    // console.log(this.newsletter_email);
    // this._ApiService.newLatter(endpoint , this.newsletter_email).subscribe(res=>{
    //   console.log(res);
    //   this.newsletter_email=''
    // })
    if (this.newsletter_email == undefined || this.newsletter_email == '') {
      this.resSignupMsg = 'Please Enter Email !'
      this.resSignupMsgCheck = 'danger';
      setTimeout(() => {
        this.resSignupMsg = '';
        this.resSignupMsgCheck = '';
      }, 2000);
    }
    else {
      this.resSignupMsg = 'Wait for while....';
      this.resSignupMsgCheck = 'warning';
      let endpoint = 'newsletter'
      this._ApiService.newLatter(endpoint, this.newsletter_email).subscribe(
        res => {
        console.log(res);
        this.resSignupMsg = 'Email Subscribed !'
        this.resSignupMsgCheck = 'success';
        this.newsletter_email = undefined;
        setTimeout(() => {
          this.resSignupMsg = '';
          this.resSignupMsgCheck = '';
        }, 2000);
      },
      error => {
        if(error.error.code==400) {
          this.resSignupMsg = 'Please Enter Valid Email !'
          this.resSignupMsgCheck = 'danger';
          setTimeout(() => {
            this.resSignupMsg = '';
            this.resSignupMsgCheck = '';
          }, 2000);
        }
      })

    }
  }
  closeButton() {

  }
}
