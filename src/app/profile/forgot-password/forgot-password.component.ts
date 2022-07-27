import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  Renderer2,
  ViewChild,
  ElementRef, OnInit
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiServiceService } from 'src/app/Services/api-service.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  @ViewChild('test') test: ElementRef | any;
  resSignupMsg: string = '';
  resetMsg: string = '';
  invalidEmail: boolean = false;
  invalidUserEmail: string = '';
  password: string = '';
  confirmPassword: string = '';
  userObj: any;
  userCheck: boolean = false;
  params: any;
  resSignupMsgCheck: string = ' ';
  constructor(private __apiservice: ApiServiceService, private renderer: Renderer2, private route: Router, private router: ActivatedRoute) { }

  ngOnInit(): void {
    this.params = this.router.snapshot.params;
    console.log(this.params.params);
    if (this.params.params) {
      this.userCheck = true;
    }
  }
  //user forgot password section 
  ForgotPassword(form: NgForm) {
    if (this.userCheck) {
      if (form.valid) {
        let data = Object.assign({}, form.value);
        this.userObj = {
          email: data.email,
          password: data.password,
          password_confirmation: data.confirmPassword,
          token: this.params.params
        }
        this.__apiservice.forgotPassword(this.userObj).subscribe
          ((res: any) => {
            console.log(res);
            form.reset();
            this.route.navigateByUrl('/profile/auth')
          },
            (error: HttpErrorResponse) => {
              if (error.error.code = 500) {
                this.resSignupMsg = 'Invalid Email!'
                this.resSignupMsgCheck = "danger"
                form.reset();
              }
            }
          )
      }
      else {
        this.resSignupMsg = "Please Fill The Value!"
        this.resSignupMsgCheck = "danger"
      }
    }
    else {
      if (form.valid) {
        let data = Object.assign({}, form.value);
        this.userObj = {
          email: data.email
        }
        this.__apiservice.sendResetMail(this.userObj).subscribe
          ((res: any) => {
            console.log(res);
            form.reset();
            this.resSignupMsg = 'Forgot password email sent successfully!'
            this.resSignupMsgCheck = 'success'
          },
            (error: HttpErrorResponse) => {
              if (error.error.code = 400) {
                this.resSignupMsg = 'No User Found associated with this email!'
                this.resSignupMsgCheck = "danger"

              }
              else {
                this.resSignupMsg = "Please Fill The Value!"
                this.resSignupMsgCheck = "danger"
              }
              form.reset();
            }
          )
      }
      else {
        this.resSignupMsg = 'Please fill the value !'
      }
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
  //close pop up
  close() {
    this.renderer.setStyle(this.test.nativeElement, 'display', 'none');
    this.resSignupMsg = '';
  }
  //showing pop up till forgot password mail sent
  update() {
    if(!this.userCheck){
      this.resSignupMsg = 'Please Wait For a While...';
      this.resSignupMsgCheck='warning';
    }
  }
}
