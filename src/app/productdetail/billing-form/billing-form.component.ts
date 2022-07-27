import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { ApiServiceService } from 'src/app/Services/api-service.service';
import { CookiesService } from 'src/app/Services/cookies.service';
@Component({
  selector: 'app-billing-form',
  templateUrl: './billing-form.component.html',
  styleUrls: ['./billing-form.component.scss']
})
export class BillingFormComponent implements OnInit {
  userObj: any;
  profileAddress: any = []
  resAddmsg: string = ' ';
  resAddmsgCheck: string = ' ';
  formcheck: boolean = false;
  checkfortexmsg: boolean = false;
  errormsg: string = ''
  shippingcheck: boolean = true
  CheckoutProduct: any = [];
  checked: boolean = false;
  invalidUserEmail: string = '';
  invalidUserEmail1: string = '';
  resSignupMsg: string = '';
  resSignupMsgCheck: string = ' ';
  invalidMobile = false;
  invalidPincode = false;
  invalidPincode1 = false;
  invalidEmail: boolean = false;
  UserLogin: any;
  dataFromLocation: any;
  CheckoutProductBackUp: any = {};
  nonloggedinuser: any = {};
  nonLoggedInUserBilling: any = [{}];
  password: string = '';
  radio1: any;
  confirm_password: string = '';
  selectedRadioButton: any = '';
  getAllUserAddresses: any = [];
  shippingDataObj: any = {};
  billingUserDetail: any = [];
  formCheck: boolean = false;
  selectedAddress: any = -1;
  invalidMobile1: boolean = false;
  invalidEmail1: boolean = false;
  pincodeerror: string = '';
  formShimmer: boolean = true;
  cities: any;
  zip: any;
  allCitiesList: any[] = [];
  statesList: any[] = [];
  extra_value: any = {};

  @Output() SelectedPaymentMethod = new EventEmitter<any>();
  @Input() userBillingDetail: any;
  @Input() shippingerror: any;
  @Output() shippingDetail = new EventEmitter<any>();
  @Output() extra_notes = new EventEmitter<any>();
  @Output() LabelChange = new EventEmitter<boolean>();
  @Output() nonloggedBillingDetail = new EventEmitter<boolean>();

  constructor(private __apiservice: ApiServiceService, private route: Router, private _cookies: CookiesService) {
  }

