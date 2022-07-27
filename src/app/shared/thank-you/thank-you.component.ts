import { AfterViewInit, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-thank-you',
  templateUrl: './thank-you.component.html',
  styleUrls: ['./thank-you.component.scss']
})
export class ThankYouComponent implements OnInit, AfterViewInit {
  orderdetail: any = [];
  total_amount: number = 0;
  count: any = 1;
  user_order_detail: any = [];
  total_payable_detail : any = [];
  order: any;
  servicecharge:any=0;
  order_id :any;
  constructor() { }

  ngOnInit(): void {
    this.servicecharge = localStorage.getItem('servicecharge');
    localStorage.removeItem("Cookies_Cart_Data");
    let order_detail = localStorage.getItem('OrderInfo'); 
    if (order_detail) {
      this.orderdetail = JSON.parse(order_detail);
    }

    this.orderdetail.map((res: any, index: any , arr:any) => {
      if(arr.length-1 === index){
        console.log(res);
        this.total_payable_detail.push(res);       
      }
      else {
        this.user_order_detail.push(res);
      }
    })

    this.total_payable_detail.map((res:any)=>{
      this.order_id = res.order_id;

      
    })
    console.log(this.total_payable_detail , this.user_order_detail);
    
  }
  ngAfterViewInit() {
  }

}
