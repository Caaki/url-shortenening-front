import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpResponse, HttpErrorResponse
} from '@angular/common/http';
import {BehaviorSubject, catchError, Observable, switchMap, throwError} from 'rxjs';
import {Key} from "../enum/key.enum";
import {UserService} from "../service/user.service";
import {CustomHttpResponse, Profile} from "../interface/appstates";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  private readonly allowedPaths = [
    'http://192.168.1.44:8080/user/login',
    'http://192.168.1.44:8080/register',
    'http://192.168.1.44:8080/user/verify/code',
    'http://192.168.1.44:8080/user/verify/password',
    'http://192.168.1.44:8080/user/resetpassword',
    'http://192.168.1.44:8080/user/verify/account',
    'http://192.168.1.44:8080/user/refresh/token'
  ];

  private isTokenRefreshing: boolean =false;
  private refreshTokenSubject : BehaviorSubject<CustomHttpResponse<Profile>> = new BehaviorSubject(null);

  constructor(private userService: UserService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>>| Observable<HttpResponse<unknown>> {
    const isAllowedPath = this.allowedPaths.some((path) => request.url.includes(path));
    if (isAllowedPath){
      return next.handle(request);
    }else{
      return next.handle(this.addAuthorizationTokenHeader(request,localStorage.getItem(Key.TOKEN)))
        .pipe(
          catchError((error:HttpErrorResponse) =>{
            if (error instanceof HttpErrorResponse && error.status === 401 && error.error.reason=='Token expired!'){
              return this.handleRefreshToken(request,next);
            }else {
              return throwError(() =>error);
            }
          })
        );
    }
  }

  private addAuthorizationTokenHeader(request: HttpRequest<unknown>, token: string) {
    return request.clone({setHeaders:{Authorization: `Bearer ${token}`}});
  }

  private handleRefreshToken(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!this.isTokenRefreshing){
      //console.log("Refreshing token");
      this.isTokenRefreshing = true;
      this.refreshTokenSubject.next(null);
      return this.userService.refreshToken$().pipe(
        switchMap((response) => {
          this.isTokenRefreshing = false;
          this.refreshTokenSubject.next(response);
          return next.handle(this.addAuthorizationTokenHeader(request, response.data.access_token));
        })
      );
    }else {
      this.refreshTokenSubject.pipe(
        switchMap((response) =>{
          return next.handle(this.addAuthorizationTokenHeader(request, response.data.access_token))
        })
      );
    }
  }


}
