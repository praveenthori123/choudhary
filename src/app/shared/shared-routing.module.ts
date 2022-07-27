import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogComponent } from './blog/blog.component';
import { AskChemistComponent } from './Forms/ask-chemist/ask-chemist.component';
import { FooterComponent } from './footer/footer.component';
import { GSAProductComponent } from './gsa-product/gsa-product.component';
import { HeaderComponent } from './header/header.component';
import { OrderFailComponent } from './order-fail/order-fail.component';
import { ProductsRequestComponent } from './Forms/products-request/products-request.component';
import { ThankYouComponent } from './thank-you/thank-you.component';
import { HomeComponent } from '../home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import {NgSelectModule, NgOption} from '@ng-select/ng-select';
import { CannabisComponent } from './Forms/cannabis/cannabis.component';
import { ContacttodayComponent } from './Forms/contacttoday/contacttoday.component';
import { CustomBlandSolutionComponent } from './Forms/custom-bland-solution/custom-bland-solution.component';
import { InternOnboardingFormComponent } from './Forms/intern-onboarding-form/intern-onboarding-form.component';
import { InternshipApplicationComponent } from './Forms/internship-application/internship-application.component';
import { ScholarshipContestSubmissionComponent } from './Forms/scholarship-contest-submission/scholarship-contest-submission.component';
import { ScholarshipWinnersComponent } from './Forms/scholarship-winners/scholarship-winners.component';

const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'header', component: HeaderComponent },
  { path: 'footer', component: FooterComponent },
  { path: 'inner-pages/contact/request', component: ProductsRequestComponent },
  { path: 'thanks', component: ThankYouComponent },
  { path: 'failure', component: OrderFailComponent },
  { path: 'error-404', component: PageNotFoundComponent },
  { path: 'inner-pages/contact/ask-the-chemist', component: AskChemistComponent },
  { path: 'inner-pages/contact/cannabis', component: CannabisComponent },
  { path: 'inner-pages/contact/contact-today', component: ContacttodayComponent },
  { path: 'inner-pages/contact/custom-bland-solution', component: CustomBlandSolutionComponent },
  { path: 'inner-pages/contact/intern-onboarding', component: InternOnboardingFormComponent },
  { path: 'inner-pages/contact/internshipapplication', component: InternshipApplicationComponent },
  { path: 'inner-pages/contact/scholarshipapplication', component: ScholarshipContestSubmissionComponent },
  { path: 'inner-pages/contact/scholarship-winners', component: ScholarshipWinnersComponent },
  { path: 'shops', component: GSAProductComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes), NgSelectModule],
  exports: [RouterModule]
})
export class SharedRoutingModule { }
