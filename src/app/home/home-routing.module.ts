import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutUsComponent } from '../shared/about-us/about-us.component';
import { BlogComponent } from '../shared/blog/blog.component';
import { HomeBannerComponent } from './home-banner/home-banner.component';
import { HomeComponent } from './home.component';
import { ManufactureComponent } from '../shared/manufacture/manufacture.component';
import { MediaComponent } from '../shared/media/media.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home/:token', component: HomeComponent },
  { path : 'banner', component: HomeBannerComponent},
  { path : 'about-us', component: AboutUsComponent},
  { path : 'info', component: MediaComponent},
  { path : 'info/:slug', component: BlogComponent},
  { path : 'manufacture', component: ManufactureComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
