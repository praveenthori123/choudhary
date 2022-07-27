import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ShippingServiceService {
  public _baseurl = environment.api_baseurl;
  constructor(public http: HttpClient, private sanitizer: DomSanitizer) {
  }

  header: any;
  requestedPackage: any = [];
  fedexshippingApi(shippingDataObj: any): Promise<any> {
    let end_point = "get-fedex-rates"
    console.log(shippingDataObj.zip);
    // let body = {
    //   "city": shippingDataObj.city,
    //   "state": shippingDataObj.state,
    //   "zip": shippingDataObj.zip,
    //   "country": shippingDataObj.country,
    //   "product_id": shippingDataObj.product_id
    // }

    let body = {
      "city": shippingDataObj.city,
      "state": shippingDataObj.state,
      "zip": shippingDataObj.zip,
      "country": shippingDataObj.country,
      "product_id": shippingDataObj.product_id
    }

    console.log("body", body);
    return this.http.post(this._baseurl + end_point, body).toPromise();
  }


  token: any;
  rateDetailThroughSaia(checkoutProductList: any): Promise<any> {
    this.header = localStorage.getItem('ecolink_user_credential');
    let httpHeaders : any;
    if (this.header) {
      this.token = JSON.parse(this.header).access_token;
      httpHeaders = new HttpHeaders({
        'Authorization': `Bearer ${this.token}`
      })
    }
    console.log("checkoutProductList", checkoutProductList.city);
    let saiaObj = {
      "city": checkoutProductList.city,
      "state": checkoutProductList.state,
      "zip": checkoutProductList.zip,
      "country": checkoutProductList.country,
      "product_id": checkoutProductList.product_id
    }

    console.log(saiaObj);


    let end_point = "get-saia-rates";
    if (this.token) {
      return this.http.post(this._baseurl + end_point, saiaObj, { headers: httpHeaders }).toPromise();
    }
    else {
      return this.http.post(this._baseurl + end_point, saiaObj).toPromise();
    }
  }
}
