import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {catchError, Observable, tap, throwError} from "rxjs";
import {CustomHttpResponse, Profile} from "../interface/appstates";
import {User} from "../interface/user";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly server: string = "http://localhost:8080";
  private readonly token: string = "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJVcmwgc2hvcnRlbmluZyIsImF1ZCI6Ik1ha2UgdXJscyBzaG9ydCBhZ2FpbiEiLCJpYXQiOjE2OTQwMzkxNTMsInN1YiI6IjIiLCJhdXRob3JpdGllcyI6WyJSRUFEOlVTRVIiLCJSRUFEOlVSTCIsIkNSRUFURTpVUkwiLCJVUERBVEU6VVNFUiJdLCJleHAiOjE2OTQ0NzExNTN9.p8wnr4pUoHEjU6r-7UMJxpYOTypQvhUbsl9oM7EBlxg9oDe-Mb9KXuBfqottrh-YPUQT_fOrm-noNB3wnDWdww";

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
    (`${this.server}/user/profile`, {headers: new HttpHeaders().set('Authorization', this.token)})
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );

  update$ = (user: User) => <Observable<CustomHttpResponse<Profile>>>
    this.http.patch<CustomHttpResponse<Profile>>
    (`${this.server}/user/update`, user, {headers: new HttpHeaders().set('Authorization', this.token)})
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );

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
