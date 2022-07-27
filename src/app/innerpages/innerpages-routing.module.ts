import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InnerpagesComponent } from './innerpages.component';

const routes: Routes = [
  { path: ':slug', component: InnerpagesComponent },
  // { path: ':sublink', component: InnerpagesComponent },
  { path: ':sublink/:subsublink', component: InnerpagesComponent },
  { path: ':sublink/:subsublink/:subsubsublink', component: InnerpagesComponent },
  { path: ':sublink/:subsublink/:subsubsublink/:subsubsubsublink', component: InnerpagesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InnerpagesRoutingModule { }
