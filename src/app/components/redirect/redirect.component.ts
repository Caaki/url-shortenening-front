import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap} from "@angular/router";
import {BehaviorSubject, catchError, map, Observable, of, startWith, switchMap} from "rxjs";
import {UrlService} from "../../service/url.service";

import {State} from "../../interface/general-state";
import {CustomHttpResponse} from "../../interface/appstates";

import {Url} from "../../interface/url";
import {DataState} from "../../enum/datastate.enum";

@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.css']
})
export class RedirectComponent implements OnInit {
  // @ts-ignore
  redirectState$: Observable<State<CustomHttpResponse<string>>> = {dataState:DataState.LOADING};
  private dataSubject = new BehaviorSubject<CustomHttpResponse<string>>(null);
  readonly DataState = DataState;

  constructor(
    private activeRoute: ActivatedRoute,
    private urlService: UrlService
  ) {}

  ngOnInit(): void {
    this.redirectState$ = this.activeRoute.paramMap.pipe(
      switchMap((params: ParamMap) => {
        const link = params.get('link');
        console.log('Link:', link);
        return this.urlService.redirect(link).pipe(
          map((response) => {
            // @ts-ignore
            if (response.data && response.data.url) {
              // @ts-ignore
              const redirectUrl = response.data.url;
              if (redirectUrl.startsWith('http://') || redirectUrl.startsWith('https://')) {
                window.location.href = redirectUrl;
              } else {
                window.location.href = 'http://' + redirectUrl;
              }
              return { dataState: DataState.LOADED, appData: response };
            } else {
              console.error('Invalid redirection URL');
              return { dataState: DataState.ERROR, error: 'Invalid redirection URL' };
            }
          }),
          startWith({dataState:DataState.LOADING}),
          catchError((error: string) => {
            return of({ dataState: DataState.ERROR, error });
          })
        );
      })
    );
  }
}
