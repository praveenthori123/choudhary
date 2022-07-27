import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { HomeBannerComponent } from './home-banner/home-banner.component';
import { SharedModule } from '../shared/shared.module';
import { AboutUsComponent } from '../shared/about-us/about-us.component';
import { MediaComponent } from '../shared/media/media.component';
import { SharelibraryModule } from '../sharelibrary/sharelibrary.module';
import { BlogComponent } from '../shared/blog/blog.component';
import { ManufactureComponent } from '../shared/manufacture/manufacture.component';
import { FormsModule } from '@angular/forms';
import { CategoriesComponent } from './categories/categories.component';



const exportdata: any = [
  CategoriesComponent,
  BlogComponent
]

@NgModule({
  declarations: [
    HomeComponent,
    HomeBannerComponent,
    AboutUsComponent,
    MediaComponent,
    BlogComponent,
    ManufactureComponent,
    CategoriesComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule,
    SharelibraryModule,
    FormsModule
  ],

  exports: [
    ...exportdata
  ]
})
export class HomeModule { }
