import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InnerpagesRoutingModule } from './innerpages-routing.module';
import { InnerpagesComponent } from './innerpages.component';
import { SharedModule } from '../shared/shared.module';
import { HomeModule } from '../home/home.module';
import { ProductdetailModule } from '../productdetail/productdetail.module';
import { SharelibraryModule } from '../sharelibrary/sharelibrary.module';

@NgModule({
  declarations: [
    InnerpagesComponent
  ],
  imports: [
    HomeModule,
    ProductdetailModule,
    SharedModule,
    CommonModule,
    InnerpagesRoutingModule,
    SharelibraryModule
    
  ]
})
export class InnerpagesModule {
 }