  BillingFormData: any = [];
  ngOnInit() {
    console.log("Input Value From Parent Component", this.userBillingDetail);
    this.GetCitiesName();
    this.UserLogin = localStorage.getItem('ecolink_user_credential');
    if (!this.UserLogin) {
      this.formShimmer = false;
    }
    if (this.UserLogin) {
      this.getAllUserAddress();
      this.CheckoutProductBackUp = {
        address: "",
        city: "",
        country: "US",
        email: "",
        mobile: "",
        name: "",
        state: "",
        landmark: "",
        pincode: ""
      }
    }
    else {
      this.nonLoggedInUserBilling = [{
          address: "",
          city: "",
          country: "US",
          email: "",
          mobile: "",
          name: "",
          state: "",
          landmark: "",
          pincode: "",
          password: "1234567890",
          confirm_password: "1234567890",
          tax_exempt: "",
          company_name: ""
        }
      ]

      this.nonloggedinuser = {
        address: "",
        city: "",
        country: "US",
        email: "",
        mobile: "",
        name: "",
        state: "",
        pincode: "",
        landmark: "",
        company_name: ""
      }
    }
    console.log(this.CheckoutProductBackUp);
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
    })
  }
  cityLists: any[] = [];
  selectedcityzip: any = '';
  getdata(event: any, index: any) {
    this.cityLists = [];
    console.log(event.target.value, index);
    this.allCitiesList.map((res: any) => {
      if (res.state_code == event.target.value) {
        console.log(res.state_code);
        // console.log("res", res);
        this.cityLists.push(res);
      }
    })
    console.log("this.cities", this.cityLists);
    this.profileAddress.map((res: any) => {
      res.city = this.cityLists[0].city;
    })
    console.log(this.CheckoutProductBackUp.city);
    this.CheckoutProductBackUp.city = this.cityLists[0].city;
    this.nonLoggedInUserBilling[0].city = this.cityLists[0].city;
    this.CheckoutProductBackUp.pincode = this.cityLists[0].zip;
    console.log(this.CheckoutProductBackUp.pincode);    
    this.nonloggedinuser.city = this.cityLists[0].city;
    this.nonloggedinuser.pincode = this.cityLists[0].zip;
    this.nonLoggedInUserBilling[0].pincode   = this.cityLists[0].zip;
    this.onChangecityFirst(this.cityLists[0].city, index);
  }


  onChangecity(event: any, index: any) {
    this.cityLists.map((res: any) => {
      if (res.city == event.target.value) {
        console.log(res.zip);
        this.selectedcityzip = res.zip;
        this.nonloggedinuser.pincode = res.zip;
        this.CheckoutProductBackUp.pincode = res.zip;
        this.nonLoggedInUserBilling[0].pincode = res.zip;
        this.profileAddress?.map((responseaddress: any) => {
          responseaddress.zip = res.zip;
        })
      }
    })
  }

  onChangecityFirst(event: any, index: any) {
    this.cityLists.map((res: any) => {
      if (res.city == event) {
        console.log(res.zip);
        this.selectedcityzip = res.zip;
        this.nonloggedinuser.pincode = res.zip;
        this.nonLoggedInUserBilling[0].pincode = res.zip;
        this.CheckoutProductBackUp.pincode = res.zip;
        this.profileAddress?.map((responseaddress: any) => {
          responseaddress.zip = res.zip;
        })
        // this.profileAddress[index].zip = res.zip;
      }
    })
  }

  async getAllUserAddress() {
    this.getAllUserAddresses = []
    await this.__apiservice.getUserAddress().
      then((res: any) => {
        console.log(res);
        res.data.map((response: any, index: any) => {
          this.allCitiesList.map((resp: any) => {
            if (resp.state_code == response.state) {
              console.log(res.state_code);
              console.log("res", resp);
              this.cityLists.push(resp);
            }
          })
          response.pincode = response.zip
          console.log("getAllUserAddresses", response);
          this.getAllUserAddresses.push(response);
          this.formShimmer = false;
          this.getRadioButtonValue();
        })
      })
      .catch((error: any) => {
        this.formShimmer = false;
      })
  }

  resAddressMsg: any = ''
  resAddressMsgCheck: any = ''
  formvalid() {
    if (this.UserLogin) {
      console.log(this.CheckoutProductBackUp)
      let value = this.checkProperties(this.CheckoutProductBackUp);
      console.log(value, this.pincodeerror, this.invalidMobile1, this.invalidEmail1);
      if (value && !this.pincodeerror && !this.invalidMobile1 && !this.invalidEmail1) {
        let object = {
          name: this.CheckoutProductBackUp.name,
          email: this.CheckoutProductBackUp.email,
          mobile: this.CheckoutProductBackUp.mobile,
          landmark: this.CheckoutProductBackUp.landmark,
          address: this.CheckoutProductBackUp.address,
          country: this.CheckoutProductBackUp.country,
          state: this.CheckoutProductBackUp.state,
          city: this.CheckoutProductBackUp.city,
          zip: this.CheckoutProductBackUp.pincode,
        }

        this.__apiservice.addUserAddresses(object)
          .subscribe((res: any) => {
            console.log("Value", res);
            this.resAddressMsg = 'Please wait for a while'
            this.resAddressMsgCheck = 'warning'
            if (res.code == 200) {
              window.scroll(200, 200);
              this.resAddressMsg = 'Address Added Successfully'
              this.resAddressMsgCheck = 'success'
              setTimeout(() => {
                this.resAddressMsg = '',
                  this.resAddressMsgCheck = ''
              }, 3000);
              this.getAllUserAddress();
              this.formCheck = !this.formCheck;
            }
          },
            (error: HttpErrorResponse) => {
              console.log("error =>", error);
              if (error.error.code == 400) {
                this.resAddressMsgCheck = 'danger';
                this.resAddressMsg = "Please Fill the Form";
              }
            })
        this.CheckoutProductBackUp.valid = value;
      }
      else if (this.CheckoutProductBackUp.country != '' && this.CheckoutProductBackUp.state != '' && this.CheckoutProductBackUp.city != '' && this.CheckoutProductBackUp.pincode != '') {
        this.shippingDetail.emit(this.CheckoutProductBackUp);
        console.log(this.CheckoutProductBackUp)
      }
    }
    else {
      this.SelectedPaymentMethod.emit('');
      let value : any;
      if (!this.differentShipCheckbox) { 
        value = this.checkPropertiesforbilling(this.nonLoggedInUserBilling[0]);
        console.log(value);        
        if (value && !this.pincodeerror && !this.invalidMobile1 && !this.invalidEmail1) {
          this.nonloggedinuser = {
            address: this.nonLoggedInUserBilling[0].address,
            city: this.nonLoggedInUserBilling[0].city,
            country: "US",
            email: this.nonLoggedInUserBilling[0].email,
            mobile: this.nonLoggedInUserBilling[0].mobile,
            name: this.nonLoggedInUserBilling[0].name,
            state: this.nonLoggedInUserBilling[0].state,
            pincode: this.nonLoggedInUserBilling[0].pincode,
            landmark: this.nonLoggedInUserBilling[0].landmark,
            company_name: this.nonLoggedInUserBilling[0].company_name,
            valid : "true"
          }
          console.log(this.nonLoggedInUserBilling);
          this.nonLoggedInUserBilling[0].valid = true;
          this.nonloggedBillingDetail.emit(this.nonLoggedInUserBilling);
          this.shippingDetail.emit(this.nonloggedinuser);
        }
        else if (this.nonLoggedInUserBilling[0].country != '' && this.nonLoggedInUserBilling[0].state != '' && this.nonLoggedInUserBilling[0].city != '' && this.nonLoggedInUserBilling[0].pincode != '' && this.nonLoggedInUserBilling[0].tax_exempt != '') {
          this.shippingDetail.emit(this.nonloggedinuser);
          // this.nonloggedBillingDetail.emit(this.nonLoggedInUserBilling);
          console.log(this.nonloggedinuser);
        }
      }
      else {
        let value1 = this.checkProperties(this.nonloggedinuser);
        value = this.checkPropertiesforbilling(this.nonLoggedInUserBilling[0]);
        console.log(value1 , this.nonloggedinuser);        
        console.log(value , this.nonLoggedInUserBilling);        
        // value = this.checkProperties(this.nonLoggedInUserBilling);
        
        if (value && value1 && !this.pincodeerror && !this.invalidMobile1 && !this.invalidEmail1) {
          console.log(this.nonloggedinuser, this.nonLoggedInUserBilling);
          this.nonloggedinuser.valid = true;
          this.nonLoggedInUserBilling.valid = true;
          this.shippingDetail.emit(this.nonloggedinuser);
          // this.nonloggedBillingDetail.emit(this.nonLoggedInUserBilling);
        }
      }
    }
  }

  checkProperties(obj: any) {
    console.log("object", obj);
    for (var key in obj) {
      if (obj["name"] == '' || obj["email"] == '' || obj["state"] == '' || obj["mobile"] == '' || obj["address"] == '' || obj["country"] == '' || obj["city"] == '' || obj["zip"] == '') {
        return false;
      }
    }
    return true;
  }
  checkPropertiesforbilling(obj: any) {
    console.log("object", obj);
    for (var key in obj) {
      if (obj["name"] == '' || obj["email"] == '' || obj["state"] == '' || obj["mobile"] == '' || obj["address"] == '' || obj["country"] == '' || obj["city"] == '' || obj["zip"] == '' || obj["password"] == ''  || obj["confirm_password"] == '' || obj["company_name"] == '' || obj["tax_exempt"] == '') {
        return false;
      }
    }
    return true;
  }
  // signup when user come to checkout without login


  //validate user email
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

  //validate user mobile number 
  inputMobile(event: any) {
    if (
      event.key?.length === 1 &&
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

  inputPincode(event: any) {
    if (
      event.key?.length === 1 &&
      !/^[0-9]$/.test(event.key)
    ) {
      event.preventDefault();
    }
  }

  validatePincode(event: any) {
    const value = event.target.value;

    if (
      value &&
      /^[0-9]+$/.test(value) &&
      value.length < 5
    ) {
      this.pincodeerror = 'Invalid ZIP Code';
    }

    else {
      this.pincodeerror = '';
    }
  }
  inputPincode1(event: any) {
    if (
      event.key?.length === 1 &&
      !/^[0-9]$/.test(event.key)
    ) {
      event.preventDefault();
    }
  }

  validatePincode1(event: any) {
    const value = event.target.value;

    if (
      value &&
      /^[0-9]+$/.test(value) &&
      value.length < 5
    ) {
      this.invalidPincode1 = true;
    }

    else {
      this.invalidPincode1 = false;
    }
  }

  validateUserEmail1(email: any) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(email.target.value) == false) {
      this.invalidUserEmail1 = 'Invalid Email Address';
      return false;
    }
    this.invalidUserEmail1 = '';
    return true;
  }
  
  invalidEmail2:boolean = false;
  validateEmail2(event : any){
    const value = event.target.value;

    if (
      value &&
      !/^[0-9]*$/.test(value) &&
      !this.validateUserEmail1(event)
    ) {
      this.invalidEmail2 = true;
    }

    else {
      this.invalidEmail2 = false;
    }
  }

  validateEmail1(event: any) {
    const value = event.target.value;

    if (
      value &&
      !/^[0-9]*$/.test(value) &&
      !this.validateUserEmail(event)
    ) {
      this.invalidEmail1 = true;
    }

    else {
      this.invalidEmail1 = false;
    }
  }

  //validate user mobile number 
  inputMobile1(event: any) {
    if (
      event.key?.length === 1 &&
      !/^[0-9]$/.test(event.key)
    ) {
      event.preventDefault();
    }
  }

  validateMobile1(event: any) {
    const value = event.target.value;

    if (
      value &&
      /^[0-9]+$/.test(value) &&
      value.length < 10
    ) {
      this.invalidMobile1 = true;
    }

    else {
      this.invalidMobile1 = false;
    }
  }

  invalidMobile2:boolean = false;
  validateMobile2(event: any) {
    const value = event.target.value;

    if (
      value &&
      /^[0-9]+$/.test(value) &&
      value.length < 10
    ) {
      this.invalidMobile2 = true;
    }

    else {
      this.invalidMobile2 = false;
    }
  }


  //close pop up
  close() {
    console.log("close");
    this.resSignupMsg = '';
  }

  //store cookies data in cart on checkout page
  SaveCookiesDataInCart() {
    this.CheckoutProduct.map((res: any) => {
      console.log(res.carts);
      res.carts.map(async (resp: any) => {
        console.log(resp);
        await this.__apiservice.addItemToCart(resp.product_id, resp.quantity, "add")
          .then((res) => {
            console.log(res);
            this._cookies.DeleteCartData();
          })

          .catch((error: any) => {
            console.log(error);
          })
      })
    })
  }


  UpdateToggle() {
    this.SelectedPaymentMethod.emit('')
    this.__apiservice.toggleButton.next('Addresses');
    this.route.navigateByUrl('/profile')
  }

  openform() {
    this.SelectedPaymentMethod.emit('')
    if (this.UserLogin) {
      this.formCheck = !this.formCheck;
      if (!this.formCheck) {
        this.getRadioButtonValue();
      }

      else {
        this.selectedAddress = -1;
        this.shippingerror=-1
        this.CheckoutProductBackUp = {
          address: "",
          city: "",
          country: "US",
          email: "",
          mobile: "",
          name: "",
          state: "",
          landmark: "",
          pincode: ""
        };

        this.shippingDetail.emit(this.CheckoutProductBackUp);

      }
    }
  }

  editbillingdetail() {
    this.__apiservice.toggleButton.next('Edit Profile');
    this.route.navigateByUrl('/profile')
  }

  //get radio button value for addresses

  getRadioButtonValue() {
    this.formCheck=false
    this.SelectedPaymentMethod.emit('');
    console.log("this.selectedAddress", this.selectedAddress);
    this.getAllUserAddresses.map((res: any, index: any) => {
      if (index == this.selectedAddress) {
        res.valid = true;
        this.shippingDetail.emit(res);
      }
    })
  }

  gotoprofile(string: any) {
    console.log(this.nonloggedinuser.tax_exempt, "this.nonloggedinuser.tax_exempt")
    if (string) {
      this.checkfortexmsg = true
      this.nonloggedinuser.string = "fromcheckout";
    }
    else {
      this.checkfortexmsg = false;
    }
  }

  clicktosignup() {
    this.__apiservice.nonloginuserdetail.next(this.nonloggedinuser)
    this.route.navigateByUrl('/profile');
  }

  getUserDetail(item: any) {
    this.selectedAddress = -1
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
      console.log(this.profileAddress);
      this.profileAddress.map((res: any) => {
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
            // this.__apiservice.profiledashboard.next(true);
            // this.__apiservice.profiledashboard.subscribe((res:any)=> {
            console.log(res);
            // })
            this.formShimmer = true
            this.getAllUserAddress();
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
  }

  differentShipCheckbox: boolean = false;
  getDifferentShippingAddress() {
    this.SelectedPaymentMethod.emit('');
    this.differentShipCheckbox = !this.differentShipCheckbox;
    if(this.differentShipCheckbox){
      this.nonloggedinuser = {
        address: "",
        city: "",
        country: "US",
        email: "",
        mobile: "",
        name: "",
        state: "",
        pincode: "",
        landmark: "",
        company_name: ""
      }
      // this.shippingDetail.emit(this.nonloggedinuser);
    }
    else {
      this.nonloggedinuser = {
        address: this.nonLoggedInUserBilling.address,
        city: this.nonLoggedInUserBilling.city,
        country: "US",
        email: this.nonLoggedInUserBilling.email,
        mobile: this.nonLoggedInUserBilling.mobile,
        name: this.nonLoggedInUserBilling.name,
        state: this.nonLoggedInUserBilling.state,
        pincode: this.nonLoggedInUserBilling.pincode,
        landmark: this.nonLoggedInUserBilling.landmark,
        company_name: this.nonLoggedInUserBilling.company_name
      }
      // this.shippingDetail.emit(this.nonloggedinuser);
    }
    this.LabelChange.emit(this.differentShipCheckbox)
  }

  getExtraValue(){
    let data = {
      order_notes : this.extra_value.order_notes ,
      search_keyword : this.extra_value.search_keyword
    }
    this.extra_notes.emit(data)
  }
}
