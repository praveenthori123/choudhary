import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) { }
  user_detail: any;
  email_token: any;
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (localStorage.getItem('ecolink_user_credential')) {
      this.email_token = localStorage.getItem('email_token');
      this.user_detail = localStorage.getItem('ecolink_user_credential');
      let detail = JSON.parse(this.user_detail);
      if (detail.user.email_verified==0) {
        localStorage.setItem('string','existinguser');
        console.log("if");
        return true;
      }

      else if(this.email_token == detail.user.remember_token){
        console.log("else if");
        localStorage.setItem('string','existinguser');
        return true;
      }

      else {
        localStorage.removeItem('string');
        localStorage.removeItem('ecolink_user_credential')
        this.router.navigateByUrl("/profile/auth");
        return false;
      }
    }
    else{
      localStorage.removeItem('string');
      this.router.navigateByUrl('/profile/auth');
      localStorage.removeItem('ecolink_user_credential')
      return false;
    }
  }
 

}