import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class CookiesService {
  cookieValue: string = '';
  getValue:any;

  constructor(private cookieService: CookieService) {
  }

  SaveCartData(cartObj: any) {
    let obj = JSON.stringify(cartObj);
    this.cookieService.set("CartObj", obj); // To Set Cookie
  }
  

  GetCartData(){
    if(this.cookieService.get('CartObj').length!=0) {
      this.getValue = JSON.parse(this.cookieService.get('CartObj'))
      return this.getValue;
    }
    else {
      return 'empty';
    }
  }

  DeleteCartData(){
    this.cookieService.deleteAll();
  }

  DeleteServiceWorker() {
    // this.cookieService.delete('Cookies.cpsession');
  }
}
