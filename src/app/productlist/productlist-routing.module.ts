import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductlistComponent } from './productlist.component';
import { SubcatgorycomponentComponent } from './subcatgorycomponent/subcatgorycomponent.component';

const routes: Routes = [
  { path: ':slug', component: ProductlistComponent },
  { path: ':slug/:sublink', component: SubcatgorycomponentComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductlistRoutingModule { }
