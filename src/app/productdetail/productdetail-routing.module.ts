import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderFailComponent } from '../shared/order-fail/order-fail.component';
import { PageNotFoundComponent } from '../shared/page-not-found/page-not-found.component';
import { ThankYouComponent } from '../shared/thank-you/thank-you.component';
import { MainDetailComponent } from './main-detail/main-detail.component';
import { ProductCheckoutComponent } from './product-checkout/product-checkout.component';
import { ProductWishlistComponent } from './product-wishlist/product-wishlist.component';
import { ProductdetailComponent } from './productdetail.component';
import { ShopComponent } from './shop/shop.component';

const routes: Routes = [
  {
    path: 'shop', component: ProductdetailComponent,
    children: [
      {
        path: '', component: MainDetailComponent,
      },
      {
        path: ':category/:slug/:subslug/:subsublug', component: ShopComponent,
      },
      {
        path: ':category/:slug/:subslug', component: ShopComponent,
      },
      {
        path: ':category/:slug', component: ShopComponent,
      },
      {
        path: 'checkout', component: ProductCheckoutComponent,
      },
      {
        path: 'wishlist', component: ProductWishlistComponent,
      },
    ]
  },
  { path: 'thanks', component: ThankYouComponent },
  { path: 'failed', component: OrderFailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductdetailRoutingModule { }
