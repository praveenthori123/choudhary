import { Component, ElementRef, OnInit, ViewChild, Renderer2, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiServiceService } from '../Services/api-service.service';
import { CommonservicesService } from '../Services/commonservices.service';
import { CookiesService } from '../Services/cookies.service';
import { ViewportScroller } from "@angular/common";
interface popularity {
  name: string,
  slug: string
}

@Component({
  selector: 'app-productlist',
  templateUrl: './productlist.component.html',
  styleUrls: ['./productlist.component.scss'],
  // encapsulation:ViewEncapsulation.None
})
export class ProductlistComponent implements OnInit {
  @ViewChild('test') test: ElementRef | any;
  suggestions: boolean = false;
  dataFound: boolean = false;
  showFiterModel: boolean = false;
  productCheck: boolean = false;
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
  price_from: any;
  price_to: any;
  selectedLevel: any = 'default';
  rangeValues: number[] = [0, 100];
  resetvalues: number[] = [0, 100];
  shimmerLoad: boolean = true;
  wishlistMsg: string = '';
  wishlistitem: any = [];
  wishlistMsgCheck: string = '';
  @ViewChild('warning') warning: any;
  constructor(private route: ActivatedRoute, private scroller: ViewportScroller, private renderer: Renderer2, private _ApiService: ApiServiceService, private Cookies: CookiesService, private router: Router, private commonService: CommonservicesService) {
    this.popularity = [
      { name: "Price low to high", slug: "lowtohigh" },
      { name: "Price high to low", slug: "hightolow" },
      { name: "Name", slug: "name" },
      { name: "Popularity", slug: "popularity" },
    ];
  }

  async ngOnInit() {
    if (localStorage.getItem("ItemCountSession")) {
      localStorage.removeItem("ItemCountSession");
    }
    this.slug = this.route.snapshot.params;
    await this.wishlistfunction();
    console.log("checking for process");
    // if (this.slug.sublink) {
    //   this.getListingData(this.slug.sublink);
    // }
    // else {
    //   this.getListingData(this.slug.slug);
    // }
    localStorage.setItem("category", JSON.stringify(this.slug.slug));
    this._ApiService.itemCountSession.next("empty");
    localStorage.removeItem("ItemExist");
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
    if (this.slug.sublink) {
      this.getListingData(this.slug.sublink);
      console.log("ListingData");

    }
    else {
      this.getListingData(this.slug.slug);
      console.log("ListingData");
    }
  }

  //show list on grid and list view
  showlist(string: string) {
    if (string == 'list') {
      this.view_list = true;
      this.view_card = false;
    }
    if (string == "card") {
      this.view_list = false;
      this.view_card = true;
    }
  }

  //selected dropdown value for fiter
  selected(event: any) {
    this.selectedLevel = event.target.value;
    this.getDataForFilter();
  }

  //fetch data on search
  getselecteddata(selectedValue: any) {
    let obj_Array: any = [];
    this.value1 = selectedValue;
    if (this.value1.length > 0) {
      this.suggestions = false;
      obj_Array.push(
        this.ProductListData[0].data.products.filter((search: any) => {
          return search.name.toLowerCase().indexOf(selectedValue.toLowerCase()) > -1
        })
      )
    }
    else {
      this.suggestions = false;
    }

    this.ProductListData[0].data.products = obj_Array[0];
  }

  // fetch data by selected slug
  productResponse: any = {};
  displayProducts: any = [];
  productList: any = [];
  parent_id : any;
  getListingData(slug: any) {
    this.productResponse = {};
    this.displayProducts = [];
    this.productList = [];
    this.ProductListData=[]
    this._ApiService.getDetailByCategory(slug)
      .then((res: any) => {
        if (res.code == 200) {
          console.log(res);
          if(res.data.parent_id != null){
            this.parent_id = res.data.parent_id;
          }
          res.data.products?.map((resp: any) => {
            resp.wishlist_item = false;
            this.wishlistitem?.map((wishlistitem: any) => {
              if (wishlistitem.product_id == resp.id) {
                resp.wishlist_item = true;
              }
            })
            // console.log(resp);
          })
          console.log(res);
          this.productResponse = res.data;
          this.productList = this.productResponse.products;
          this.displayProducts = this.productList;
          this.ProductListData.push(res);
          console.log(this.ProductListData);
          this.selectedCategory.push(this.productResponse.id)
          // this.filterValue.category = res.id;
          this.getPrice();
          this.shimmerLoad = false;
          console.log(this.productResponse);
        }
      })
      .catch((error) => {
        if (error.error.code == 400) {
          this.router.navigateByUrl('page-not-found');
        }
      })
  }

