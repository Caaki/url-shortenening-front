import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, Observable, tap, throwError} from "rxjs";
import {CustomHttpResponse, Profile} from "../interface/appstates";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly server: string = "http://localhost:8080";

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

  verifyCode(email:string, code: string): Observable<CustomHttpResponse<Profile>> {
    const url = `${this.server}/user/verify/code/${email}/${code}`;
    return this.http.get<CustomHttpResponse<Profile>>(url).pipe(
      tap(console.log),
      catchError(this.handleError)
    );
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
}
