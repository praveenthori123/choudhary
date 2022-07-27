import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild, Renderer2, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiServiceService } from '../../Services/api-service.service';
import { CookiesService } from '../../Services/cookies.service';
import { ViewportScroller } from "@angular/common";

interface popularity {
  name: string,
  slug: string
}

@Component({
  selector: 'app-subcatgorycomponent',
  templateUrl: './subcatgorycomponent.component.html',
  styleUrls: ['./subcatgorycomponent.component.scss']
})
export class SubcatgorycomponentComponent implements OnInit {
  @ViewChild('test') test: ElementRef | any;
  suggestions: boolean = true;
  showFiterModel: boolean = false;
  previousdata: any;
  view_card: boolean = true;
  view_list: boolean = false;
  value1: string = '';
  popularity!: popularity[];
  maximum: number = 100;
  max: number = 100;
  slug: any;
  selectedCategory: any = [];
  selectedRatings: any = [];
  ProductListData: any = [];
  ProductbackupData: any = []
  cart_obj: any = [];
  catgory: any;
  price_from: any;
  price_to: any;
  selectedLevel: any = 'default';
  rangeValues: number[] = [0, 100];
  resetvalues: number[] = [0, 100];
  shimmerLoad: boolean = true;
  subslug: any;
  wishlistitem: any = []
  subCatgoryProduct: any = [];
  wishlistMsg: string = '';
  wishlistMsgCheck: string = '';
  slugroute: string = '';
  parent_id: any;
  assetsUrl = environment.assetsurl
  @ViewChild('warning') warning: any;
  constructor(private route: ActivatedRoute, private scroller: ViewportScroller, private renderer: Renderer2, private _ApiService: ApiServiceService, private Cookies: CookiesService, private router: Router) {
    this.popularity = [
      { name: "Price low to high", slug: "lowtohigh" },
      { name: "Price high to low", slug: "hightolow" },
      { name: "Name", slug: "name" },
      { name: "Popularity", slug: "popularity" },
    ];
  }


  async ngOnInit() {
    this.catgory = localStorage.getItem('category');
    this.subslug = JSON.parse(this.catgory);
    this.slug = this.route.snapshot.params;
    await this.wishlistfunction();
    // this.getListingData(this.slug.slug);
    console.log(this.slug);

  }
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

  //selected product in dropdown
  selected(event: any) {
    this.selectedLevel = event.target.value;
    this.getDataForFilter();
  }

  //selected from search bar
  getselecteddata(selectedValue: any) {
    let obj_Array: any = [];
    this.value1 = selectedValue;
    console.log(this.value1);
    this.suggestions = false;
    if (this.value1.length > 0) {
      this.subCatgoryProduct.map((response: any) => {
        response.products.filter((search: any) => {
          if (search.name.toLowerCase().includes(selectedValue.toLowerCase())) {
            obj_Array.push(search)
          }
        })
      })
      console.log(obj_Array);
      this.subCatgoryProduct.map((resp: any) => {
        resp.products = obj_Array;
      })
    }
    else if (this.value1.length == 0) {
      this.subCatgoryProduct[0].products = this.displayProducts;
    }

  }


  //get data by slug from api 
  productResponse: any = [];
  displayProducts: any = [];
  productList: any = [];

  async getListingData(slug: any) {
    this.productResponse = [];
    this.displayProducts = [];
    this.productList = [];
    this.subCatgoryProduct = []
    await this._ApiService.getDetailByCategory(slug)
      .then((res: any) => {
        if (res.code == 200) {
          console.log(res);
          this.productResponse = res.data.subcategory;
        }
      })
      .catch((error: any) => {
        this.router.navigateByUrl('page-not-found');
      })
    console.log(this.productResponse);
    this.subCatgoryProduct = []
    this.productResponse.map((resp: any) => {
      // console.log(resp);   
      if (resp.slug == this.slug.sublink) {
        resp.products?.map((wishlist: any) => {
          wishlist.wishlist_item = false;
          this.wishlistitem?.map((wishlistitem: any) => {
            if (wishlistitem.product_id == wishlist.id) {
              wishlist.wishlist_item = true;
            }
          })
        })
        this.selectedCategory.push(resp.id);
        this.parent_id = resp.parent_id;
        this.subCatgoryProduct.push(resp);
        this.productList = resp;
        this.displayProducts = this.productList.products;
      }
      this.getPrice();
      console.log("this.productList", this.subCatgoryProduct);
      this.shimmerLoad = false;
    })

    if (this.subCatgoryProduct?.length == 0) {
      this.router.navigateByUrl('page-not-found')
    }

  }

  //Add products to cart
  CookieCartsData: any;
  async AddProductToCart(Item: any) {
    await this.AddProductToSubject(Item, Item.quantity ? Item.quantity : 1);
    this.router.navigateByUrl('/cart');
  }


  async AddProductToSubject(Item: any, ItemCount: any) {
    let previousdata: any;
    console.log(ItemCount);
    if (localStorage.getItem('ecolink_user_credential') == null) {
      let product: any = {};
      let category: any = {};
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
        product.slug = Item.slug,
        product.hazardous = Item.hazardous,
        category.id = this.productResponse.id,
        category.slug = this.productResponse.slug,
        product.category = category,
        product.minimum_qty = Item.minimum_qty,
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

      console.log(this.CookieCartsData, "Pushed Array");
      localStorage.setItem("Cookies_Cart_Data", JSON.stringify(cartObjData));
      this._ApiService.GetCart.next(cartObjData);
    }


    else {
      console.log(Item);
      await this._ApiService.addItemToCart(Item.id, ItemCount, "add" , 0)
        .then(res => {
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

  // toggle filter model for mobile screen
  getFilterModel() {
    this.showFiterModel = true;
    this.showFiterModel = !this.showFiterModel;
  }

  async wishlistfunction() {
    this.wishlistitem = []
    if (localStorage.getItem('ecolink_user_credential')) {
      await this._ApiService.getWishListItem()
        .then((response: any) => {
          console.log(response);
          response.data?.map((wishlist: any) => {
            this.wishlistitem.push(wishlist);
          })
          console.log("wishlistitem", response);
        })
        .catch((error: any) => {
          console.log("string")
        })
    }
    this.getListingData(this.slug.slug);
  }
  //add data to wishlist
  addWishList(product: any) {
    if (localStorage.getItem('ecolink_user_credential') != null) {
      console.log(product.id);
      this._ApiService.addItemToWishlist(product.id).subscribe(res => {
        console.log(res);
      })
      this.router.navigate(['/shop/wishlist'])
    }

    else {
      this.router.navigate(['/profile/auth'])
    }
    // product.is_wishlist_item = !product.is_wishlist_item;
  }

  //delete item to wishlist
  async deleteWishlistItems(product_id: any) {
    this.shimmerLoad = true
    console.log(product_id);
    await this._ApiService.deleteWishlistItems(product_id)
    this.wishlistfunction();
    this.wishlistMsg = 'Product Removed from Wishlist!'
    this.wishlistMsgCheck = 'success'
    setTimeout(() => {
      this.wishlistMsg = '';
    }, 1000);
  }
  goToTop() {
    window.scrollTo(0, 0);
    this.scroller.scrollToAnchor("backToTop");
  }
  close() {
    this.renderer.setStyle(this.test.nativeElement, 'display', 'none');
    this.wishlistMsg = '';
  }
  //get data from filter api
  filterValue: any;
  getDataForFilter() {
    let obj_Array: any[] = [];
    console.log(this.selectedCategory, this.parent_id, "ffff");

    this.filterValue = {
      category: Array.from(this.selectedCategory, Number),
      price_from: this.rangeValues[0],
      price_to: this.rangeValues[1],
      rating: Array.from(this.selectedRatings, Number),
      sortby: this.selectedLevel,
      parent_id: this.parent_id
    }
    console.log("this.filterValue", this.filterValue);
    this._ApiService.filterProduct(this.filterValue).then(res => {
      // console.log(res, "gs")
      Object.keys(res.data).forEach(key => {
        obj_Array.push(res.data[key]);
      })
      this.subCatgoryProduct[0].products = obj_Array;
      console.log(this.subCatgoryProduct);
      this.getPrice();
    })
      .catch(error => {
        if (error.status == 400) {
        }
      }
      );
  }
  //get range for filter
  getPrice() {
    this.subCatgoryProduct.filter((res: any) => {
      this.price_from = Math.min(...res.products.map((item: any) => item.regular_price));
      this.price_to = Math.max(...res.products.map((item: any) => item.regular_price));
      this.maximum = (this.price_to * 35) / 100 + this.price_to;
      if (this.price_from == this.price_to) {
        this.price_from = 0;
      }
      this.rangeValues = [this.price_from, this.price_to]

      console.log(this.maximum, this.rangeValues[1], this.rangeValues[0]);
    })
  }

  // clear filter
  ClearAll() {
    console.log(this.productList, this.subCatgoryProduct);
    this.subCatgoryProduct[0].products = this.displayProducts;
    this.getPrice();
    console.log(this.displayProducts, this.subCatgoryProduct);
  }

  // get suggestion on key press
  getkeypressdata() {
    console.log(this.value1);
    if (this.value1.length > 0) {
      this.suggestions = true;
    }
    else if (this.value1.length == 0) {
      this.suggestions = false;
      this.subCatgoryProduct[0].products = this.displayProducts;
    }
    console.log(this.displayProducts);

  }

  getImageurl(image: any) {
    return this.assetsUrl + image;
  }
}