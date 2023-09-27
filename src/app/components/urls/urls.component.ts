import {Component, OnInit} from '@angular/core';
import {BehaviorSubject, catchError, map, Observable, of, startWith} from "rxjs";
import {State} from "../../interface/general-state";
import {CustomHttpResponse, Page} from "../../interface/appstates";
import {User} from "../../interface/user";
import {UserService} from "../../service/user.service";
import {UrlService} from "../../service/url.service";
import { EventType } from 'src/app/enum/event-type.enum';
import {DataState} from "../../enum/datastate.enum";
@Component({
  selector: 'app-urls',
  templateUrl: './urls.component.html',
  styleUrls: ['./urls.component.css']
})
export class UrlsComponent implements OnInit{


  homeState$ :Observable<State<CustomHttpResponse<Page &  User>>>;
  private dataSubject = new BehaviorSubject<CustomHttpResponse<Page &  User>>(null);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  private showLogsSubject = new BehaviorSubject<boolean>(true);
  showLogs$ = this.showLogsSubject.asObservable();

  isLoading$ = this.isLoadingSubject.asObservable();
  readonly DataState = DataState;


  constructor(private userService: UserService,private urlService : UrlService) {
  }

  ngOnInit(): void {
    this.homeState$ = this.urlService.urls()
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

  redirect(link: string):void{
    if (link) {
      // @ts-ignore
      if (link.startsWith('http://') || link.startsWith('https://')) {
        window.location.href = link;
      } else {
        window.location.href = 'http://' + link;
      }
    }
  }


}
