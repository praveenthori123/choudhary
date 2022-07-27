import { Component, ElementRef, OnInit, Renderer2, Inject, ViewChild, HostListener, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/Services/api-service.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  newsletter_email: any;
  invalidUserEmail: string = '';
  invalidEmail: boolean = false;
  windowScrolled!: boolean;
  isShow: any;
  topPosToStartShowing = 100;

  constructor(@Inject(DOCUMENT) private document: Document, private _ApiService: ApiServiceService, private router: Router, private renderer: Renderer2) { }
  @ViewChild('close') closer!: ElementRef;
  ngOnInit(): void {
  }
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
  subscribe() {
    if (this.newsletter_email == undefined) {
      let resSignupMsg = 'Please Enter Email !'
      let resSignupMsgCheck = 'danger';
      let object = {
        resSignupMsg: resSignupMsg,
        resSignupMsgCheck: resSignupMsgCheck
      }
      this._ApiService.subscribedmsg.next(Object.assign({}, object));
    }
    else {
      let object = {
        resSignupMsg: 'Wait for while....',
        resSignupMsgCheck: 'warning'
      }
      this._ApiService.subscribedmsg.next(Object.assign({}, object));
      let endpoint = 'newsletter'
      this._ApiService.newLatter(endpoint, this.newsletter_email).subscribe(res => {
        console.log(res);
        let resSignupMsg = 'Email Subscribed !'
        let resSignupMsgCheck = 'success';
        this.newsletter_email = undefined;
        object = {
          resSignupMsg: resSignupMsg,
          resSignupMsgCheck: resSignupMsgCheck
        }
        this._ApiService.subscribedmsg.next(Object.assign({}, object));
        setTimeout(() => {
          object = {
            resSignupMsg: '',
            resSignupMsgCheck: ''
          }
          this._ApiService.subscribedmsg.next(Object.assign({}, object));
        }, 2000);
      })

    }
    this.scrollToTop();
  }
  routeOnSamePage(slug: any) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['/' + slug]);
  }
  @HostListener('window:scroll')
  checkScroll() {
    const scrollPosition =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;

    if (scrollPosition >= this.topPosToStartShowing) {
      this.isShow = true;
    } else {
      this.isShow = false;
    }
  }
  scrollToTop() {
    window.scrollTo(0, 0);
  }
}
