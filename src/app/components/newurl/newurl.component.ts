import {Component, OnInit} from '@angular/core';
import {BehaviorSubject, catchError, map, Observable, of, startWith} from "rxjs";
import {State} from "../../interface/general-state";
import {CustomHttpResponse, Page, Profile} from "../../interface/appstates";
import {User} from "../../interface/user";
import {UserService} from "../../service/user.service";
import {UrlService} from "../../service/url.service";
import {DataState} from "../../enum/datastate.enum";
import {NgForm} from "@angular/forms";


@Component({
  selector: 'app-newurl',
  templateUrl: './newurl.component.html',
  styleUrls: ['./newurl.component.css']
})
export class NewurlComponent implements OnInit{


  newUrlState$ :Observable<State<CustomHttpResponse<Profile>>>;
  private dataSubject = new BehaviorSubject<CustomHttpResponse<Profile>>(null);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();
  readonly DataState = DataState;


  constructor(private userService: UserService,private urlService : UrlService) {
  }

  ngOnInit(): void {
    this.newUrlState$ = this.userService.profile$()
      .pipe(map(response => {
          this.dataSubject.next(response);
          return {dataState: DataState.LOADED,appData:response };
        }),
        startWith({dataState: DataState.LOADING}),
        catchError((error: string) => {
          return of({dataState: DataState.ERROR,  error})
        })
      )
  }

  createUrl(newUrlForm: NgForm):void{
  console.log(newUrlForm.value);
    const enabled = newUrlForm.value.enabled === "true";
    this.newUrlState$ = this.urlService.newUrl({
      alias: newUrlForm.value.alias,
      realUrl: newUrlForm.value.realUrl,
      shortUrl: newUrlForm.value.shortUrl,
      enabled: enabled,
    }).pipe(map(response => {
          console.log(response);
          newUrlForm.reset();
          this.isLoadingSubject.next(false);
          return {dataState: DataState.LOADED,appData: this.dataSubject.value };
        }),
        startWith({dataState: DataState.LOADED, appData: this.dataSubject.value}),
        catchError((error: string) => {
          this.isLoadingSubject.next(false);
          return of({dataState: DataState.LOADED,  error})
        })
      )
  }

}
