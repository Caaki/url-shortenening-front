import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./components/login/login.component";
import {RegisterComponent} from "./components/register/register.component";
import {ResetpasswordComponent} from "./components/resetpassword/resetpassword.component";
import {VerifyComponent} from "./components/verify/verify.component";

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'register', component:RegisterComponent},
  {path: 'resetpassword', component:ResetpasswordComponent},
  {path: 'user/verify/accoun/:key', component:VerifyComponent},
  {path: 'user/verify/password/:key', component:VerifyComponent},
  {path: '**', component:LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
