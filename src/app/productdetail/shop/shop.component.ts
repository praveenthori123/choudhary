import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiServiceService } from 'src/app/Services/api-service.service';
import { CommonservicesService } from 'src/app/Services/commonservices.service';
import { CookiesService } from 'src/app/Services/cookies.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  ItemCount: any = 1;
  stock: any
  slug: any;
  minimum_qyt: any = 1;
  previousdata: any;
  test_slug: any;
  recommended_products: any = [];
  detailSlug: any;
  shimmerLoad: boolean = true;
  CartButton: string = "Add to Cart";
  DisabledCartButton: boolean = false;
  AddCartCount: any;

  responsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 3,
      numScroll: 3
    },
    {
      breakpoint: '768px',
      numVisible: 2,
      numScroll: 2
    },
    {
      breakpoint: '560px',
      numVisible: 1,
      numScroll: 1
    }
  ];
  productDetail: any = [];
  header: any;
  constructor(public _ApiService: ApiServiceService, private route: ActivatedRoute, private Cookies: CookiesService, private router: Router, private commonService: CommonservicesService) { }

  ngOnInit(): void {
    this.slug = this.route.snapshot.params;
    console.log(this.slug);

    if (this.slug.subsublug) {
      this.detailSlug = this.slug.slug + '/' + this.slug.subslug + '/' + this.slug.subsublug;
    }

    else if (this.slug.subslug) {
      this.detailSlug = this.slug.slug + '/' + this.slug.subslug;
    }

    else {
      this.detailSlug = this.slug.slug
    }

    console.log(this.detailSlug);
    this.getProductDetail(this.detailSlug);

  }

  //increase and decrease product quantity on detail page
  Count(string: any) {
    // this.CartButton = "Add to Cart";
    // this.DisabledCartButton = false;
    if (string == "increase") {
      this.ItemCount = this.ItemCount + 1;
    }
    if (string == "decrease") {
      this.ItemCount = this.ItemCount - 1;
    }
  }

  //get product detail
  UserLogin: any;
  ItemCountStorage: any;
  wishlistcheck:boolean=false;
  async getProductDetail(sendslug: any) {
    await this._ApiService.getProductDetail(sendslug)
      .then((res: any) => {
        console.log(res.data.product);
        if (res.code == 200) {
          this.productDetail.push(res);
          this.minimum_qyt = res.data.product.minimum_qty;
          this.stock = res.data.product.stock;
          this.recommended_products = res.data.related_products;
          this.ItemCount = this.minimum_qyt == null ? 1 : this.minimum_qyt;
          this.UserLogin = localStorage.getItem("ecolink_user_credential");
          let User_cred = JSON.parse(this.UserLogin);
          if (User_cred) {
            this._ApiService.getItemFromCart()
            .then(response => {
              if (response.data) {
                console.log(response);
                response.data.map((resp: any) => {
                  if (resp.product_id == res.data.product.id) {
                    this.DisabledCartButton = true;
                    console.log("Matched", resp.quantity);
                    this.CartButton = "Go to Cart"
                    this.ItemCount = resp.quantity;
                  }
                })
              }
              this.shimmerLoad = false;
            })

            .catch((error:any)=>{
              this.shimmerLoad = false;
            })
          }

          else {
            this.CookieCartsData = localStorage.getItem("Cookies_Cart_Data");
            let getCartObjData = JSON.parse(this.CookieCartsData);
            if (getCartObjData) {
              getCartObjData.data?.map((resp: any) => {
                console.log(res.data.product.id, resp.product_id);
                if (resp.product_id == res.data.product.id) {
                  console.log("Matched", resp.quantity);
                  this.CartButton = "Go to Cart"
                  this.DisabledCartButton = true;
                  this.ItemCount = resp.quantity;
                  this.shimmerLoad = false;
                }
              })
            }
            this.shimmerLoad = false;
          }

          if(localStorage.getItem('ecolink_user_credential')) {
            this._ApiService.getWishListItem()
            .then((response:any)=> {
              response.data?.map((resp:any)=> {
                if(resp.product.name==res.data.product.name) {
                  this.wishlistcheck=true;
                }
                else {
                  this.wishlistcheck=false;
                }
              })
            })
            .catch((error:any)=> {
              console.log(error);
            })
          }
        }
      })
      .catch((error: any) => {
        console.log(error);
        this.router.navigateByUrl('page-not-found');
      })

  }
  wishlistMsg:string='';
  wishlistMsgCheck:string=''
  async deleteWishlistItems(product_id: any) {
    await this._ApiService.deleteWishlistItems(product_id)
    this.wishlistcheck=false
    this.wishlistMsg = 'Product Removed from Wishlist!'
    this.wishlistMsgCheck = 'success'
    setTimeout(() => {
    this.wishlistMsg = '';
    }, 1000);
  }

  //add product to cart
  CartItem: any = [];
  async AddProductToCart(Item: any) {
    console.log(this.ItemCount);
    await this.AddProductToSubject(Item, this.slug, this.ItemCount);
    // this._ApiService.itemCountSession.next(this.ItemCount);
    // localStorage.setItem("ItemCountSession", JSON.parse(this.ItemCount));
    // this._ApiService.CartItems.subscribe(res => {
    //   res.map((resp: any) => {
    //     if (resp.ItemId != Item.id) {
    //       this.CartItem.push(resp);
    //     }
    //   })
    // })
    // this.CartItem.push({
    //   ItemCount: this.ItemCount,
    //   ItemId: Item.id
    // })
    this.router.navigateByUrl('/cart');
    // this._ApiService.CartItems.next(this.CartItem);
    // localStorage.setItem("ItemExist", JSON.stringify(this.CartItem));
  }

  // add item to wishlist
  addWishList(product: any) {
    this.commonService.addWishList(product);
  }

  // route on same page where we are
  routeOnSamePage(slug: any) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['/shop/' + this.slug.category + '/' + slug]);
  }

  CookieCartsData: any = {};
  async AddProductToSubject(Item: any, slug: any, ItemCount: any) {
    let previousdata: any;

    if (localStorage.getItem('ecolink_user_credential') == null) {
      console.log(Item, ItemCount);
      let product: any = {};
      let data_object: any = {};
      let cartObjData: any = {};
      let data: any = [];
      let flag = false;
      previousdata = this.Cookies.GetCartData();
      if (localStorage.getItem("Cookies_Cart_Data")) {
        this.CookieCartsData = localStorage.getItem("Cookies_Cart_Data");
        cartObjData = JSON.parse(this.CookieCartsData);
      }
        product.id = Item.id,
        product.name = Item.name,
        product.sale_price = Item.sale_price,
        product.image = Item.image,
        product.alt = Item.alt,
        product.minimum_qty = Item.minimum_qty,
        product.hazardous = Item.hazardous,
        product.weight = Item.weight;
        data_object.product = product,
        data_object.product_id = Item.id,
        data_object.quantity = ItemCount,
        data_object.lift_gate = 0
        console.log("data_object", data_object);

      if (cartObjData.data) {
        console.log("If condition");
        cartObjData.data.map((resp: any) => {
          console.log(resp);
          if (resp.product_id == data_object.product_id) {
            resp.quantity = resp.quantity + data_object.quantity;
            flag = true;
            console.log(resp);
          }
        })

        if (!flag) {
          cartObjData.data.push(data_object);
          console.log("Cart If condition", cartObjData);
        }
      }

      else {
        data.push(data_object);
        console.log("Cart is Empty", data);
        cartObjData.data = data;
      }

      // this.Cookies.SaveCartData(previousdata);
      console.log(this.CookieCartsData, "Pushed Array");
      localStorage.setItem("Cookies_Cart_Data", JSON.stringify(cartObjData));
      this._ApiService.GetCart.next(cartObjData);
    }
    else {
      console.log(Item);
      await this._ApiService.addItemToCart(Item.id, ItemCount, "add" , 0)
        .then(res => {
          console.log(res);
          this._ApiService.GetCart.next(res.data);
        })
        .catch((error: any) => {
          if (error.status == 401) {
            localStorage.removeItem('ecolink_user_credential');
            this.router.navigateByUrl('profile/auth');
          }
        })
    }
  }

}