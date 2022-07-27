import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {
  public _baseurl = environment.api_baseurl;
  header: any;
  token: any;
  subscribedmsg = new BehaviorSubject<any>({});
  readonly msg$ = this.subscribedmsg.asObservable();
  cookiesCheckoutData = new BehaviorSubject<any>([]);
  nonloginuserdetail = new BehaviorSubject<any>([]);
  itemCountSession = new BehaviorSubject<any>({});
  UserLocation = new BehaviorSubject<any>([]);
  UserAddress = new BehaviorSubject<any>({});
  CartItems = new BehaviorSubject<any>([]);
  dataEmpty = new BehaviorSubject<boolean>(false);
  GetCart = new BehaviorSubject<any>([]);
  CartDataForCookies = new BehaviorSubject<any>([]);
  HomePageData = new BehaviorSubject<any>([]);
  profiledashboard = new BehaviorSubject<boolean>(false);
  headerData = new BehaviorSubject<any>([]);
  toggleButton = new BehaviorSubject<any>({});
  lift_charge = new BehaviorSubject<any>([]);
  hazardous = new BehaviorSubject<number>(0);
  home_page = new BehaviorSubject<any>([]);
  constructor(public http: HttpClient, private sanitizer: DomSanitizer) { }

  getAllBlogs(count: any , dateTo ? :any , dateFrom ? :any ,  squary?: any, category?: any): Promise<any> {
    if(dateTo == 'Invalid date'){
      dateTo = '';
    }

    if(dateFrom == 'Invalid date'){
      dateFrom = '';
    }
    return this.http.get(this._baseurl + 'getallblogs' + "?page=" + count + "&dateTo=" + (dateTo ?? "") + "&dateFrom=" + (dateFrom ?? "") + "&squery=" + (squary ?? "") + "&category=" + (category ?? "")).toPromise();
  }
  getBlog(url: string): Observable<any> {
    return this.http.post(this._baseurl + 'getblog', { slug: url });
  }
  post(data: any): Observable<any> {
    return this.http.post(this._baseurl + 'register', data);
  }
  postCheckout(data: any): Promise<any> {
    return this.http.post(this._baseurl + 'register', data).toPromise();
  }
  newLatter(url: any, email: any): Observable<any> {
    return this.http.post(this._baseurl + url, { email: email });
  }
  login(url: any): Observable<any> {
    return this.http.post(this._baseurl + 'login', url);
  }
  getAllCategories(): Observable<any> {
    return this.http.get(this._baseurl + 'getCategories');
  }
  getAllCategoriesonshop(): Promise<any> {
    return this.http.get(this._baseurl + 'getCategories').toPromise();
  }

  getDetailByCategory(slug: any): Promise<any> {
    let url = 'getCategory';
    this.header = localStorage.getItem('ecolink_user_credential');
    const httpHeaders = new HttpHeaders({
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    })
    return this.http.post<any>(this._baseurl + url, { slug: slug }).toPromise();
  }
  getProductDetail(slug: any): Promise<any> {
    let url = 'getProduct';
    return this.http.post<any>(this._baseurl + url, { slug: slug }).toPromise();
  }

  addItemToCart(product_id: any, quantity: any, action: any, lift_charges?: any): Promise<any> {
    let url = 'addCartItems';
    this.header = localStorage.getItem('ecolink_user_credential');
    this.token = JSON.parse(this.header).access_token;
    let user_id = JSON.parse(this.header).user_id;
    const httpHeaders = new HttpHeaders({
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    })
    let body =
    {
      user_id: user_id,
      product_id: product_id,
      quantity: quantity,
      action: action,
      lift_gate: lift_charges
    }
    return this.http.post<any>(this._baseurl + url, body, { headers: httpHeaders }).toPromise();
  }
  getItemFromCart(): Promise<any> {
    let url = 'getCartItems';
    this.header = localStorage.getItem('ecolink_user_credential');
    this.token = JSON.parse(this.header).access_token;
    let user_id = JSON.parse(this.header).user_id;
    const httpHeaders = new HttpHeaders({
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    })
    let body =
    {
      user_id: user_id
    }
    return this.http.post<any>(this._baseurl + url, body, { headers: httpHeaders }).toPromise()
  }

  deleteItemFromCart(product_id: any): Promise<any> {
    let url = 'deleteCartItems';
    this.header = localStorage.getItem('ecolink_user_credential');
    this.token = JSON.parse(this.header).access_token;
    let user_id = JSON.parse(this.header).user_id;
    const httpHeaders = new HttpHeaders({
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    })
    let body =
    {
      user_id: user_id,
      product_id: product_id
    }
    return this.http.post<any>(this._baseurl + url, body, { headers: httpHeaders }).toPromise()
  }

  getCheckoutProducts(): Promise<any> {
    let url = 'checkout';
    this.header = localStorage.getItem('ecolink_user_credential');
    this.token = JSON.parse(this.header).access_token;
    let user_id = JSON.parse(this.header).user_id;
    const httpHeaders = new HttpHeaders({
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    })
    let body =
    {
      user_id: user_id
    }
    return this.http.post<any>(this._baseurl + url, body, { headers: httpHeaders }).toPromise()
  }

  addItemToWishlist(product_id: any) {
    let url = 'addWishlistItems';
    this.header = localStorage.getItem('ecolink_user_credential');
    this.token = JSON.parse(this.header).access_token;
    let user_id = JSON.parse(this.header).user_id;
    const httpHeaders = new HttpHeaders({
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    })

    let body = {
      user_id: user_id,
      product_id: product_id
    }
    return this.http.post<any>(this._baseurl + url, body, { headers: httpHeaders })

  }

  getWishListItem(): Promise<any> {
    let url = 'getWishlistItems';
    this.header = localStorage.getItem('ecolink_user_credential');
    this.token = JSON.parse(this.header).access_token;
    let user_id = JSON.parse(this.header).user_id;
    const httpHeaders = new HttpHeaders({
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    })

    let body = {
      user_id: user_id
    }
    return this.http.post<any>(this._baseurl + url, body, { headers: httpHeaders }).toPromise();
  }

  deleteWishlistItems(product_id: any): Promise<any> {
    let url = 'deleteWishlistItems';
    this.header = localStorage.getItem('ecolink_user_credential');
    this.token = JSON.parse(this.header).access_token;
    let user_id = JSON.parse(this.header).user_id;
    const httpHeaders = new HttpHeaders({
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    })
    let body =
    {
      user_id: user_id,
      product_id: product_id
    }
    return this.http.post<any>(this._baseurl + url, body, { headers: httpHeaders }).toPromise();
  }


  getSantizedData(data: any) {
    let trustedUrl = this.sanitizer.bypassSecurityTrustHtml(data);
    return trustedUrl;
  }
  getSantizedUrl(url: any) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  home(): Observable<any> {
    return this.http.get(this._baseurl + 'home');
  }
  homeData(): Promise<any> {
    return this.http.get(this._baseurl + 'home').toPromise();
  }

  globalSearchData(searchItem: any) {
    let url = "globalSearch"
    let name = {
      name: searchItem
    }

    return this.http.post(this._baseurl + url, name);
  }


  getUserAddress(): Promise<any> {
    this.header = localStorage.getItem('ecolink_user_credential');
    this.token = JSON.parse(this.header).access_token;
    let user_id = JSON.parse(this.header).user_id;
    const httpHeaders = new HttpHeaders({
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    })
    let body = {
      user_id: user_id
    }
    return this.http.post(this._baseurl + 'getUserAddresses', body, { headers: httpHeaders }).toPromise();
  }

  addUserAddresses(data: any): Observable<any> {
    this.header = localStorage.getItem('ecolink_user_credential');
    this.token = JSON.parse(this.header).access_token;
    let user_id = JSON.parse(this.header).user_id;
    const httpHeaders = new HttpHeaders({
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    })
    data.user_id = user_id
    return this.http.post(this._baseurl + 'addUserAddresses', data, { headers: httpHeaders })
  }

  getUserProfileDetail(): Observable<any> {
    this.header = localStorage.getItem('ecolink_user_credential');
    this.token = JSON.parse(this.header).access_token;
    let user_id = JSON.parse(this.header).user_id;
    const httpHeaders = new HttpHeaders({
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    })
    let body = {
      user_id: user_id
    }
    return this.http.post(this._baseurl + 'userInfo', body, { headers: httpHeaders })
  }

  deleteUserAddress(item_id: any): Promise<any> {
    this.header = localStorage.getItem('ecolink_user_credential');
    this.token = JSON.parse(this.header).access_token;
    const httpHeaders = new HttpHeaders({
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    })
    console.log(item_id);
    return this.http.post(this._baseurl + 'deleteUserAddresses', { address_id: item_id }, { headers: httpHeaders }).toPromise()
  }

  async filterProduct(dataforfilter: any): Promise<any> {
    let url = 'filterProduct';
    const { sortby } = dataforfilter;
    delete dataforfilter.sortby;
    const request = await fetch(this._baseurl + url + "?sortby=" + sortby, {
      method: 'POST',
      body: JSON.stringify(dataforfilter)
    });
    const data = await request.json();
    console.log("Data from fetch API -> ", data);
    return this.http.post(this._baseurl + url + "?sortby=" + sortby, dataforfilter).toPromise();
  }
  editUserAddress(item: any): Observable<any> {
    this.header = localStorage.getItem('ecolink_user_credential');
    this.token = JSON.parse(this.header).access_token;
    let user_id = JSON.parse(this.header).user_id;
    const httpHeaders = new HttpHeaders({
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    })
    item.user_id = user_id;
    return this.http.post(this._baseurl + 'editUserAddresses', item, { headers: httpHeaders });
  }

  storeOrder(orderObj: any) {
    this.header = localStorage.getItem('ecolink_user_credential');
    this.token = JSON.parse(this.header).access_token;
    let user_id = JSON.parse(this.header).user_id;
    const httpHeaders = new HttpHeaders({
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    })
    orderObj.user_id = user_id;
    return this.http.post(this._baseurl + 'storeOrder', orderObj, { headers: httpHeaders })
  }

  getOrderData(page: any): Promise<any> {
    this.header = localStorage.getItem('ecolink_user_credential');
    this.token = JSON.parse(this.header).access_token;
    let user_id = JSON.parse(this.header).user_id;
    const httpHeaders = new HttpHeaders({
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    })
    let body = {
      user_id: user_id
    }
    return this.http.post(this._baseurl + 'getOrder' + '?page=' + ((page == 0) ? 1 : page), body, { headers: httpHeaders }).toPromise();
  }

  CancelOrderApi(id: any): Promise<any> {
    this.header = localStorage.getItem('ecolink_user_credential');
    this.token = JSON.parse(this.header).access_token;
    let user_id = JSON.parse(this.header).user_id;
    const httpHeaders = new HttpHeaders({
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    })

    let body = {
      id: id,
      user_id: user_id
    }

    return this.http.post(this._baseurl + 'cancelOrder', body, { headers: httpHeaders }).toPromise();
  }
  storeReturnOrder(storeObj: any) {
    this.header = localStorage.getItem('ecolink_user_credential');
    this.token = JSON.parse(this.header).access_token;
    let user_id = JSON.parse(this.header).user_id;
    const httpHeaders = new HttpHeaders({
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    })
    storeObj.user_id = user_id
    return this.http.post(this._baseurl + 'storeReturnOrder', storeObj, { headers: httpHeaders })
  }
  getReturnOrder() {
    this.header = localStorage.getItem('ecolink_user_credential');
    this.token = JSON.parse(this.header).access_token;
    let user_id = JSON.parse(this.header).user_id;
    const httpHeaders = new HttpHeaders({
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    })
    let body = {
      user_id: user_id
    }
    return this.http.post(this._baseurl + 'getReturnOrder', body, { headers: httpHeaders })
  }
  getPageBySlug(slug: any) {
    let url = 'getPage'
    return this.http.post(this._baseurl + url, { slug: slug })
  }
  submitFormDetail(data: any): Observable<any> {
    return this.http.post(this._baseurl + 'contact', data);
  }
  getUserLogoutProfile(): Observable<any> {
    this.header = localStorage.getItem('ecolink_user_credential');
    this.token = JSON.parse(this.header).access_token;
    let user_id = JSON.parse(this.header).user_id;
    const httpHeaders = new HttpHeaders({
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    })
    let body = {
      user_id: user_id
    }

    return this.http.post(this._baseurl + 'logout', body, { headers: httpHeaders })
  }
  editUserProfileInfo(data: any): Observable<any> {
    this.header = localStorage.getItem('ecolink_user_credential');
    this.token = JSON.parse(this.header).access_token;
    let user_id = JSON.parse(this.header).user_id;
    const httpHeaders = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    })

    console.log(user_id);

    data.append("user_id", user_id)
    // data.profile_image = "https://chirpybazaar.com/wp-content/uploads/2019/05/dummy-man-570x570.png";
    return this.http.post(this._baseurl + 'editUserInfo', data, { headers: httpHeaders })
  }

  getProductById(product_id: any): Promise<any> {
    let url = "getProductById";
    return this.http.post(this._baseurl + url, { product_id: product_id }).toPromise();
  }

  forgotPassword(data: any): Observable<any> {
    return this.http.post(this._baseurl + 'forgotPassword', data);
  }
  sendResetMail(data: any): Observable<any> {
    return this.http.post(this._baseurl + 'forgotPasswordEmail', data)
  }
  getTaxForUser(pincode: any): Observable<any> {
    console.log(pincode);
    let body = {
      zip: pincode
    }
    return this.http.get(this._baseurl + 'getTaxByZip' + '?zip=' + pincode)
  }

  // customerLocation: any;
  // getUserLocation() {
  //   this.UserLocation.subscribe(res => {
  //     if (res) {
  //       let pincode = res[6] ? res[6].long_name : 30030;
  //       let Location = res[3] ? res[3].long_name : 'Decatur';
  //       this.customerLocation = Location + "" + "," + " " + pincode;
  //     }
  //   });
  //   return this.customerLocation;
  // }

  getItemFromState(): Observable<any> {
    let url = 'getCartItems';
    this.header = localStorage.getItem('ecolink_user_credential');
    this.token = JSON.parse(this.header).access_token;
    let user_id = JSON.parse(this.header).user_id;
    const httpHeaders = new HttpHeaders({
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    })
    let body =
    {
      user_id: user_id
    }
    return this.http.post<any>(this._baseurl + url, body, { headers: httpHeaders })
  }


  checkforuser(): Promise<any> {
    this.header = localStorage.getItem('ecolink_user_credential');
    this.token = JSON.parse(this.header).access_token;
    let user_id = JSON.parse(this.header).user_id;
    const httpHeaders = new HttpHeaders({
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    })
    return this.http.get(this._baseurl + 'current-user', { headers: httpHeaders }).toPromise();
  }

  getStaticData(string: any): Promise<any> {
    console.log(string);
    return this.http.get(this._baseurl + 'getStaticValue' + "?name=" + string).toPromise();
  }

  uploadocuments(documents: FormData): Promise<any> {
    this.header = localStorage.getItem('ecolink_user_credential');
    this.token = JSON.parse(this.header).access_token;
    const httpHeaders = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    })
    return this.http.post(this._baseurl + 'uploadDocuments', documents, { headers: httpHeaders }).toPromise();
  }

  getNotice(): Promise<any> {
    return this.http.get(this._baseurl + 'getNotice').toPromise();
  }

  getQuickBookApiData(credit_card_value: any) {
    this.header = localStorage.getItem('ecolink_user_credential');
    this.token = JSON.parse(this.header).access_token;
    const httpHeaders = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    })

    return this.http.post(this._baseurl + 'qboPayment', credit_card_value, { headers: httpHeaders }).toPromise();
  }
  // getStates() {
  //   return this.http.get(this._baseurl + 'getCityList');
  // }
  getCitiesByState()  {
    return this.http.get(this._baseurl + 'getCityList');
  }
  
  verifyemail(): Promise<any> {
    this.header = localStorage.getItem('ecolink_user_credential');
    this.token = JSON.parse(this.header).access_token;
    let user_email = JSON.parse(this.header).user.email
    let object = {
      email: user_email,
      token: this.token
    }
    return this.http.post(this._baseurl + 'verifyEmail', object).toPromise()
  }
}