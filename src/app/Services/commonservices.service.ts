import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiServiceService } from './api-service.service';
import { CookiesService } from './cookies.service';

@Injectable({
  providedIn: 'root'
})
export class CommonservicesService {

  constructor(private route: ActivatedRoute, private _ApiService: ApiServiceService, private Cookies: CookiesService, private router: Router) { }

  async AddProductToCart(Item: any, slug: any, ItemCount: any) {
    let previousdata: any;

    if (localStorage.getItem('ecolink_user_credential') == null) {
      let cart_obj: any = [];
      previousdata = this.Cookies.GetCartData();
      let recently_added_object = {
        "CartProductId": Item.id,
        "ProductQuantity": ItemCount,
        "ProductCategory": slug.slug
      }
      cart_obj.push(recently_added_object);
      if (previousdata != 'empty') {
        previousdata.map((res: any) => {
          if (res.CartProductId != cart_obj[0].CartProductId) {
            cart_obj.push(res);
          }
          else {
            cart_obj[0].ProductQuantity = cart_obj[0].ProductQuantity + res.ProductQuantity;
            console.log(cart_obj);
          }
        })
      }
      this.Cookies.SaveCartData(cart_obj);
      console.log(cart_obj);
      this._ApiService.itemCountSession.next(ItemCount);
    }
    else {
      console.log(Item);
      await this._ApiService.addItemToCart(Item.id, ItemCount, "add")
        .then(res => {
          console.log(res);
        })
        .catch((error: any) => {
          if (error.status == 401) {
            localStorage.removeItem('ecolink_user_credential');
            this.router.navigateByUrl('profile/auth');
          }
        })
    }
  }
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
  }
}
