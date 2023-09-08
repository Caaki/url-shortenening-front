import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ResetpasswordComponent } from './components/resetpassword/resetpassword.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { VerifyComponent } from './components/verify/verify.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import { UrlComponent } from './components/url/url.component';
import { ProfileComponent } from './components/profile/profile.component';
import { UrlsComponent } from './components/urls/urls.component';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { StatsComponent } from './components/stats/stats.component';
import {TokenInterceptor} from "./interceptor/token.interceptor";

@NgModule({
  declarations: [
    AppComponent,
    ResetpasswordComponent,
    LoginComponent,
    RegisterComponent,
    VerifyComponent,
    UrlComponent,
    ProfileComponent,
    UrlsComponent,
    HomeComponent,
    NavbarComponent,
    StatsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi:true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
