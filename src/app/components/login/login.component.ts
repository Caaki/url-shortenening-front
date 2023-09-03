import { Component } from '@angular/core';
import {UserService} from "../../service/user.service";
import {Router} from "@angular/router";
import {NgForm} from "@angular/forms";
import {BehaviorSubject, catchError, map, Observable, of, startWith} from "rxjs";
import {LoginState} from "../../interface/appstates";
import {DataState} from "../../enum/datastate.enum";
import {Key} from "../../enum/key.enum";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  // @ts-ignore
  loginState$ :Observable<LoginState> = of({dataState: DataState.LOADED});
  //loginState: Observable<LoginState> = new Observable<LoginState>();
  private phoneSubject = new BehaviorSubject<string | null>(null);
  private emailSubject = new BehaviorSubject<string | null>(null);
  readonly DataState = DataState;

  constructor(private userService: UserService, private router:Router) {
  }

  login(loginForm: NgForm):void{

    this.loginState$ = this.userService.login(loginForm.value.email, loginForm.value.password)
      .pipe(map(response => {
        console.log(response.data.user);
        if(response.data.user.usingMfa){
          this.phoneSubject.next(response.data.user.phone);
          this.emailSubject.next(response.data.user.email);
          return {dataState: DataState.LOADED, loginSuccess:false ,
            isUsingMfa:true, phone: response.data.user.phone.substring(response.data.user.phone.length-4)}
        }else{
          localStorage.setItem(Key.TOKEN, response.data.access_token);
          localStorage.setItem(Key.REFRESH_TOKEN, response.data.refresh_token);
          this.router.navigate(['/']);
          return {dataState: DataState.LOADED, loginSuccess:true};
        }
      }),
        startWith({dataState: DataState.LOADING, isUsingMfa: false}),
          catchError((error: string) => {
            return of({dataState: DataState.ERROR, isUsingMfa:false,loginSuccess:false,error})
          })
      )
  }

  verifyCode(verifyCodeForm:NgForm):void{
    this.loginState$ = this.userService.verifyCode(this.emailSubject.value,verifyCodeForm.value.code)
      .pipe(map(response => {
            localStorage.setItem(Key.TOKEN, response.data.access_token);
            localStorage.setItem(Key.REFRESH_TOKEN, response.data.refresh_token);
            this.router.navigate(['/']);
            return {dataState: DataState.LOADED, loginSuccess:true};
        }),
        startWith({dataState: DataState.LOADING, loginSuccess:false ,
          isUsingMfa:true, phone: this.phoneSubject.value.substring(this.phoneSubject.value.length-4)}),
        catchError((error: string) => {
          return of({dataState: DataState.ERROR, isUsingMfa:true, phone: this.phoneSubject.value.substring(this.phoneSubject.value.length-4),loginSuccess:false,error})
        })
      )
  }

  loginPage():void{
    this.loginState$ = of({dataState: DataState.LOADED});
  }

}
