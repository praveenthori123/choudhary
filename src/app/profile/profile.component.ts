import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TableCheckbox } from 'primeng/table';
import { ApiServiceService } from '../Services/api-service.service';
import { ProfileDashboardComponent } from './profile-dashboard/profile-dashboard.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  openNav: boolean = false;
  togglebutton: string = ''
  constructor(private route: Router, private __apiservice: ApiServiceService) { }



  ngOnInit(): void {
    let response : any ;
    this.__apiservice.UserAddress.next("Edit Profile");
    // this.__apiservice.toggleButton.subscribe((res: any) => {
    //   console.log(res);      
    //   if (res.length==0) {
    //     this.togglebutton = res;
    //     response = '';
    //   }

    //   else {
    //     this.togglebutton = 'Dashboard';
    //   }
    // })

    // console.log(this.togglebutton);    

    // this.__apiservice.toggleButton.next('');
    this.__apiservice.toggleButton.subscribe((response:any)=> {
      console.log(response);
      if((Object.keys(response).length)>0) {
        this.event(response);
      }
      else {
        this.togglebutton='Dashboard';
      }
    })
    // setTimeout(() => {
    //   this.__apiservice.toggleButton.next({});
    // }, 3000);

  }
  event(event: any) {
    this.togglebutton = event;
    
  }
  openNavbar() {
    this.openNav = !this.openNav;
    // this.openNav = true;
  }
  getUserLogout() {
    this.__apiservice.getUserLogoutProfile().subscribe((res: any) => {
      console.log(res);
      localStorage.removeItem('string');
      localStorage.removeItem("ecolink_user_credential");
      localStorage.removeItem('email_token');
      this.__apiservice.GetCart.next([]);
      this.__apiservice.lift_charge.next([])
      this.route.navigateByUrl('/profile/auth');
    })
  }
}
