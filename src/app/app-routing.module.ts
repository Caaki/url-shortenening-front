import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./components/login/login.component";
import {RegisterComponent} from "./components/register/register.component";
import {ResetpasswordComponent} from "./components/resetpassword/resetpassword.component";
import {VerifyComponent} from "./components/verify/verify.component";
import {UrlComponent} from "./components/url/url.component";
import {ProfileComponent} from "./components/profile/profile.component";
import {UrlsComponent} from "./components/urls/urls.component";
import {HomeComponent} from "./components/home/home.component";
import {AuthenticationGuard} from "./guard/authentication.guard";

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'register', component:RegisterComponent},
  {path: 'resetpassword', component:ResetpasswordComponent},
  {path: 'url', component:UrlComponent, canActivate:[AuthenticationGuard]},
  {path: 'urls', component:UrlsComponent,canActivate:[AuthenticationGuard]},
  {path: 'profile', component:ProfileComponent,canActivate:[AuthenticationGuard]},
  {path: 'user/verify/account/:key', component:VerifyComponent,canActivate:[AuthenticationGuard]},
  {path: 'user/verify/password/:key', component:VerifyComponent,canActivate:[AuthenticationGuard]},
  {path: '', component:HomeComponent,canActivate:[AuthenticationGuard]},
  {path: '', redirectTo:'/', pathMatch:'full'},
  {path: '**', component:HomeComponent,canActivate:[AuthenticationGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
