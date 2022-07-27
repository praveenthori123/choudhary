import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/Services/api-service.service';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { FetchedHeaderState } from '../../store/state/header.state';
import { HeaderMenuAction } from '../../store/actions/header.action';
import { HttpErrorResponse } from '@angular/common/http';
import { CookiesService } from 'src/app/Services/cookies.service';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() length: any;
  headerMenuData: any;
  isAlive = true;
  modalcheck:boolean=true;
  user_id: any;
  openMenu: boolean = false;
  openSubmenu: boolean = false;
  opensubSubmenu: boolean = false;
  homePageData: any = [];
  slug: any;
  data: any = []
  responseSubscribe: any = {}
  show: boolean = false;
  searchItem: string = '';
  subslug: any;
  suggestionList: any = [];
  showGlobalSearchSuggestion: any = false;
  customerLocation: string = '';

  @Select(FetchedHeaderState.getFetchedHeader) headerMenu$!: Observable<any>;
  @Select(FetchedHeaderState.getFetchedHeaderLoad) headerMenuDataLoaded$!: Observable<boolean>;

  constructor(private scroller: ViewportScroller, private _cookies: CookiesService, private route: Router, private __apiservice: ApiServiceService, private store: Store, private router: Router) { }
  routes: any = [
    {
      "id": "1",
      "route": ""
    },
    {
      "id": "2",
      "route": "/shop"
    },
    {
      "id": "3",
      "route": "/media"
    },
    {
      "id": "4",
      "route": "/ask-chemist"
    },
    {
      "id": "5",
      "route": "/blog"
    },
    {
      "id": "6",
      "route": "/"
    },
    {
      "id": "7",
      "route": "/shop"
    },
    {
      "id": "8",
      "route": "/about-us"
    },
  ];

  addressArray: any = []
  ngOnInit() {
    localStorage.removeItem('modal')
    this.modalcheck=true;
    if(localStorage.getItem('modal')) {
      this.modalcheck=false;
    }
    else {
      this.modalcheck=true;
    }
    if(localStorage.getItem('ecolink_user_credential')) {
      this.__apiservice.checkforuser()
      .then((res:any)=> {
        console.log(res);
      })
      .catch((error:any)=> {
        if(localStorage.getItem('string')) {
          localStorage.removeItem('ecolink_user_credential');
          this.route.navigateByUrl("/profile");
        }
      })
    }
    this.getAllHeaderMenu();
    this.getStaticValues();
    this.headerMenu$.subscribe(res => {
      this.homePageData = [];
      if (res.data) {
        res.data.pages.map((response: any) => {
          this.homePageData.push(response);
        });
      }
    });


    this.__apiservice.UserLocation.subscribe(res => {
      if (res) {
        let pincode = res[5] ? res[5].long_name : "US";
        let Location = res[3] ? res[3].long_name : 'Decatur';
        this.customerLocation = Location + "" + "," + " " + pincode;
      }
    });

    this.cartCountFunction();
    this.getSubscribeMsg();
  }

  getSubscribeMsg() {
    this.__apiservice.subscribedmsg.subscribe((res: any) => {
      this.responseSubscribe = res;
    })
  }
  lift_charges:any=0
  hazardous:any=0
  async getStaticValues(){
    this.__apiservice.lift_charge.subscribe(async (response:any)=> {
      console.log("response",response);
      if(response?.length==0) {
        await this.__apiservice.getStaticData('lift gate').then(res => {
          console.log(res);
          this.lift_charges=res.data.value
        })
      }
    })
    setTimeout(() => {
      console.log("this.lift_charges",this.lift_charges);
      if(!(this.lift_charges==0))  {
        this.__apiservice.lift_charge.next(this.lift_charges);
      }
    }, 2000);

    this.__apiservice.hazardous.subscribe(async (response:any)=> {
      console.log("response",response);
      if(response == 0) {
        await this.__apiservice.getStaticData('hazardous').then(res => {
          console.log(res);
          this.hazardous=res.data.value
        })
      }
    })
    setTimeout(() => {
      console.log("this.hazardous",this.hazardous);
      if(!(this.hazardous==0))  {
        this.__apiservice.hazardous.next(this.hazardous);
      }
    }, 2000);
  }

  //Get product count from cart 
  cartInfo: any = [];
  async cartCountFunction() {
    if (localStorage.getItem('ecolink_user_credential') != null) {
      this.__apiservice.GetCart.subscribe(async resp => {
        console.log("resp" , resp);   
        if(resp?.length == 0 || resp.data?.length==0){
          await this.__apiservice.getItemFromCart()
            .then(res => {
              if (res.data) {
                console.log(res.data);   
                this.length = res.data.length;
                this.cartInfo = res.data;                
              }
            })
            .catch((error: any) => {
              this.length = 0;
              this.cartInfo = [{string : 'empty'}];
            })
        } 

        else {
          if(resp?.string || resp[0]?.string){
            this.length = 0;
          }
          else if(resp.data){
            this.length = resp.data.length;
          }
          else {
            this.length = resp.length;
          }
        }
      })

      setTimeout(() => {
        if(this.cartInfo.length > 0){
          this.__apiservice.GetCart.next(this.cartInfo);
        }
      }, 4000);

    }
    else {
      let cookiesdata = localStorage.getItem("Cookies_Cart_Data");
      if(cookiesdata){
        let cartsCount = JSON.parse(cookiesdata);
        if(cartsCount.data.length > 0){
          this.length = cartsCount.data.length;
        }

        else {
          this.length = 0;
        }
      }

      else {
        this.length = 0;
      }
    }
  }
  //Go to profile page if user signed in
  profile() {
    if (localStorage.getItem("ecolink_user_credential") === null) {
      this.route.navigateByUrl('/profile/auth');
    }
    else {
      this.__apiservice.toggleButton.next({});
      this.route.navigateByUrl('/profile');
    }
  }
  //open dropdown in mobile screen
  openmenu() {
    this.openMenu = !this.openMenu;
  }
  openDropDown() {
    this.openSubmenu = !this.openSubmenu
  }
  opensubDropDown() {
    console.log('subcategory')
    this.opensubSubmenu = !this.opensubSubmenu
  }
  //Suggestion when user search dynamically
  getSuggestion(data: any) {
    this.showGlobalSearchSuggestion = false;
    this.slug = data.category.slug;
    this.subslug = data.slug;
    this.searchItem = data.name;
  }


  //Global search function
  globalSearch() {
    console.log(this.searchItem); 
    if (this.searchItem.length > 0) {
      this.suggestionList = [];
      this.__apiservice.globalSearchData(this.searchItem).subscribe(
        (res:any) => {
          this.showGlobalSearchSuggestion = true;
          this.suggestionList = res.data;
        },
        (error: HttpErrorResponse) => {
          if (error.error.code == 400) {
            this.showGlobalSearchSuggestion = true;
            let data = [
              {
                name : "No Data Found"
              }
            ]
            this.suggestionList = data;
          }
        }
      )
    }
    
    else {
      this.showGlobalSearchSuggestion = false;
    }
    
  }

  userName: string = '';
  userDetail: any;
  getAllHeaderMenu() {
    this.headerMenuData = this.headerMenuDataLoaded$.subscribe(res => {
      if (!res) {
        this.store.dispatch(new HeaderMenuAction());
      }
    })

    this.userDetail = localStorage.getItem('ecolink_user_credential');
    if (this.userDetail) {
      if(!(localStorage.getItem('usernameforheader'))) {
        let name = JSON.parse(this.userDetail);
        console.log(name.user.name);
        // if(!("url" in name.user)) {
          this.userName = name.user.name.split(" ")[0];
        // }
      }
      else {
        this.userName='';
        localStorage.removeItem('usernameforheader')
      }
    }
  }
  //Route on Same page for header link in mobile view
  routeOnSamePage(slug: any, sublink?: any, subsublink?: any) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    if (subsublink) {
      this.router.navigate(['/' + slug + '/' + sublink + '/' + subsublink]);
    }
    else if (sublink) {
      this.router.navigate(['/' + slug + '/' + sublink]);
    }

    else {
      this.router.navigate(['/' + slug]);
    }
  }
  //go to map, when click on location icon
  goToLocation() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['/' + 'contact']);
  }

  //close subscribe mail popup 
  closeButton() {
    let object = {
      resSignupMsg: '',
      resSignupMsgCheck: '',
    }

    this.__apiservice.subscribedmsg.next(Object.assign({}, object));

  }
  //scroll down to up function
  scrollup(event: any) {
    console.log(event);
    this.responseSubscribe = event;
    this.scroller.scrollToAnchor('subscribeMsg');
  }
  closeModalEvent(event:any){
    this.modalcheck=event;
    console.log(event);
  }

  //for not repeating api calling
  ngOnDestroy(): void {
    this.isAlive = false;
    this.headerMenuData.unsubscribe();
  }
}