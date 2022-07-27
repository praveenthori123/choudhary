import {
  Component, Input, OnInit, Renderer2, ViewChild, ElementRef, Output, EventEmitter
} from '@angular/core';
import { ViewportScroller } from "@angular/common";
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/Services/api-service.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-profile-dashboard',
  templateUrl: './profile-dashboard.component.html',
  styleUrls: ['./profile-dashboard.component.scss']
})
export class ProfileDashboardComponent implements OnInit {
  @ViewChild('test') test: ElementRef | any;
  @Output() itemEvent = new EventEmitter<any>();
  profile_image=environment.profile_image
  file: any = null;
  shimmerLoad: boolean = true;
  profileAddress: any = [];
  address: any = [];
  userObj: any;
  userDetail: any = [];
  invalidMobile = false;
  passwrodCheck: boolean = false
  resSignupMsg: string = '';
  resSignupMsgCheck: string = ' ';
  @Input() showdesc: any;
  constructor(private __apiservice: ApiServiceService, private scroller: ViewportScroller, private renderer: Renderer2, private router: Router) {
  }

  ngOnInit(): void {
    this.getFunction();
    // this.getReturnProduct();
    this.__apiservice.profiledashboard.subscribe((res: any) => {
      if (res) {
        this.getFunction();
        this.__apiservice.profiledashboard.next(false);
      }
    })
  }
  // <<--Get User deatils Function-->>
  getFunction() {
    this.userDetail = []
    this.__apiservice.getUserProfileDetail().subscribe(
      (res: any) => {
        console.log(res);
        this.userDetail.push(res.data);
        this.shimmerLoad = false;
        this.userDetail.map((res: any) => {
          setTimeout(() => {
            // res.firstname = res.name.split(" ")[0]
            // res.lastname = res.name.split(" ")[1]
            console.log("res", res);
          }, 500);
        })
        console.log(this.userDetail);
      },
      (error:any) => {
        console.log(error);
        if(error.error.code==504 || error.status==401) {
          localStorage.removeItem('ecolink_user_credential');
          this.router.navigateByUrl('/profile/auth');
        }
      } 
      )
  }



  // <-- User Email Validation End -->


  // <-- for mobile validation End-->


  //<-- User Address -->
  getUserDetail(item: any) {
    console.log(item);
    if (item == 'add') {
      this.profileAddress = [];
      this.profileAddress.push({
        heading: "Add Address",
      });

    }
    else {
      this.profileAddress = [];
      item.heading = "Edit Address";
      item.name = item.name.split(" ")[0];
      // item.lastname = item.name.split(" ")[1];
      this.profileAddress.push(item);
    }
  }

  // ***************************************Order History****************************************

  // *************************************End**************************************************


  // <-- Back to top on edit profile page -->
  goToTop() {
    window.scrollTo(0, 0);
    this.scroller.scrollToAnchor("backToTop");
  }
  // <-- Close toaster --> 
  close() {
    this.renderer.setStyle(this.test.nativeElement, 'display', 'none');
    this.resSignupMsg = '';
  }
  // <-- Switch Tab On Edit Profile -->
  changeTab(name: any) {
    this.__apiservice.UserAddress.next(name)
    this.itemEvent.emit('Edit Profile')
  }
}
