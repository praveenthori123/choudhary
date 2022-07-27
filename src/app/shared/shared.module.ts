import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { SharedComponent } from './shared.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { CardSliderComponent } from './card-slider/card-slider.component';
import { SharelibraryModule } from '../sharelibrary/sharelibrary.module';
import { CallToActionComponent } from './call-to-action/call-to-action.component';
import { MediaBannerComponent } from './media-banner/media-banner.component';
import { TrendingPostComponent } from './trending-post/trending-post.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductsRequestComponent } from './Forms/products-request/products-request.component';
import { ReturnProductListingComponent } from './return-product-listing/return-product-listing.component';
import { GoogleMapComponent } from './Forms/google-map/google-map.component';
import { ThankYouComponent } from './thank-you/thank-you.component';
import { OrderFailComponent } from './order-fail/order-fail.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AskChemistComponent } from './Forms/ask-chemist/ask-chemist.component';
import { SupportFormComponent } from './Forms/support-form/support-form.component';
import { BulkPricingComponent } from './Forms/bulk-pricing/bulk-pricing.component';
import { GSAProductComponent } from './gsa-product/gsa-product.component';
import { PipemoduleModule } from '../pipemodule/pipemodule.module';
import { GeolocationService } from '@ng-web-apis/geolocation';
import { NgSelectModule } from '@ng-select/ng-select';
import { ImageModalComponent } from './image-modal/image-modal.component';
import {CalendarModule} from 'primeng/calendar';
import { CannabisComponent } from './Forms/cannabis/cannabis.component';
import { ContacttodayComponent } from './Forms/contacttoday/contacttoday.component';
import { CustomBlandSolutionComponent } from './Forms/custom-bland-solution/custom-bland-solution.component';
import { InternOnboardingFormComponent } from './Forms/intern-onboarding-form/intern-onboarding-form.component';
import { InternshipApplicationComponent } from './Forms/internship-application/internship-application.component';
import { ScholarshipContestSubmissionComponent } from './Forms/scholarship-contest-submission/scholarship-contest-submission.component';
import { ScholarshipWinnersComponent } from './Forms/scholarship-winners/scholarship-winners.component';
const exportdata: any = [
  HeaderComponent,
  FooterComponent,
  CardSliderComponent,
  CallToActionComponent,
  ProductsRequestComponent,
  MediaBannerComponent,
  AskChemistComponent,
  GoogleMapComponent,
  SupportFormComponent,
  TrendingPostComponent,
  BulkPricingComponent, 
  GSAProductComponent,
  PageNotFoundComponent,
  ImageModalComponent,
  CannabisComponent
]

@NgModule({
  declarations: [
    SharedComponent,
    HeaderComponent,
    FooterComponent,
    CardSliderComponent,
    ...exportdata,
    CallToActionComponent,
    MediaBannerComponent,
    TrendingPostComponent,
    ReturnProductListingComponent,
    ThankYouComponent,
    OrderFailComponent,
    PageNotFoundComponent,
    AskChemistComponent,
    SupportFormComponent,
    ImageModalComponent,
    ContacttodayComponent,
    CustomBlandSolutionComponent,
    InternOnboardingFormComponent,
    InternshipApplicationComponent,
    ScholarshipContestSubmissionComponent,
    ScholarshipWinnersComponent,
    
  ],
  imports: [
    CommonModule,
    PipemoduleModule,
    SharedRoutingModule,
    SharelibraryModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    CalendarModule
  ],
  exports: [
    ...exportdata,
    PageNotFoundComponent,
    CalendarModule
  ],
  providers:[
    GeolocationService,
    DatePipe
  ]
})
export class SharedModule { }
