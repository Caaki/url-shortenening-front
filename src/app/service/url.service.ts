import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {catchError, mergeWith, Observable, tap, throwError} from "rxjs";
import {CustomHttpResponse, Page, Profile, UrlDetails} from "../interface/appstates";
import {User} from "../interface/user";
import {Url} from "../interface/url";

@Injectable({
  providedIn: 'root'
})
export class UrlService {

  private readonly server: string = "http://192.168.1.44:8080";
  constructor(private http: HttpClient) {
  }

  urls(page: number = 0): Observable<CustomHttpResponse<Page &  User>> {
    const url = `${this.server}/url/list?page=${page}`;
    const body = {page};
    return this.http.get<CustomHttpResponse<Page &  User>>(url).pipe(
      tap(console.log),
      catchError(this.handleError)
    );
  }

  getUrl(urlId: number): Observable<CustomHttpResponse<UrlDetails>> {
    const url = `${this.server}/url/get/${urlId}`;
    return this.http.get<CustomHttpResponse<UrlDetails>>(url).pipe(
      tap(console.log),
      catchError(this.handleError)
    );
  }

  newUrl(createdUrl: Url): Observable<CustomHttpResponse<Url &  User>> {
    const url = `${this.server}/url/create`;
    return this.http.post<CustomHttpResponse<Url & User>>(url,createdUrl).pipe(
      tap(console.log),
      catchError(this.handleError)
    );
  }

  update$ = (url: Url) => <Observable<CustomHttpResponse<UrlDetails>>>
    this.http.patch<CustomHttpResponse<UrlDetails>>
    (`${this.server}/url/update`, url)
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );

  redirect(link: string): Observable<CustomHttpResponse<string>>{
    const url = `${this.server}/url/redirect/${link}`;
    console.log(url);
    return this.http.get<CustomHttpResponse<string>>(url).pipe(
      tap(console.log),
      catchError(this.handleError)
    )
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
