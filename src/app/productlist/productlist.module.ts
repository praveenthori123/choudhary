import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductlistRoutingModule } from './productlist-routing.module';
import { ProductlistComponent } from './productlist.component';
import { SharelibraryModule } from '../sharelibrary/sharelibrary.module';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { PipemoduleModule } from '../pipemodule/pipemodule.module';
import { SubcatgorycomponentComponent } from './subcatgorycomponent/subcatgorycomponent.component';

@NgModule({
  declarations: [
    ProductlistComponent,
    SubcatgorycomponentComponent
  ],
  imports: [
    CommonModule,
    ProductlistRoutingModule,
    SharelibraryModule,
    FormsModule,
    SharedModule,
    PipemoduleModule
  ]

})
export class ProductlistModule { }
