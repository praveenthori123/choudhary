import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/Services/api-service.service';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { CookiesService } from 'src/app/Services/cookies.service';
import { ShippingServiceService } from 'src/app/Services/shipping-service.service';
import { HttpErrorResponse } from '@angular/common/http';
import { BillingFormComponent } from '../billing-form/billing-form.component';
import { ConnectionServiceModule } from 'ng-connection-service';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-product-checkout',
  templateUrl: './product-checkout.component.html',
  styleUrls: ['./product-checkout.component.scss']
})
export class ProductCheckoutComponent implements OnInit {
  selectedPaymentMethod: any;
  producttotal: any = 0
  totalweight: any = 0
  Responsewait: boolean = false;
  invalidCard = false;
  invalidCSC = false;
  discountCheck: boolean = true;
  disableOrderButton: boolean = true;
  checkforcoupon: boolean = false;
  shippingChargeError: string = ''
  formcheck: boolean = true;
  selectedindex: any
  couponCheck: boolean = false;
  taxcheckfornonlogin: boolean = false;
  errormsg: string = '';
  taxerror: string = '';
  shippingdetail: any = {}
  couponValue: string = '';
  couponCode: any;
  rate: number = 0;
  payment_status: any;
  placeordercheck: boolean = true;
  openAddressDropdown: boolean = false;
  selectedShippingMethod: string = '';
  couponDiscount: any = 0;
  showDropdowm: boolean = false;
  getAllUserAddresses: any = [];
  CheckoutProduct: any = [];
  carts: any = [];
  pincode: any;
  selectedRadioButton: any;
  formShimmer: boolean = true;
  paypalItems: any = {}
  orderObj: any;
  showPaypal: boolean = false;
  paypalProductDetails: any = {};
  paypal: any = [];
  taxCheck: boolean = false;
  paymentCheck: boolean = true;
  shippingCharge: any = 0;
  tax_exempt_user: number = 0
  checkoutShimmer: boolean = true;
  checkoutProductItem: any = {};
  public payPalConfig?: IPayPalConfig;
  shippingDataObj: any = {};
  billingUserDetail: any = [];
  fedexshippingboolean: boolean = true;
  saiashippingboolean: boolean = false;
  user_credential: any;
  SelectedAddressVariable: any = "Choose Another Address";
  verifiedUser: boolean = true;
  paymentMethod: boolean = false;
  service_charge: any = 0;
  helpershippingdetailarray: any = [];
  credit_card_amount: number = 0;
  date: any;
  month: any;
  formLabelForNonLoggedInUser: string = 'Billing & Shipping Details'
  constructor(private __apiservice: ApiServiceService,
    private route: Router,
    private _cookies: CookiesService,
    private _ShippingApi: ShippingServiceService,
    private router: Router,
    private _fb: FormBuilder) { }

