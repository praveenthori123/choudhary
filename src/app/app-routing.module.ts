import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductCartComponent } from './product-cart/product-cart.component';
import {PageNotFoundComponent} from "./shared/page-not-found/page-not-found.component";

const routes: Routes = [
  { path: 'page-not-found', component: PageNotFoundComponent },
  { path: '', loadChildren: () => import('./home/home.module').then(m => m.HomeModule) },
  { path: 'shared', loadChildren: () => import('./shared/shared.module').then(m => m.SharedModule) },
  { path: 'product-category', loadChildren: () => import('./productlist/productlist.module').then(m => m.ProductlistModule) },
  { path: '', loadChildren: () => import('./productdetail/productdetail.module').then(m => m.ProductdetailModule) },
  { path: 'profile', loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule) },
  { path: 'cart', component: ProductCartComponent , pathMatch:"full"},
  { path: '', loadChildren: () => import('./innerpages/innerpages.module').then(m => m.InnerpagesModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: "enabled"
  }),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
