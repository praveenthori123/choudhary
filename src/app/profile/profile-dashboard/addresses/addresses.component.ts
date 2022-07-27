import { Component, OnInit, Input, Renderer2, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApiServiceService } from 'src/app/Services/api-service.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ViewportScroller } from "@angular/common";

@Component({
  selector: 'app-addresses',
  templateUrl: './addresses.component.html',
  styleUrls: ['./addresses.component.scss'],
})
export class AddressesComponent implements OnInit {
  @ViewChild('test') test: ElementRef | any;
  @Input() showdesc: any;
  allUserAddresses: any = [];
  shimmarload:boolean=true;
  resSignupMsg: string = '';
  resSignupMsgCheck: string = ' ';
  profileAddress: any = [];
  adressModal: boolean = false;

  constructor(private __apiservice: ApiServiceService, private scroller: ViewportScroller, private renderer: Renderer2,) { }

  ngOnInit(): void {
    this.getAllUserAddress();
    this.__apiservice.profiledashboard.subscribe((res: any) => {
      this.getAllUserAddress();
    })
    console.log(this.showdesc)
  }
  // <--Get User Address Function-->
  async getAllUserAddress() {
    await this.__apiservice.getUserAddress().then(
      (res: any) => {
        this.shimmarload=false;
        this.allUserAddresses = [];
        console.log(res);
        res.data.map((response: any) => {
          this.allUserAddresses.push(response);
        })
        setTimeout(() => {
          console.log(this.allUserAddresses);
        }, 1000);
      })
      .catch(error => {
        console.log(error);
        this.allUserAddresses = [];
      })

  }
  // <-- Delete User Address --> 
  async deleteUserAddress(item_id: any) {
    console.log(item_id);
    await this.__apiservice.deleteUserAddress(item_id)
      .then((res: any) => {
        if (res.code == 200) {
          this.resSignupMsg = 'Your Address Deleted Successfully!';
          this.resSignupMsgCheck = 'success';
          setTimeout(() => {
            this.resSignupMsg = '';
          this.resSignupMsgCheck = '';
          }, 3000);
          this.getAllUserAddress();
        }
      })
      .catch((error) => {
        if (error.status == 400) {
          this.getAllUserAddress();
        }
      })
  }
  goToTop() {
    window.scrollTo(0, 0);
    this.scroller.scrollToAnchor("backToTop");
  }
  // <-- Close toaster --> 
  close() {
    this.renderer.setStyle(this.test.nativeElement, 'display', 'none');
    this.resSignupMsg = '';
  }
  //<-- User Address -->
  getUserDetail(item: any) {
    if (item == 'add') {
      this.profileAddress = [];
      this.profileAddress.push({ heading: "Add Address" })
    }
    else {
      this.profileAddress = [];
      item.heading = "Edit Address";
      item.firstname = item.name.split(" ")[0];
      // item.lastname = item.name.split(" ")[1];
      this.profileAddress.push(item);
    }
  }


}
