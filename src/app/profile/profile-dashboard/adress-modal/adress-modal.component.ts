import { Component, OnInit, Input, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { ApiServiceService } from 'src/app/Services/api-service.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-adress-modal',
  templateUrl: './adress-modal.component.html',
  styleUrls: ['./adress-modal.component.scss']
})
export class AdressModalComponent implements OnInit {
  @Input() showdesc: any;
  @Input() profileaddress: any;
  @ViewChild('test') test: ElementRef | any;
  userObj: any;
  resAddmsg: string = ' ';
  resAddmsgCheck: string = ' ';
  resSignupMsg: string = '';
  invalidEmail: boolean = false;
  invalidUserEmail: string = '';
  invalidMobile = false;
  invalidZip = false;
  zip: any;
  allCitiesList: any[] = [];
  statesList: any[] = [];
  constructor(private __apiservice: ApiServiceService, private renderer: Renderer2,) { }

  ngOnInit() {
    console.log(this.profileaddress);
    this.GetCitiesName();
  }
  // City state Zip dropdown 
  GetCitiesName() {
    this.__apiservice.getCitiesByState().subscribe((res: any) => {
      this.allCitiesList = res;
      console.log(res, "cities list");
      const states: any = this.allCitiesList.map((city: any) => {
        return {
          code: city.state_code,
          state: city.state_name
        }
      })
      const unique: any = this.allCitiesList.filter(
        (item: any, pos: any, self: any) => self.findIndex((v: any) => v.state_code === item.state_code) === pos
      );
      console.log(unique, "statessss");
      this.statesList = unique;
      this.profileaddress?.map((response: any) => {
        console.log(response);
        this.allCitiesList.map((resp: any) => {
          if (resp.state_code == response.state) {
            console.log(resp.state_code);
            console.log("res", resp);
            this.cityLists.push(resp);
          }
        })
      })
    })
    this.profileaddress[0].state = this.cityLists[0].state;
  }

  onChangecityFirstTime(city: any) {
    console.log(city);
    this.cityLists.map((res: any) => {
      if (res.city == city) {
        console.log(res.zip);
        this.selectedcityzip = res.zip;
        this.profileaddress[0].zip = res.zip;
      }
    })
  }

  
  cityLists: any[] = [];
  selectedcityzip: any = '';
  getdata(event: any) {
    this.cityLists = [];
    console.log(event.target.value);
    this.allCitiesList.map((res: any) => {
      if (res.state_code == event.target.value) {
        this.cityLists.push(res);
      }
    })
    console.log("this.cities", this.cityLists);
    this.profileaddress[0].city = this.cityLists[0].city;
    this.onChangecityFirstTime(this.cityLists[0].city);
  }


  onChangecity(event: any) {
    this.cityLists.map((res: any) => {
      if (res.city == event.target.value) {
        console.log(res.zip);
        this.selectedcityzip = res.zip;
        this.profileaddress[0].zip = res.zip;
      }
    })
  }
  // <User Address Modal>
  addUserAddress(form: NgForm) {
    if (form.valid) {
      let data = Object.assign({}, form.value);
      this.userObj = {
        name: data.firstname,
        email: data.email,
        mobile: data.phonenumber,
        landmark: data.landmark,
        address: data.address,
        country: "US",
        state: data.state,
        city: data.city,
        zip: data.pincode,
      };
      console.log(this.userObj);
      console.log(this.profileaddress);
      this.profileaddress.map((res: any) => {
        if (res.heading == 'Add Address') {
          this.__apiservice.addUserAddresses(this.userObj).subscribe(
            (res) => {
              console.log(res);
              this.__apiservice.profiledashboard.next(true);
            },
            () => {
              form.reset();
            }
          );
        }
        else {
          console.log('edit');
          this.userObj.address_id = data.id;
          this.__apiservice.editUserAddress(this.userObj).subscribe((res: any) => {
            console.log(res);
            this.__apiservice.profiledashboard.next(true);
            this.__apiservice.profiledashboard.subscribe((res: any) => {
              console.log(res);
            })
          },
            () => {
              form.reset();
            }
          );
        }
      })
    }
    else {
      this.resAddmsg = 'Please Fill the Fields Below!';
      this.resAddmsgCheck = 'danger';
      setTimeout(() => {
        this.resAddmsg = ''
      }, 2000);
    }
    console.log()
  }
  // <-- Close toaster --> 
  close() {
    this.renderer.setStyle(this.test.nativeElement, 'display', 'none');
    this.resSignupMsg = '';
  }
  // <-- User Email Validation Start -->
  validateUserEmail(email: any) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(email.target.value) == false) {
      this.invalidUserEmail = 'Invalid Email Address';
      return false;
    }
    this.invalidUserEmail = '';
    return true;
  }
  validateEmail(event: any) {
    const value = event.target.value;
    if (
      value &&
      !/^[0-9]*$/.test(value) &&
      !this.validateUserEmail(event)
    ) {
      this.invalidEmail = true;
    }

    else {
      this.invalidEmail = false;
    }
  }
  // validate pincode 
  inputZip(event: any) {
    if (
      event.key.length === 1 &&
      !/^[0-9]$/.test(event.key)
    ) {
      event.preventDefault();
    }
  }
  validateZip(event: any) {
    const value = event.target.value;
    if (
      value &&
      /^[0-9]+$/.test(value) &&
      value.length < 5
    ) {
      this.invalidZip = true;
    }
    else {
      this.invalidZip = false;
    }
  }
  // validate mobile number
  inputMobile(event: any) {
    if (
      event.key.length === 1 &&
      !/^[0-9]$/.test(event.key)
    ) {
      event.preventDefault();
    }
  }
  validateMobile(event: any) {
    const value = event.target.value;
    if (
      value &&
      /^[0-9]+$/.test(value) &&
      value.length < 10
    ) {
      this.invalidMobile = true;
    }
    else {
      this.invalidMobile = false;
    }
  }
}