  async ngOnInit() {
    let servicecharge = localStorage.getItem('servicecharge');
    if (servicecharge) {
      let parsedservicecharge = JSON.parse(servicecharge)
      this.service_charge = parsedservicecharge;
    }
    console.log(this.service_charge);
    this.user_credential = localStorage.getItem('ecolink_user_credential');
    this.shippingDataObj = {
      address: "",
      city: "",
      country: "",
      email: "",
      mobile: "",
      name: "",
      state: "",
      landmark: "",
      pincode: ""
    }
    await this.checkoutProduct();
    this.CheckoutProduct?.map((res: any) => {
      console.log("res : ", res);
      if (res.carts.length == 0) {
        this.route.navigateByUrl('/cart');
      }
    })


  }
  submitted: boolean = false;
  mainForm: FormGroup = this._fb.group({
    creditCardHolderName: ['', [Validators.required]],
    creditCard: ['', [Validators.required]],
    cvc: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(4)]],
    exp_year: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]],
    exp_month: ['', [Validators.required, Validators.maxLength(2)]],

  });
  carderror: string = ''
  invalidName: boolean = false;
  async onSubmit() {
    this.submitted = true;
    this.date = new Date().getFullYear();
    this.month = new Date().getMonth();
    console.log("date", this.date);
    console.log(this.mainForm, this.mainForm.valid);
    if (this.mainForm.valid) {
      if (this.mainForm.value.exp_year < 2022) {
        console.log("year wrong");
        this.carderror = 'Please Enter the correct year'
      }
      else if (this.mainForm.value.exp_year == 2022) {
        if (this.mainForm.value.exp_month < this.month) {
          console.log("year wrong");
          this.carderror = 'Please Enter the correct month'
        }
      }

      else if (this.mainForm.value.exp_month < 1 || this.mainForm.value.exp_month > 12) {
        this.carderror = 'Please Enter the correct month'
      }



      // this.carderror = ''
      console.log("this.mainForm", this.mainForm.value);
      let credit_card_value = {
        card_name: this.mainForm.value.creditCardHolderName,
        card_number: this.mainForm.value.creditCard,
        card_expMonth: this.mainForm.value.exp_month,
        card_expYear: this.mainForm.value.exp_year,
        card_cvc: this.mainForm.value.cvc,
        amount: (this.rate == -1 ? 0 : this.rate) + this.totalLiftCharge + ((this.totalweight > 70) ? this.saiaAmount : this.shippingCharge) + this.couponDiscount + this.credit_card_amount
      }
      credit_card_value.amount = credit_card_value.amount.toFixed(2)
      let formdata = new FormData();

      formdata.append("card_name", credit_card_value.card_name)
      formdata.append("card_number", credit_card_value.card_number)
      formdata.append("card_expMonth", credit_card_value.card_expMonth)
      formdata.append("card_expYear", credit_card_value.card_expYear)
      formdata.append("card_cvc", credit_card_value.card_cvc)
      formdata.append("amount", credit_card_value.amount)
      console.log("credit_card_value", credit_card_value);
      if (this.carderror == '') {
        await this.__apiservice.getQuickBookApiData(formdata)
          .then((res: any) => {
            this.payerDetail = {}
            console.log("res", res);
            if (res.data.response.errors) {
              this.carderror = res.data.response.errors[0].message
            }
            else {
              this.carderror = ''
              this.payerDetail = res.data;
            }
          })

          .catch((error: any) => {
            this.carderror = error.message
          })
      }
    }
    else {
      this.carderror = 'Please fill the card value!'
    }
  }

  inputCard(event: any) {
    if (
      event.key.length === 1 &&
      !/^[0-9]$/.test(event.key)
    ) {
      event.preventDefault();
    }
  }
  validateCard(event: any) {
    const value = event.target.value;

    if (
      value &&
      /^[0-9]+$/.test(value) &&
      value.length < 16
    ) {
      this.invalidCard = true;
    }

    else {
      this.invalidCard = false;
    }
  }
  inputCSC(event: any) {
    if (
      event.key.length === 1 &&
      !/^[0-9]$/.test(event.key)
    ) {
      event.preventDefault();
    }
  }
  inputyear(event: any) {
    if (
      event.key.length === 1 &&
      !/^[0-9]$/.test(event.key)
    ) {
      event.preventDefault();
    }
  }
  inputmonth(event: any) {
    if (
      event.key.length === 1 &&
      !/^[0-9]$/.test(event.key)
    ) {
      event.preventDefault();
    }
  }

  inputName(event: any) {
    if (event.target.length === 0) {
      this.invalidName = true;
    }
  }
  validateCSC(event: any) {
    const value = event.target.value;

    if (
      value &&
      /^[0-9]+$/.test(value) &&
      value.length < 3
    ) {
      this.invalidCSC = true;
    }

    else {
      this.invalidCSC = false;
    }
  }

  invalidyear: boolean = false;
  invalidmonth: boolean = false;

  validateyear(event: any) {
    const value = event.target.value;
    if (
      value &&
      /^[0-9]+$/.test(value) &&
      value.length < 4
    ) {
      this.invalidyear = true;
    }

    else {
      this.invalidyear = false;
    }
  }
  validatemonth(event: any) {
    const value = event.target.value;
    if (
      value &&
      /^[0-9]+$/.test(value) &&
      value.length < 2
    ) {
      this.invalidmonth = true;
    }

    else {
      this.invalidmonth = false;
    }
  }

  // get tax value 
  getTaxExempt() {
    console.log("working", this.billingUserDetail[0]?.tax_exempt)
    if (!(this.shippingDataObj.valid)) {
      this.rate = 0
    }
    else if (localStorage.getItem('ecolink_user_credential') != null) {
      console.log("notavailble")
      this.__apiservice.getUserProfileDetail().subscribe((res: any) => {
        this.tax_exempt_user = res.data.tax_exempt;
        if (!this.tax_exempt_user) {
          console.log(this.shippingDataObj.pincode)
          let pincode = this.shippingDataObj.pincode;
          if (pincode) {
            console.log("inside if ", pincode)
            if (this.discount100 == 100) {
              console.log(this.discount100, this.taxCheck, this.rate);
              this.rate = 0
              this.taxCheck = false;
            }
            else {
              this.taxCheck = true;
              this.__apiservice.getTaxForUser(pincode).subscribe((res: any) => {
                this.rate = res.data.rate;
              },

                (error: any) => {
                  this.rate = -1;
                  this.taxerror = "*Enter Valid ZIP Code"
                })
            }
          }
          else {
            this.rate = -1;
            this.taxerror = "*Enter Valid ZIP Code"
          }
        }
        else {
          this.taxCheck = false;
          this.rate = 0;
          this.taxerror = ""
        }
      })
    }
    else {
      if (this.billingUserDetail[0]?.tax_exempt == 0) {
        console.log("this.shippingDataObj", this.shippingDataObj);
        let pincode = this.shippingDataObj.pincode
        if (pincode) {
          this.__apiservice.getTaxForUser(pincode).subscribe(
            (res: any) => {
              console.log(res);
              this.taxCheck = true
              this.rate = res.data.rate;
              this.taxerror = ''
            },
            (error: any) => {
              this.taxCheck = true
              this.rate = -1;
              this.taxerror = "No Tax Found"
            }
          )
        }
      }

      else {
        this.taxCheck = false;
        this.rate = 0;
        this.taxerror = ""
      }
    }
    console.log(this.discount100)

  }

  getSelectedShippingAddress(event: any) {
    this.saiaAmount = 0;
    this.shippingCharge = 0
    console.log("Hellow ==>", event);
    this.shippingDataObj = event;
    let pincode = this.shippingDataObj?.pincode;

    if (this.shippingDataObj?.pincode) {
      console.log("its working")
      this.getProduct();
      // if (pincode) {
        this.getTaxExempt();
      // }
    }
    else {
      this.saiaValues = -1
      this.shippingChargeError = ''
      this.rate=0;
      this.taxCheck = false;
    }

  }

  //route on profile page
  routeToProfile() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['/profile']);
  }

  //get product for billing
  dataFromLocation: any;
  async checkoutProduct() {
    this.billingUserDetail = [];
    if (localStorage.getItem('ecolink_user_credential') != null) {
      await this.__apiservice.getCheckoutProducts()
        .then(res => {
          if (res) {
            console.log(res);
            if (res.code == 200) {
              this.formShimmer = false;
              this.checkoutShimmer = false;
            }
            if (res.data.carts?.length == 0) {
              this.route.navigateByUrl('/cart')
            }
            res.data.addresses.map((resp: any) => {
              resp.pincode = resp.zip;
            })
            res.data.carts?.map((response: any) => {
              this.totalweight += (response.quantity * response.product.weight);
            })
            if (this.totalweight > 70) {
              this.selectedShippingMethod = 'saia';
            }
            else if (this.totalweight <= 70) {
              this.selectedShippingMethod = 'fedex';
            }
            console.log(this.totalweight)
            this.CheckoutProduct.push(res.data);
            this.billingUserDetail.push(res.data.user);
          }
        })

        .catch(error => {
          if (error.status == 400 || error.status == 401) {
            console.log(error.status);
            this.router.navigateByUrl('/cart')
          }
        })
      console.log("checkout", this.CheckoutProduct);
      let lift_gate_charge = localStorage.getItem('Lift_Gate_Charge_login');
      if (lift_gate_charge) {
        this.totalLiftCharge = JSON.parse(lift_gate_charge);
      }

      this.CheckoutProduct.map((res: any) => {
        console.log("res.product.hazardous", res);
        this.hazardous = res.hazardous_amt;
        this.credit_card_amount = res.payable;
      })

    }
    else {
      if (localStorage.getItem('Address')) {
        this.dataFromLocation = localStorage.getItem('Address')
        this.dataFromLocation = JSON.parse(this.dataFromLocation)
      }
      else {
        console.log(this.CheckoutProduct);
      }
      this.getsubjectBehaviour();
    }
  }


  fedexSpinner: boolean = false;
  async FedexShippingObj(fedexApiObj: any) {
    this.fedexSpinner = true;
    let productDetail: any = [];

    this._ShippingApi.fedexshippingApi(fedexApiObj)
      .then((res: any) => {
        this.fedexSpinner = false;
        this.shippingerror = -1
        this.shippingChargeError = '';
        if (typeof res.rate == 'object') {
          console.log(this.shippingCharge)
          this.shippingCharge = ''
          this.shippingChargeError = "*ZIP Code not Serviceable";
          this.shippingerror = this.shippingChargeError ? 0 : -1
        }
        else {
          console.log(this.shippingCharge)
          this.shippingCharge = res.rate;
          this.shippingChargeError = "";
          this.shippingerror = this.shippingChargeError ? 0 : -1
        }
        console.log(typeof this.shippingCharge == 'object');
      })
      .catch((error: any) => {
        this.fedexSpinner = false;
        console.log(error.message);
        this.shippingCharge = ''
        this.shippingChargeError = "*ZIP Code not Serviceable";
        this.shippingerror = this.shippingChargeError ? 0 : -1
        console.log(typeof this.shippingCharge);
      })
  }

  getpaypalitem() {
    this.paypal = [];
    let discount_paypal = this.couponDiscount;
    let payment_object: any = [];
    console.log(discount_paypal);
    this.CheckoutProduct.map((response: any) => {
      console.log("response", response);
      response.carts.map((resp: any) => {
        let object: any = {};
        this.paypalItems = {};
        if (resp.product.sale_price * resp.quantity > discount_paypal) {
          let price = (resp.product.sale_price * resp.quantity) - discount_paypal;
          object.price = price;
          object.name = resp.product.name;
          discount_paypal = 0;
          console.log(object);
          payment_object.push(object);
          this.paypalItems.name = resp.product.name;
          this.paypalItems.quantity = 1;
          this.paypalItems.category = "PHYSICAL_GOODS";
          this.paypalItems.unit_amount = { currency_code: "USD", value: parseFloat(object.price).toFixed(2) }
          if (this.paypalItems.unit_amount.value > 0) {
            this.paypal.push(this.paypalItems);
          }
        }

        else if (resp.product.sale_price * resp.quantity < discount_paypal) {
          let price = discount_paypal - (resp.product.sale_price * resp.quantity);
          object.price = 0;
          object.name = resp.product.name;
          discount_paypal = price;
          console.log(object);
          payment_object.push(object);
          this.paypalItems.name = resp.product.name;
          this.paypalItems.quantity = 1;
          this.paypalItems.category = "PHYSICAL_GOODS";
          this.paypalItems.unit_amount = { currency_code: "USD", value: parseFloat(object.price).toFixed(2) }
          console.log("this.paypalItems.unit_amount.value", this.paypalItems.unit_amount.value);
          if (this.paypalItems.unit_amount.value > 0) {
            this.paypal.push(this.paypalItems);
          }
        }
      })
      console.log("payment_object", payment_object);
      console.log(this.paypal);

    })


  }

  // get shipping charges for product
  getProduct() {
    this.checkoutProductItem = [];
    let productDetail: any = [];
    console.log(this.shippingDataObj, this.CheckoutProduct);
    this.CheckoutProduct?.map((res: any) => {
      res.carts.map((resp: any) => {
        let product = {
          id : resp.product_id ,
          qty : resp.quantity
        }
        productDetail.push(product);
      })
    })
    console.log("this.CheckoutProduct", this.dataFromLocation ? this.dataFromLocation : "Not Available");
    let saiacredobj = {
      country: "",
      city: "",
      state: "",
      pincode: ""
    }
    this.dataFromLocation?.map((res: any, index: any) => {
      console.log(res);
      res.types?.map((response: any) => {
        if (response == 'postal_code') { saiacredobj.pincode = res.long_name }
        if (response == 'country') { saiacredobj.country = res.short_name; }
        if (response == 'administrative_area_level_1') { saiacredobj.state = res.short_name }
        if (response == 'locality') { saiacredobj.city = res.long_name }
      })

    })
    this.checkoutProductItem.country = this.shippingDataObj.country ? this.shippingDataObj.country : "";
    this.checkoutProductItem.state = this.shippingDataObj.state ? this.shippingDataObj.state : "";
    this.checkoutProductItem.city = this.shippingDataObj.city ? this.shippingDataObj.city : "";
    this.checkoutProductItem.zip = this.shippingDataObj.pincode ? this.shippingDataObj.pincode : "";
    this.checkoutProductItem.product_id = productDetail;
    console.log(this.checkoutProductItem);

    setTimeout(() => {
      this.getsaiashippingrate();
      this.FedexShippingObj(this.checkoutProductItem);
    }, 1500);
  }




  saiaValues: any = -1;
  saiaAmount: number = 0;
  saiaSpinner: boolean = false;
  shippingerror: any = -1;

  // get product shipping info on checkout page
  getsaiashippingrate() {
    this.saiaSpinner = true;
    this.shippingerror = -1
    this._ShippingApi.rateDetailThroughSaia(this.checkoutProductItem)
      .then((res: any) => {
        this.saiaSpinner = false;
        this.saiaAmount = res.rate;
        this.saiashippingboolean = true;
        if (this.saiaAmount == 0) {
          this.saiaValues = 0;
          this.saiaAmount = 0
          this.shippingerror = this.saiaValues
        }
        else {
          this.saiaValues = res.rate
          this.shippingerror = this.saiaValues
        }
      })
      .catch((error: any) => {
        this.saiaSpinner = false;
        this.saiaValues = 0;
        this.shippingerror = this.saiaValues
      })
  }
  //get total amount of product including taxes and shipping charges
  async getOrderInfo() {
    if (this.selectedPaymentMethod == 'credit_card') {
      await this.onSubmit();
    }
    console.log(this.CheckoutProduct);
    console.log(this.billingDetails, this.shippingDataObj);
    let products_cart: any = [];
    this.CheckoutProduct?.map((res: any) => {
      let cart_object: any = {};
      res.carts?.map((resp: any) => {
        cart_object = {};
        console.log(resp);
        cart_object.product_name = resp.product.name,
          cart_object.product_price = resp.product.sale_price,
          cart_object.quantity = resp.quantity
        products_cart.push(cart_object);
      })
    })

    if (this.carderror.length == 0) {
      console.log(this.total ? this.total : this.Extra_Charges, this.total, this.Extra_Charges)
      let total_order_amount = (this.total ? this.total : this.Extra_Charges) + this.service_charge
      console.log(total_order_amount, this.service_charge, (this.total ? this.total : this.Extra_Charges))
      this.orderObj = {
        billing_name: this.billingUserDetail[0]?.name,
        billing_email: this.billingUserDetail[0]?.email ,
        billing_mobile: this.billingUserDetail[0].mobile.toString(),
        billing_address: this.billingUserDetail[0]?.address,
        billing_landmark: this.billingUserDetail[0]?.address ,
        billing_country: this.billingUserDetail[0]?.country ,
        billing_state: this.billingUserDetail[0]?.state ,
        billing_city: this.billingUserDetail[0]?.city ,
        billing_zip: this.billingUserDetail[0]?.pincode.toString(),
        shipping_name: this.shippingDataObj.name,
        shipping_email: this.shippingDataObj.email,
        shipping_mobile: this.shippingDataObj.mobile.toString(),
        shipping_address: this.shippingDataObj.address,
        shipping_landmark: this.shippingDataObj.landmark ? this.shippingDataObj.landmark : this.shippingDataObj.city,
        shipping_country: this.shippingDataObj.country,
        shipping_state: this.shippingDataObj.state,
        shipping_city: this.shippingDataObj.city,
        shipping_zip: this.shippingDataObj.pincode ? this.shippingDataObj.pincode.toString() : this.shippingDataObj.pincode.toString(),
        payment_via: this.selectedPaymentMethod,
        lift_gate: this.totalLiftCharge,
        payment_info: this.payerDetail,
        order_notes : this.extra_notes.order_notes,
        search_keyword : this.extra_notes.search_keyword
      }

      if (this.couponDiscount > 0) {
        this.orderObj.coupon_code = this.coupon_code;
      }

      this.Responsewait = true;
      this.__apiservice.storeOrder(this.orderObj).subscribe(
        (res: any) => {
          this.Responsewait = false;
          console.log("Succesfully", this.shippingAmount);
          this.total_detail.payable = res.data.order_amount;
          this.total_detail.shippingCharge = this.shippingAmount;
          this.total_detail.total_amount = this.total ? this.total : this.Extra_Charges;
          this.total_detail.coupon_discount = this.couponDiscount;
          this.total_detail.tax = this.rate > 0 ? this.rate : 0;
          this.total_detail.hazardous = this.hazardous;
          this.total_detail.lift_gate = this.totalLiftCharge;
          this.total_detail.order_id = res.data.order_no
          console.log(products_cart);
          products_cart.push(this.total_detail);
          localStorage.setItem("OrderInfo", JSON.stringify(products_cart));
          localStorage.setItem("Lift Gate Charge", JSON.stringify(0));
          localStorage.setItem("Lift_Gate_Charge_login", JSON.stringify(0));
          setTimeout(() => {
            this.route.navigateByUrl('thanks');
          }, 1000);
          this.__apiservice.GetCart.next([{ string: 'empty' }]);

        },
        (error: any) => {
          this.Responsewait = false;
          console.log("error", error);
          this.route.navigateByUrl('failed')
        }
      );
    }

    setTimeout(() => {
      this.carderror = ''
    }, 3000);
  }

  shippingAmount: any;
  Extra_Charges: any = 0;
  total_detail: any = {};

  async gettotaldetail() {
    console.log("TotalAmount", this.CheckoutProduct);
    // this.resSignupMsg = "Wait for a while";
    // this.resSignupMsgCheck = 'warning'
    // window.scroll(0,0)
    await this.signUp();
    if (this.resSignupMsg == '') {
      if (this.selectedShippingMethod == 'fedex') {
        this.Extra_Charges = this.shippingCharge + this.CheckoutProduct[0]?.payable - this.couponDiscount + this.rate;
        this.shippingAmount = this.shippingCharge;
      }

      else {
        let saiaAmount = Number(this.saiaValues);
        console.log(saiaAmount + this.CheckoutProduct[0].payable);
        this.Extra_Charges = saiaAmount + this.rate;
        this.shippingAmount = saiaAmount;
      }
      if (this.selectedPaymentMethod == 'paypal') {
        this.gettotalamountforpaypal();
      }
    }
  }
  total: any = 0;
  gettotalamountforpaypal() {
    this.paypalItems = {};
    console.log("this.shippingAmount", this.shippingAmount);
    console.log("this.Extra_Charges", this.Extra_Charges);
    console.log("this.totalLiftCharge", this.totalLiftCharge);
    console.log("this.hazardous", this.hazardous);
    console.log("this.rate", this.rate);
    let Paypal_Standard_Total: any = 0;
    if (this.shippingAmount > 0) {
      Paypal_Standard_Total = Paypal_Standard_Total + this.shippingAmount;
    }

    if (this.totalLiftCharge > 0) {
      Paypal_Standard_Total = Paypal_Standard_Total + this.totalLiftCharge;
    }

    if (this.hazardous > 0) {
      Paypal_Standard_Total = Paypal_Standard_Total + this.hazardous;
    }

    if (this.rate > 0) {
      Paypal_Standard_Total = Paypal_Standard_Total + this.rate;
    }

    this.paypalItems.name = "Standard Product";
    this.paypalItems.quantity = 1;
    this.paypalItems.category = "PHYSICAL_GOODS";
    this.paypalItems.unit_amount = { currency_code: "USD", value: (Paypal_Standard_Total.toFixed(2)) };
    this.paypal.push(this.paypalItems);
    console.log("paypalfinalobject", this.paypal);
    this.total = 0;
    this.paypal?.map((response: any) => {
      console.log(typeof response.unit_amount.value);
      this.total = this.total + parseFloat(response.unit_amount.value);
      console.log(typeof this.total);
      this.total = this.total.toFixed(2);
      this.total = parseFloat(this.total);
      console.log(typeof this.total);
    })
    console.log("total", this.total);
    this.initConfig();
  }
  payerDetail: any = {};
  // dynamic paypal binding and integration
  private initConfig(): void {
    // if (this.total > 0) {
    this.payPalConfig = {
      currency: 'USD',
      clientId: 'AX8Dyud-bw5dJEEKvuTkv5DJBH89Ahs4yf8RagOrGwjaeDPs0quiWiQAN8wuoOZu-mByocZMmxeAzrS2',
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'USD',
            value: this.total,
            breakdown: {
              item_total: {
                currency_code: 'USD',
                value: this.total
              }
            }
          },
          items: this.paypal
        }]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical',
        size: 'small',
        color: 'blue',
        shape: 'rect'
      },
      onApprove: (data, actions) => {
        console.log('onApprove - transaction was approved, but not authorized', data, actions);
        actions.order.get().then((details: any) => {
          this.payerDetail = {};
          console.log('onApprove - you can get full order details inside onApprove: ', details);
          this.payerDetail = details;
        });
      },
      onClientAuthorization: (data) => {
        if (data.status == 'COMPLETED') {
          // this.__apiservice.verifyemail();
          this.getOrderInfo();
        }
        else {
          this.route.navigateByUrl('failed');
        }
        console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);

      },
      onError: err => {
        console.log('OnError', err);
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      }
    };
    // }
  }
  // enable and disable payment tabs

  updatepaymentmethod() {
    this.selectedPaymentMethod = '';
  }
  // selectedPaymentCod: boolean = false;
  checkPaymentTab() {
    this.carderror = ''
    this.paymentMethod = true;
    console.log(this.shippingDataObj);
    if (this.selectedPaymentMethod == 'credit_card') {
      this.paymentCheck = false;
      this.showPaypal = false;
      // this.selectedPaymentCod = true;
      this.gettotaldetail();
      console.log(this.paymentCheck);
    }
    else if (this.selectedPaymentMethod == "paypal") {
      // if (this.shippingDataObj.valid == true && this.billingDetails.valid == true) {
      this.paymentCheck = true;
      this.showPaypal = true;
      this.getpaypalitem();
      this.gettotaldetail();
      // }
      console.log(this.paymentCheck);
    }
  }
  cookiesCheckout: any = {}
  nonLoggedCart: any = [];
  //get cookies data on cart
  getsubjectBehaviour() {
    let cookiesObj: any = [];
    // let obj: any = [];
    let completedFormat: any = {};
    cookiesObj = localStorage.getItem("Cookies_Cart_Data");
    let Object = JSON.parse(cookiesObj);
    console.log(Object.data);
    Object.data?.map((response: any) => {
      this.totalweight += (response.quantity * response.product.weight);
      if (response.product.hazardous == 1) {
        this.__apiservice.hazardous.subscribe((res: any) => {
          this.hazardous = res;
        })
      }
    })
    if (this.totalweight > 70) {
      this.selectedShippingMethod = 'saia';
    }
    else if (this.totalweight <= 70) {
      this.selectedShippingMethod = 'fedex';
    }
    if (Object.data.length > 0) {
      completedFormat.carts = Object.data;
      console.log(completedFormat);
      this.refractorData(completedFormat);
      this.checkoutShimmer = false;
    }
  }

  totalLiftCharge: any = 0;
  hazardous: any = 0;
  async refractorData(data_obj: any) {
    console.log(data_obj);
    console.log(this.dataFromLocation);
    let userSelectedLocation: any = {};
    let user: any = {};
    let subtotal: any = 0;
    this.dataFromLocation?.map((res: any, index: any) => {
      res.types?.map((response: any) => {
        // console.log(response);
        if (response == 'postal_code') { userSelectedLocation.pincode = res.long_name }
        if (response == 'country') { userSelectedLocation.country = res.long_name; }
        if (response == 'administrative_area_level_1') { userSelectedLocation.state = res.long_name }
        if (response == 'locality') { userSelectedLocation.city = res.long_name }
        if (response == 'sublocality') { userSelectedLocation.address = res.long_name }
      })
    })

    user = {
      name: "",
      email: "",
      mobile: "",
      country: userSelectedLocation.country ? userSelectedLocation.country : "",
      address: userSelectedLocation.address ? userSelectedLocation.address : "",
      city: userSelectedLocation.city ? userSelectedLocation.city : "",
      state: userSelectedLocation.state ? userSelectedLocation.state : "",
      pincode: userSelectedLocation.pincode ? userSelectedLocation.pincode : "",

    }

    this.dataFromLocation?.map((res: any, index: any) => {
      res.types?.map((response: any) => {
        if (response == 'postal_code') { user.pincode = res.long_name }
        if (response == 'country') { user.country = res.long_name; }
        if (response == 'administrative_area_level_1') { user.state = res.long_name }
        if (response == 'locality') { user.city = res.long_name }
        if (response == 'sublocality') { user.address = res.long_name }
      })
      user.name = "";
      user.email = "";
      user.mobile = ""
    })


    data_obj.carts.map((res: any) => {
      subtotal = subtotal + res.product.sale_price * res.quantity;
      let lift_get_charge = localStorage.getItem('Lift Gate Charge');
      if (lift_get_charge) {
        if (JSON.parse(lift_get_charge) > 0) {
          this.totalLiftCharge = JSON.parse(lift_get_charge);
        }
      }



      // if (res.lift_gate == 1) {
      //   this.totalLiftCharge = this.totalLiftCharge + 150;
      // }
      // if (res.hazardous == 1) {
      //   this.hazardous = this.hazardous + 65
      // }
    })
    console.log(subtotal, this.totalLiftCharge);
    data_obj.payable = subtotal;

    this.credit_card_amount = data_obj.payable + this.hazardous;
    // this.billingUserDetail.push(user);
    // let CheckoutDetail: any = {};
    // let subtotalProduct: any;
    // let subtotal = localStorage.getItem("payable");
    // if (subtotal) {
    //   subtotalProduct = JSON.parse(subtotal);
    // }
    data_obj.user = user;
    console.log("this.billingUserDetail", data_obj);
    this.CheckoutProduct.push(data_obj);
    console.log(this.CheckoutProduct);
    this.getTaxExempt();
  }

  //collect product information to send paypal
  payment: any;
  // get coupon discount on product
  coupon_code: string = '';
  discount100: any = 0
  copytax: any = 0
  couponButton() {
    this.selectedPaymentMethod = '';
    if (this.couponValue) {
      this.couponDiscount = 0
      this.addremovedcoupon = 0
      this.coupon_code = this.couponValue;
      let couponcheck: boolean = false;
      this.CheckoutProduct?.map((res: any) => {
        console.log(res);
        if (res.coupons?.length > 0) {
          res.coupons.map((response: any) => {
            console.log(this.coupon_code == response.code, this.coupon_code, response.code)
            console.log(this.couponDiscount)
            if (this.couponDiscount == 0 && this.coupon_code == response.code) {
              if (this.coupon_code == response.code) {
                console.log("checking for if")
                if (response.disc_type == 'percent' && response.discount <= 100 ) {
                  couponcheck = true;
                  // if (response.type == 'cart_value_discount' || response.type == 'customer_based') {
                  this.couponDiscount = res.order_total * response.discount / 100;
                  this.showPaypal = false;
                  if (response.discount == 100) {
                    this.discount100 = 100;
                    this.taxCheck = false;
                    this.copytax = this.rate;
                    this.rate = 0
                  }
                  else {
                    this.copytax = 0
                    this.discount100 = 0
                  }
                  this.addremovedcoupon = 0
                  this.errormsg = ''
                  this.couponCheck = true;
                  console.log(this.couponDiscount)
                  // }
                  // else if (response.type == 'global') {
                  //   this.couponDiscount = ((this.rate ? ((this.rate == -1) ? 0 : this.rate) : 0) + res.payable + this.totalLiftCharge + this.hazardous + ((this.totalweight > 70) ? this.saiaAmount : this.shippingCharge)) * response.discount / 100;
                  //   if (response.discount == 100) {
                  //     this.discount100 = 100;
                  //     this.taxCheck = false;
                  //     this.copytax = this.rate;
                  //     this.rate = 0
                  //   }
                  //   else {
                  //     this.copytax = 0
                  //     this.discount100 = 0
                  //   }
                  //   this.addremovedcoupon = 0
                  //   this.errormsg = ''
                  //   this.couponCheck = true;
                  // }
                }
                else if (response.disc_type == 'amount' && response.discount <= res.payable) {
                  couponcheck = true;
                  if (response.discount == res.order_total) {
                    this.discount100 = 100;
                    this.taxCheck = false;
                    this.copytax = this.rate;
                    this.rate = 0
                  }
                  else {
                    this.copytax = 0
                    this.discount100 = 0
                  }
                  this.showPaypal = false;
                  this.couponDiscount = response.discount;
                  this.addremovedcoupon = 0
                  this.errormsg = ''
                  this.couponCheck = true;
                  console.log(this.couponDiscount)
                }
                else {
                  couponcheck = false;
                  this.couponDiscount = 0
                  this.coupon_code = ''
                  this.couponValue = '';
                  this.addremovedcoupon = 0
                  this.coupon_code = ''
                  console.log("checking for coupon")
                  this.errormsg = '*Invalid Coupon Code'
                  this.discountCheck = true;
                  this.couponCheck = false;
                  setTimeout(() => {
                    this.errormsg = '';
                  }, 2000);
                }
              }
              else {
                this.couponDiscount = 0
                this.addremovedcoupon = 0
                this.couponValue = '';
                this.coupon_code = '';
                console.log("checking for coupon")
                this.errormsg = '*Invalid Coupon Code'
                this.discountCheck = true;
                this.couponCheck = false;
                setTimeout(() => {
                  this.errormsg = '';
                }, 2000);
              }
            }
            else {
              if (!couponcheck) {
                console.log("checked")
                this.couponValue = '';
                this.couponDiscount = 0;
                this.errormsg = '*Invalid Coupon Code';
                setTimeout(() => {
                  this.errormsg = '';
                }, 2000);
              }
            }
          })

        }
        else {
          this.couponValue = '';
          this.couponDiscount = 0
          this.addremovedcoupon = 0
          this.coupon_code = ''
          console.log("checking for coupon")
          this.errormsg = '*Invalid Coupon Code'
          this.discountCheck = true;
          this.couponCheck = false;
          setTimeout(() => {
            this.errormsg = '';
          }, 2000);
        }
      })
      // this.errormsg = '';
    }
    else {
      this.removediscount()
      this.couponCheck = false;
      this.coupon_code = ''
      this.errormsg = '*Please Enter Coupon Code'
      setTimeout(() => {
        this.errormsg = '';
      }, 2000);
    }
    console.log("couponValue", this.couponValue, "couponDiscount", this.couponDiscount, "coupon_code", this.coupon_code)
  }

  addremovedcoupon: any = 0;

  removediscount() {
    this.selectedPaymentMethod = '';
    this.showPaypal = false;
    this.couponCheck = false;
    this.couponValue = '';
    this.addremovedcoupon = this.couponDiscount;
    this.couponDiscount = 0
    this.coupon_code = ''
    if (this.discount100 == 100) {
      this.taxCheck = true
      this.rate = this.copytax;
      this.discount100 = 0;
      this.getTaxExempt();
    }
  }

  billingDetails: any;

  getDiscountvalue() {
    this.couponValue = this.couponCode;
    console.log(this.couponCode);
    console.log(this.couponValue);
  }

  PaymentCheck(event: any) {
    this.selectedPaymentMethod = event;
    this.showPaypal = false;
  }


  userObj: any;
  resSignupMsg: any = '';
  resSignupMsgCheck: any = ''



  async signUp() {    
    console.log(this.billingUserDetail);    
    if (!localStorage.getItem('ecolink_user_credential')) {
      if(this.billingUserDetail.length > 0){
        await this.__apiservice.postCheckout(this.billingUserDetail[0]).then(
          async (res) => {
            console.log(res);
            if (res.code == 200) {
              window.scroll(0, 0)
              this.resSignupMsg = "Verification mail has been sent to your Email Id !";
              this.resSignupMsgCheck = 'success'
              this.selectedPaymentMethod = ''
              localStorage.setItem(
                'ecolink_user_credential',
                JSON.stringify(res.data));
              localStorage.setItem('usernameforheader', "username")
              this.route.navigateByUrl('/shop/checkout');
              this.SaveCookiesDataInCart();
            }
            else {
              localStorage.removeItem('ecolink_user_credential');
              this.Responsewait == false;
            }
  
          },
          (error: HttpErrorResponse) => {
            window.scroll(0, 0)
            if (error.error.code == 400) {
              if (error.error.message.email) {
                this.resSignupMsg = error.error.message.email;
              }
              if (error.error.message.password) {
                this.resSignupMsg = error.error.message.password;
              }
              if (error.error.message.mobile) {
                this.resSignupMsg = error.error.message.mobile;
              }
              if (error.error.message.tax_exempt) {
                this.resSignupMsg = error.error.message.tax_exempt;
              }
              if (error.error.message.name) {
                this.resSignupMsg = error.error.message.name;
              }
              this.resSignupMsgCheck = 'danger';
              this.Responsewait == false;
            }
            this.selectedPaymentMethod = ''
          });
  
        setTimeout(() => {
          this.resSignupMsg = ''
        }, 5000);
      }
      else{
        this.resSignupMsg = "Please Fill the Form";
        this.resSignupMsgCheck = "danger"
        window.scroll(0, 0);         
        setTimeout(() => {
          this.resSignupMsg = '';
        }, 1000);
      }

    }
    else {
      this.resSignupMsg = "";
      this.resSignupMsgCheck = ""
    }
  }

  async SaveCookiesDataInCart() {
    this.CheckoutProduct.map((res: any) => {
      console.log(res.carts);
      res.carts.map(async (resp: any) => {
        console.log(resp);
        await this.__apiservice.addItemToCart(resp.product_id, resp.quantity, "add")
          .then((res) => {
            console.log(res);
          })

          .catch((error: any) => {
            console.log(error);
          })
      })
    })
    // this.FormFillUp.emit(false);
  }

  SelectedLabel(event: any) {
    // console.log("event.target.value", event);
    if (event) {
      this.formLabelForNonLoggedInUser = 'Billing Details';
    }
    else {
      this.formLabelForNonLoggedInUser = 'Billing & Shipping Details'
    }
  }

  getBillingDetail(event: any) {
    this.billingUserDetail = event;
    console.log("this.billingUserDetail" , this.billingUserDetail);
    
  }

  extra_notes : any = {
    order_notes : '',
    search_keyword : ''
  };
  getExtraNotes(event:any){
    console.log(event);    
    this.extra_notes = event;
  }
}