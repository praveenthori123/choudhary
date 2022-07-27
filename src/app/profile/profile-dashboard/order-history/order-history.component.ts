import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';
import { ApiServiceService } from 'src/app/Services/api-service.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss']
})
export class OrderHistoryComponent implements OnInit {
  orderData: any = [];
  order: any = [];
  pagination:boolean=false;
  count:any=0;
  totalpage:any=0
  p:any;
  spinnercheck:boolean=false;
  shimmarload:boolean=true;
  searchProductArray: any = [];
  orderHistoryDesc: any = [];
  show: boolean = true;
  searchItem: string = '';
  suggestions: boolean = false;
  @Input() showdesc: any;
  order_id : any;
  constructor(private __apiservice: ApiServiceService,) { }

  ngOnInit(): void { 
    this.getOrderhistory();
  }
  pagenumber:any=0
  pagechange(page:any) {
    this.pagenumber=page
    console.log(page)
    if(page>=1 && page<=this.totalpage) {
      this.getOrderhistory();
    }
  }
  // <-- Get Order History -->
  async getOrderhistory() {
    let product_search: any;
    await this.__apiservice.getOrderData(this.pagenumber)
    .then((res: any) => {
      this.shimmarload=false
        console.log("Order History" , res);
        console.log("res" , res);        
        this.orderData = res.data.data;
        console.log(this.orderData, "orderhistory");
        console.log(res.data.total)
        // if(res.data.total>20) {
          // this.pagination=true;
          this.count=res.data.current_page
          this.totalpage=res.data.last_page;
          console.log(this.count,this.totalpage>=1?this.totalpage:1)
        // }
        // else {
        //   this.pagination=false;
        // }
        // res.data?.map((resp: any) => {
        //   resp.items.map((response: any) => {
        //     product_search = response.product;
        //   })
        //   this.searchProductArray.push(product_search);
        // })
        this.spinnercheck=false;
      })

      .catch(error => {
        console.log(error);
      })

  }
  // <-- Order History Details for Particular Product -->
  order_product_id: any;
  showDetails(i: any, id: any) {
    console.log(i, id);
    this.order_product_id = id;
    this.orderHistoryDesc = [];
    this.orderHistoryDesc.push(i)
    console.log(this.orderHistoryDesc)
    this.show = !this.show;
  }
  // Get Search Data from search bar on order history
  getselecteddata(value: any) {
    console.log(value);
    this.searchItem = value;
    this.suggestions = false;
  }
  // Order history search bar Suggestions 
  getSuggestions() {
    if (this.searchItem.length > 0) {
      this.suggestions = true;
    }
    else {
      this.suggestions = false;
      this.orderData = this.order;
    }
  }
  // Fetch Order History Data from search Bar
  FetchSearchedData() {
    let product_search: any;
    this.orderData = []
    this.order.map((res: any) => {
      res.items.filter((resp: any) => {
        product_search = '';
        if (resp.product.name.includes(this.searchItem)) {
          product_search = res;
        }

        if (product_search) {
          console.log(product_search);
          this.orderData.push(product_search);
        }

        console.log(this.orderData);

      })
    })
  }

  // Cancel Order
  async orderCancel(id:any) {
    this.spinnercheck=true;
    await this.__apiservice.CancelOrderApi(id).then(res => {
      console.log(res);
      console.log("res.code", res.code);
      this.getOrderhistory();
    })
      .catch((error) => {
        console.log(error.status);
        this.getOrderhistory();
      })
  }
  detailcheck:boolean=false;
  UserOrder_id:any;
  showdetail(id:any) {
    this.detailcheck=true;
    this.UserOrder_id=id
  }

  showOrders() {
    this.detailcheck=false;
  }

  // Return Order 

  // storeReturnProduct(i: any) {
  //   let storeObj: any;
  //   console.log(i)
  //   storeObj = {
  //     order_id: i.order_id,
  //     order_item_id: i.id,
  //     product_id: i.product_id,
  //     quantity: i.quantity,
  //     reason: "Accidentally Placed Order",
  //     description: "test"
  //   }
  //   this.__apiservice.storeReturnOrder(storeObj).subscribe(res => {
  //     console.log(res)
  //   })
  // }
  // getReturnProduct() {
  //   this.__apiservice.getReturnOrder().subscribe(res => {
  //     setTimeout(() => {
  //       console.log("returndata", res)
  //     }, 1000);
  //   })
  // }
}
