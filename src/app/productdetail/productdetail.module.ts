import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductdetailRoutingModule } from './productdetail-routing.module';
import { ProductdetailComponent } from './productdetail.component';
import { SharelibraryModule } from '../sharelibrary/sharelibrary.module';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { ProductWishlistComponent } from './product-wishlist/product-wishlist.component';
import { ProductCheckoutComponent } from './product-checkout/product-checkout.component';
import { ShopComponent } from './shop/shop.component';
import { MainDetailComponent } from './main-detail/main-detail.component';
import { HomeModule } from '../home/home.module';
import { BillingFormComponent } from './billing-form/billing-form.component';
import { NgxPayPalModule } from 'ngx-paypal';



@NgModule({
  declarations: [
    ProductdetailComponent,
    ProductWishlistComponent,
    ProductCheckoutComponent,
    ShopComponent,
    MainDetailComponent,
    BillingFormComponent,
  ],
  imports: [
    CommonModule,
    ProductdetailRoutingModule,
    SharelibraryModule,
    FormsModule,
    SharedModule,
    HomeModule,
    NgxPayPalModule,
    ReactiveFormsModule
  ]
})
export class ProductdetailModule { }