  // add product to cart
  async AddProductToCart(Item: any) {
    console.log(Item);
    let ItemCount = Item.minimum_qty == null ? 1 : Item.minimum_qty;
    await this.AddProductToSubject(Item, this.slug, ItemCount);
    this.router.navigateByUrl('/cart')
  }


  CookieCartsData: any;
  async AddProductToSubject(Item: any, slug: any, ItemCount: any) {
    let previousdata: any;
    console.log(ItemCount);
    if (localStorage.getItem('ecolink_user_credential') == null) {
      console.log(Item);
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
        product.weight = Item.weight,
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

      // cartObjData.data.map((res:any)=>{
      //   if(res.product.hazardous == 1){
      //     this._ApiService.hazardous.subscribe(res=>{
      //       cartObjData.data.push(res);
      //     })
      //   }
      // })
      

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

  // toggle filter model
  getFilterModel() {
    this.showFiterModel = true;
    this.showFiterModel = !this.showFiterModel;
  }

  // add data to wishlist
  addWishList(product: any) {
    this.commonService.addWishList(product);
    product.is_wishlist_item = !product.is_wishlist_item;
  }
  //delete item to wishlist
  async deleteWishlistItems(product_id: any) {
    this.shimmerLoad = true
    console.log(product_id);
    await this._ApiService.deleteWishlistItems(product_id)
    this.wishlistfunction();
    console.log(this.wishlistitem);
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
  // get data using filter api
  filterValue: any;

  getDataForFilter() {
    this.productCheck = false;
    let obj_Array: any[] = [];
    console.log(this.selectedCategory,this.parent_id, "ffff");

    this.filterValue = {
      category: Array.from(this.selectedCategory, Number),
      price_from: this.rangeValues[0],
      price_to: this.rangeValues[1],
      rating: Array.from(this.selectedRatings, Number),
      sortby: this.selectedLevel
    }
    this._ApiService.filterProduct(this.filterValue).then(res => {
      console.log("this.filterValue" , res);
      
      Object.keys(res.data).forEach(key => {
        obj_Array.push(res.data[key]);
      })

      console.log("obj_Array" , obj_Array);
      
      this.ProductListData[0].data.products = obj_Array;
      this.getPrice(); 
    })
      .catch(error => {
        if (error.status == 400) {
          this.productCheck = true;
        }
      }
      );
  }


  //get price for range filter
  getPrice() {
    this.ProductListData.filter((res: any) => {
      this.price_from = Math.min(...res.data.products.map((item: any) => item.regular_price));
      this.price_to = Math.max(...res.data.products.map((item: any) => item.regular_price));
      this.maximum = Math.max(...res.data.products.map((item: any) => item.regular_price));
      this.rangeValues = [this.price_from, this.price_to]
      console.log(this.maximum, this.rangeValues[1]);
    })
  }

  //clear filter
  ClearAll() {
    this.ProductListData[0].data.products = this.displayProducts;
    console.log(this.displayProducts);
    this.getPrice();
    this.productCheck = false;
    this.selectedCategory = [];
  }

  //get data on key press
  SuggestionArray: any[] = [];
  getkeypressdata() {
    let obj_Array: any = [];
    this.suggestions = true;
    if (this.value1.length > 0) {

      obj_Array.push(
        this.ProductListData[0].data.products.filter((search: any) => {
          return search.name.toLowerCase().indexOf(this.value1.toLowerCase()) > -1
        })
      )

      console.log(obj_Array);

      if (obj_Array[0].length > 0) {
        this.dataFound = true
        this.SuggestionArray = obj_Array;
      }
      else {
        this.dataFound = false
      }

      console.log(this.SuggestionArray);


    }
    else if (this.value1.length == 0) {
      this.suggestions = false;
      this.ProductListData[0].data.products = this.displayProducts;
    }
  }
}

