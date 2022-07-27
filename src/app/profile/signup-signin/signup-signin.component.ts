import { Component, Renderer2, ViewChild, ElementRef, OnInit } from '@angular/core';
import { ViewportScroller } from "@angular/common";
import { NgForm, FormGroup, FormControl, Validators, AnyForUntypedForms, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/Services/api-service.service';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ReCaptcha2Component } from 'ngx-captcha';

@Component({
  selector: 'app-signup-signin',
  templateUrl: './signup-signin.component.html',
  styleUrls: ['./signup-signin.component.scss']
})
export class SignupSigninComponent implements OnInit {
  @ViewChild('test') test: ElementRef | any;
  adminurl = environment.adminurl;
  userObj: any;
  taxCalculate: any
  radiocheck: boolean = true;
  loginobj: any;
  resSignupMsg: string = '';
  documentcheck: boolean = false;
  password: string = '';
  confirmPassword: string = '';
  invalidMobile = false;
  invalidPincode = false;
  fromcheckoutdetail: any = {}
  invalidEmail: boolean = false;
  invalidUserEmail: string = '';
  checkString: boolean = true;
  resSignupMsgCheck: string = ' ';
  resSignInMsgCheck: string = ' ';
  resSignInMsg: string = ' ';
  resMsg: string = '';
  invalidZip = false;
  errMsg = [];
  count: any = 1;
  document_array: any = [{ id: this.count }];
  images: string[] = [];
  cities: any;
  zip: any;
  allCitiesList: any[] = [];
  statesList: any[] = [];
  url: boolean = true;
  reCaptcha_signIn: any;
  aFormGroup: FormGroup | any;
  @ViewChild('captchaElem') captchaElem: ReCaptcha2Component | any;
  @ViewChild('captchaElement') captchaElement: ReCaptcha2Component | any;
  @ViewChild('langInput') langInput: ElementRef | any;

  public captchaIsLoaded = false;
  public captchaSuccess = false;
  public captchaIsExpired = false;
  public captchaResponse?: string;

  public theme: 'light' | 'light' = 'light';
  public size: 'compact' | 'normal' = 'normal';
  public lang = 'en';
  public type: 'image' | 'audio' | any;

  constructor(private router: Router, private renderer: Renderer2, private scroller: ViewportScroller, private __apiservice: ApiServiceService) {
  }
  ngOnInit(): void {
    if (localStorage.getItem('ecolink_user_credential') == null) {
      this.__apiservice.nonloginuserdetail.subscribe((res: any) => {
        console.log(res);
        if (res.string) {
          this.fromcheckoutdetail = res;
          console.log(this.checkString)
          this.checkString = false;
        }
      })
    }
    this.GetCitiesName();
  }

  // City state Zip dropdown 
  GetCitiesName() {
    this.__apiservice.getCitiesByState().subscribe((res: any) => {
      this.allCitiesList = res;
      console.log(res, "cities list");
      const states: any = this.allCitiesList.map((city: AnyForUntypedForms) => {
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
  getdata(event: any) {
    this.cityLists = [];
    console.log(event.target.value);
    this.allCitiesList.map((res: any) => {
      if (res.state_code == event.target.value) {
        console.log(res.state_code);
        console.log("res", res);
        this.cityLists.push(res);
      }
    })
    console.log("this.cities", this.cityLists);
  }
  onChangecity(event: any) {
    this.cityLists.map((res: any) => {
      if (res.city == event.target.value) {
        console.log(res.zip);
        this.selectedcityzip = res.zip;
        this.fromcheckoutdetail.pincode = res.zip;
      }
    })
  }

  clickonradio(value: any) {
    console.log(value)
    if (value == 'yes') {
      // this.profileForm.addControl('document1')
      this.profileForm.addControl('document1', new FormControl('', Validators.required));
      this.documentcheck = true;
    }
    else {
      // this.profileForm.removeControl('document1')
      this.documentcheck = false;
    }
    this.radiocheck = false;
  }


  // showing sign in modal
  SignIn() {
    this.checkString = !this.checkString;
  }
  // validate pincode 
  inputZip(event: any) {
    if (
      event.key?.length === 1 &&
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
  //go to top when pop up opens
  goToTop() {
    window.scrollTo(0, 0);
    this.scroller.scrollToAnchor("backToTop");
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
  //get user form details
  profileForm = new FormGroup({
    firstname: new FormControl('', [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]),
    companyname: new FormControl('', [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]),
    email: new FormControl('', [Validators.required]),
    phonenumber: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    confirmpassword: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]),
    landmark: new FormControl('', [Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]),
    country: new FormControl('US'),
    state: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z][a-zA-Z ]*$/)]),
    city: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z][a-zA-Z ]*$/)]),
    pincode: new FormControl('', []),
    radio2: new FormControl('', [Validators.required]),
    image: new FormControl('', [Validators.required]),
    recaptcha: new FormControl('', [Validators.required])
  }, { updateOn: 'blur' }
  );


  //user sign up 
  signUp() {
    this.profileForm.patchValue({ country: 'US' });
    console.log(this.documentcheck, this.profileForm, this.profileForm.valid);
    console.log("this.UploadDocuments", this.UploadDocuments);
    let formData = new FormData();
    this.UploadDocuments.map((res: any, index: any) => {
      if (index == 0) {
        formData.append('files[0]', res);
      }
      else if (index == 1) {
        formData.append('files[1]', res);
      }

      else if (index == 2) {
        formData.append('files[2]', res);
      }

      else if (index == 3) {
        formData.append('files[3]', res);
      }
    })

    if (this.profileForm.valid) {
      this.resSignupMsgCheck = 'warning';
      this.resSignupMsg = 'Wait for a while....'
      let data = this.profileForm.value;
      formData.append('profile_image', this.documents.file0);
      formData.append('name', data.firstname);
      formData.append('company_name', data.companyname);
      formData.append('email', data.email);
      formData.append('mobile', data.phonenumber);
      formData.append('password', data.password);
      formData.append('landmark', data.landmark);
      formData.append('address', data.address);
      formData.append('country', 'US');
      formData.append('state', data.state);
      formData.append('city', data.city);
      formData.append('pincode', data.pincode);
      formData.append('tax_exempt', data.radio2);
      this.taxCalculate = data.radio2
      this.__apiservice.post(formData).subscribe(
        (res) => {
          console.log(res);
          if (res.code == 200) {
            if (res.data.user.remember_token) {
              this.resSignupMsgCheck = 'success';
              this.resSignupMsg = 'Verification mail has been sent to your Email Id !'
            }
            localStorage.setItem(
              'ecolink_user_credential',
              JSON.stringify(res.data)
            );
            localStorage.setItem('usernameforheader', "username")
            //Reset the form affter submition
            this.profileForm.reset();
            this.captchaElem.resetCaptcha();
            this.documentcheck = false;
            this.url = false;
            // Remove validators after form submission
            Object.keys(this.profileForm.controls).forEach(key => {
              this.profileForm.controls[key].setErrors(null)
            });
          }

          else {
            this.resSignupMsg = res.message;
            localStorage.removeItem('ecolink_user_credential');
          }
        },
        (error: HttpErrorResponse) => {
          console.log(error.status);
          console.log(error, error.error.message.files);
          if (error.status == 400) {
            if (error.error.message.email) {
              this.resSignupMsg = error.error.message.email[0];
            }
            else if (error.error.message.password) {
              this.resSignupMsg = error.error.message.password[0];
            }
            else if (error.error.message.mobile) {
              this.resSignupMsg = error.error.message.mobile[0];
            }
            else if (error.error.message.files) {
              this.resSignupMsg = error.error.message;
            }
            else if (error.error.message) {
              this.resSignupMsg = error.error.message;
            }
            this.resSignupMsgCheck = 'danger';
          }
          else if (error.status == 422) {
            console.log(error.error.errors.profile_image[0]);
            this.resSignupMsg = error.error.errors.profile_image[0];
            this.resSignupMsgCheck = 'danger';
          }
          else if (error.status == 500) {
            this.resSignupMsgCheck = 'danger',
              this.resSignupMsg = 'Something Went Wrong!'
          }
        });
    }
    else {
      this.getResponseBySignUp();
      this.captchaElement.resetCaptcha();
      this.resSignupMsg = "Please Fill all the Fields!"
      this.resSignupMsgCheck = "danger"
      setTimeout(() => {
        this.resSignupMsg = ' ';
        this.resSignupMsgCheck = ' ';
      }, 3000);
    }
  }
  //user sign in 
  signinWithEmail(form: NgForm) {
    this.__apiservice.GetCart.next([]);
    if (form.valid) {
      let data = Object.assign({}, form.value);
      this.loginobj = {
        email: data.emailphone,
        password: data.password,
        reCaptcha: data.recaptcha
      };
      console.log(this.loginobj);

      this.__apiservice.login(this.loginobj).subscribe(
        (res) => {
          console.log(res);
          if (res.user_type === "admin") {
            console.log(res.user_type);
            console.log(this.adminurl, res.redirect_url)
            window.location.href = res.redirect_url;
            form.reset();
            this.captchaElement.resetCaptcha();
          }
          else {
            localStorage.setItem(
              'ecolink_user_credential',
              JSON.stringify(res.data)
            );
            localStorage.setItem('string', 'existinguser');
            this.router.navigateByUrl('/');
          }
          this.captchaElement.resetCaptcha();
        },
        (error: HttpErrorResponse) => {
          if (error.error.message == "Please enter correct password") {
            console.log(error);
            this.resSignInMsgCheck = 'danger';
            this.resSignInMsg = 'Incorrect Username Password!';
            setTimeout(() => {
              this.resSignInMsgCheck = ' ';
              this.resSignInMsg = ' ';
            }, 3000);
            console.log(error.error.code);
            form.reset();
            this.captchaElement.resetCaptcha();
          }
          if (error.error.message == "User is Deactivated") {
            console.log(error);
            this.resSignInMsgCheck = 'danger';
            this.resSignInMsg = 'Your account is currently deactivated! Please contact us "info@ecolink.com"';
            console.log(error.error.code);
            form.reset();
            this.captchaElement.resetCaptcha();
          }
          if (error.error.message == "User not found or inactive") {
            console.log(error);
            this.resSignInMsgCheck = 'danger';
            this.resSignInMsg = 'User Not Found!';
            setTimeout(() => {
              this.resSignInMsgCheck = '';
              this.resSignInMsg = '';
            }, 3000);
            console.log(error.error.code);
            form.reset();
            this.captchaElement.resetCaptcha();
          }
        }
      );

      () => {
        form.reset();
        this.captchaElement.resetCaptcha();
      }
    }
    else {
      this.getResponseBySignIn();
      this.resSignInMsg = "Please Fill The Value!"
      this.resSignInMsgCheck = "danger"
      setTimeout(() => {
        this.resSignInMsg = ' ';
        this.resSignInMsgCheck = ' ';
      }, 3000);
    }
  }
  //close pop up
  close() {
    this.renderer.setStyle(this.test.nativeElement, 'display', 'none');
    this.resSignupMsg = '';
  }
  //get profile image and validate
  file: any = null;
  fileUrl: any;
  documents: any = []
  max_error_front_img: string = '';
  GetFileChange(event: any, id: any) {
    for (var i = 0; i < event.target.files.length; i++) {
      console.log("event.target.files[i]", event.target.files[i]);
    }
    if (event.target.files && event.target.files[0]) {
      if (event.target.files[0].size < 2000000) {
        const reader = new FileReader();
        reader.onload = (e: any) => this.fileUrl = e.target.result;
        reader.readAsDataURL(event.target.files[0]);
        console.log(this.fileUrl);

        if (id == 0) {
          this.documents.file0 = event.target.files[0];
          console.log("this.documents.file0", this.documents.file0);
        }
        else if (id == 1) {
          this.documents.file1 = event.target.files[0];
          console.log("this.documents.file1", this.documents.file1);
        }
        this.max_error_front_img = "";
      } else {
        this.max_error_front_img = "Max file upload size to 2MB";
        this.fileUrl = 'https://breakthrough.org/wp-content/uploads/2018/10/default-placeholder-image.png';
        this.file = null;
      }
    }
  }

  removedocument(id: any) {
    let doc = 'document' + id;
    console.log(doc);
    this.profileForm.removeControl(doc);
    this.document_array.map((res: any, index: any) => {
      if (res.id == id) {
        this.document_array.splice(index);
      }

      this.count = this.document_array.length;
    })
  }








  // Tax Exempt Document Upload Function
  UploadDocuments: any = [];
  onFileChange(event: any) {
    if (event.target.files && event.target.files[0]) {
      // console.log(event.target.files[0], "file");

      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();
        reader.onload = (event: any) => {
          this.images.push(event.target.result);
          this.patchValues();
          console.log(this.images, "docimages");
        }
        reader.readAsDataURL(event.target.files[i]);
        console.log(event.target.files[i], "images file");
        this.UploadDocuments.push(event.target.files[i])
      }
    }
  }

  patchValues() {
    this.profileForm.patchValue({
      fileSource: this.images
    });
  }

  // Remove Image
  removeImage(url: any) {
    // console.log(this.images, url);
    this.images = this.images.filter(img => (img != url));
    this.patchValues();
  }

  // signInWithGoogle(): void {
  //   this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(
  //     (user: any) => {
  //       console.log("Loged In User", user);
  //       localStorage.setItem('Access_token',user.authToken);
  //       // this._utilityService.setObject(user, 'GoogleOAuth_USER')
  //       // this.dataService.loginedUserSubject.next(user);
  //       window.history.back();
  //     }
  //   );
  // }

  handleSuccess(captchaResponse: string): void {
    this.resSignupCaptchaMsg = '';
    this.captchaSuccess = true;
    this.captchaResponse = captchaResponse;
    this.captchaIsExpired = false;
  }

  handleReset(): void {
    this.captchaSuccess = false;
    this.captchaResponse = undefined;
    this.captchaIsExpired = false;
  }


  resSignupCaptchaMsg: string = '';
  resSignInCaptchaMsg: string = ''
  // resSignupCaptchaMsgCheck: string = '';
  getResponseBySignUp(): void {
    const response = this.captchaElem.getResponse();
    if (!response) {
      this.resSignupCaptchaMsg = 'There is no response - have you submitted captcha?'
    }
    setTimeout(() => {
      this.resSignupCaptchaMsg = ''
    }, 3000);
  }

  getResponseBySignIn(): void {
    const response = this.captchaElement.getResponse();
    if (!response) {
      this.resSignInCaptchaMsg = 'There is no response - have you submitted captcha?'
    }
    setTimeout(() => {
      this.resSignInCaptchaMsg = ''
    }, 3000);
  }
}
