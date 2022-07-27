import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/Services/api-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-product-wishlist',
  templateUrl: './product-wishlist.component.html',
  styleUrls: ['./product-wishlist.component.scss']
})
export class ProductWishlistComponent implements OnInit {
  product: any = [];
  imageurl = environment.assetsurl
  wishlistShimmer: boolean = true;
  cartUpdated:boolean = false;
  constructor(private _ApiService: ApiServiceService,private route:Router) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.getWishlistItems();
    }, 500);
  }
  //add product to cart
  async addProductToCart(prod: any) {
    this.cartUpdated = true;
    await this._ApiService.addItemToCart(prod.product_id, 1, "add")
        .then(res => {
          console.log(res);
          this._ApiService.GetCart.next(res.data);
          this.cartUpdated = false;
        })
        .catch((error: any) => {
          if (error.status == 401) {
            this.cartUpdated =false;
            localStorage.removeItem('ecolink_user_credential');
            this.route.navigateByUrl('profile/auth');
          }
        })
    this.route.navigateByUrl('/cart')
  }
  //get all wishlist product
  async getWishlistItems() {
    this.wishlistShimmer = true;
    this.product = [];
    await this._ApiService.getWishListItem()
      .then(res => {
        if (res.code == 200) {
          console.log(res);
          this.product.push(res.data);
          this.wishlistShimmer = false;
        }
      })
      .catch((error: any) => {
        if (error.error.code == 400) {
          console.log("400");
          this.product = [];
          this.wishlistShimmer = false;
        }
      })
  }
  //delete product from wishlist
  async deleteWishlistItems(product_id: any) {
    await this._ApiService.deleteWishlistItems(product_id)
      .then(res => {
        if (res.code == 200) {
          this.getWishlistItems();
        }
      })

      .catch(error => {
        if (error.error.code == 400) {
          this.getWishlistItems();
        }
      })
  }
}
