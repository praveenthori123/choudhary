import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth.guard';
import { PageNotFoundComponent } from '../shared/page-not-found/page-not-found.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ProfileComponent } from './profile.component';
import { SignupSigninComponent } from './signup-signin/signup-signin.component';

const routes: Routes = [
  { path: '', canActivate: [AuthGuard], component: ProfileComponent },
  { path: 'auth', component: SignupSigninComponent },
  { path: 'reset-password', component: ForgotPasswordComponent },
  { path: 'reset-password/:params', component: ForgotPasswordComponent },
  {
    component: PageNotFoundComponent, path: "404",
  },
  {
    path: "**",
    redirectTo: '404'
  }

];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
