import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {catchError, Observable, tap, throwError} from "rxjs";
import {CustomHttpResponse, Profile} from "../interface/appstates";
import {User} from "../interface/user";
import {Key} from "../enum/key.enum";
import {JwtHelperService} from "@auth0/angular-jwt";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly server: string = "http://192.168.1.44:8080";
  private jwtHelper = new JwtHelperService();
  constructor(private http: HttpClient) {
  }

  login(email: string, password: string): Observable<CustomHttpResponse<Profile>> {
    const url = `${this.server}/user/login`;
    const body = {email, password};
    return this.http.post<CustomHttpResponse<Profile>>(url, body).pipe(
      tap(console.log),
      catchError(this.handleError)
    );
  }

  verifyCode(email: string, code: string): Observable<CustomHttpResponse<Profile>> {
    const url = `${this.server}/user/verify/code/${email}/${code}`;
    return this.http.get<CustomHttpResponse<Profile>>(url).pipe(
      tap(console.log),
      catchError(this.handleError)
    );
  }

  profile$ = () => <Observable<CustomHttpResponse<Profile>>>
    this.http.get<CustomHttpResponse<Profile>>
    (`${this.server}/user/profile`)
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );

  update$ = (user: User) => <Observable<CustomHttpResponse<Profile>>>
    this.http.patch<CustomHttpResponse<Profile>>
    (`${this.server}/user/update`, user)
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );

  updatePassword$ = (form:{currentPassword: string, newPassword:string, confirmPassword:string}) => <Observable<CustomHttpResponse<Profile>>>
    this.http.patch<CustomHttpResponse<Profile>>
    (`${this.server}/user/update/password`, form)
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );

  updateUserSettings$ = (form:{enabled: boolean, notLocked:boolean}) => <Observable<CustomHttpResponse<Profile>>>
    this.http.patch<CustomHttpResponse<Profile>>
    (`${this.server}/user/update/settings`, form)
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );

  refreshToken$ = () => <Observable<CustomHttpResponse<Profile>>>
    this.http.get<CustomHttpResponse<Profile>>
    (`${this.server}/user/refresh/token`)
      .pipe(
        tap(response => {
          localStorage.removeItem(Key.TOKEN);
          localStorage.removeItem(Key.REFRESH_TOKEN);
          localStorage.setItem(Key.TOKEN, response.data.access_token);
          localStorage.setItem(Key.REFRESH_TOKEN, response.data.refresh_token);
        }),
        catchError(this.handleError)
      );

  toggleMfa$ = () => <Observable<CustomHttpResponse<Profile>>>
    this.http.patch<CustomHttpResponse<Profile>>
    (`${this.server}/user/togglemfa`,{})
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );

  updateImage$ = (formData: FormData) => <Observable<CustomHttpResponse<Profile>>>
    this.http.patch<CustomHttpResponse<Profile>>
    (`${this.server}/user/update/image`,formData)
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );

  isAuthenticated(): boolean{
    return (this.jwtHelper.decodeToken<string>(localStorage.getItem(Key.TOKEN)))
      && !this.jwtHelper.isTokenExpired(localStorage.getItem(Key.TOKEN));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage: string;
    if (error.error instanceof ErrorEvent) {
      errorMessage = `A client error occurred - ${error.error.message}`
    } else {
      if (error.error.reason) {

        errorMessage = error.error.reason;
      } else {
        errorMessage = `An error occurred - Error status ${error.status}`
      }
    }
    return throwError(() => errorMessage);
  }

  logOut() {
    localStorage.removeItem(Key.TOKEN);
    localStorage.removeItem(Key.REFRESH_TOKEN);
  }
}
