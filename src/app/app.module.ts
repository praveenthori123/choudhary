import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxsModule } from '@ngxs/store';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { BrowserModule } from '@angular/platform-browser';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard } from './auth.guard';
import { ProductCartComponent } from './product-cart/product-cart.component';
import { ApiServiceService } from './Services/api-service.service';
import { SharedModule } from './shared/shared.module';
import { SharelibraryModule } from './sharelibrary/sharelibrary.module';
import { FetchedHeaderState } from './store/state/header.state';
import { environment } from 'src/environments/environment';
import { ServiceWorkerModule } from '@angular/service-worker';
import { CommonModule } from "@angular/common";
import { FetchedCategoriesState } from './store/state/category.state';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
@NgModule({
  declarations: [
    AppComponent,
    ProductCartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    SharedModule,
    SharelibraryModule,
    CommonModule,
    ToastrModule.forRoot(),
    NgxsModule.forRoot([FetchedHeaderState, FetchedCategoriesState], { developmentMode: !environment.production }),
    NgxsLoggerPluginModule.forRoot(),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    BrowserAnimationsModule
  ],
  providers: [ApiServiceService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
