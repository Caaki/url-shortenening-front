import {Component, OnInit} from '@angular/core';
import {UserService} from "../../service/user.service";
import {UrlService} from "../../service/url.service";
import {BehaviorSubject, catchError, map, Observable, of, startWith, switchMap} from "rxjs";
import {State} from "../../interface/general-state";
import {CustomHttpResponse, Profile, UrlDetails} from "../../interface/appstates";
import { EventType } from 'src/app/enum/event-type.enum';
import {DataState} from "../../enum/datastate.enum";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-url',
  templateUrl: './url.component.html',
  styleUrls: ['./url.component.css']
})
export class UrlComponent implements OnInit{

  urlState$ :Observable<State<CustomHttpResponse<UrlDetails>>>;
  private dataSubject = new BehaviorSubject<CustomHttpResponse<UrlDetails>>(null);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  private showLogsSubject = new BehaviorSubject<boolean>(true);
  showLogs$ = this.showLogsSubject.asObservable();
  isLoading$ = this.isLoadingSubject.asObservable();
  readonly DataState = DataState;


  constructor(private userService: UserService,
              private urlService:UrlService,
              private activatedRoute: ActivatedRoute,
              private router: Router) {

  }


  ngOnInit(): void {
    this.urlState$ = this.activatedRoute.paramMap.pipe(
     switchMap((params: ParamMap)=>{
       return this.urlService.getUrl(+params.get("id"))
         .pipe(
           map(response=>{
             console.log(response);
             this.dataSubject.next(response);
             return {dataState: DataState.LOADED, appData:response};
           }),
           startWith({dataState: DataState.LOADING}),
           catchError((error: string) => {
             console.log(error);
             this.router.navigate(["/"]);
             return of({dataState: DataState.ERROR, error})
           })
         )
     })
    )
  }

  updateUrl(urlForm: NgForm):void{
    this.isLoadingSubject.next(true)
    console.log(urlForm.value.shortUrl);
    this.urlState$ = this.urlService.update$(urlForm.value)
      .pipe(
        map(response =>{
          console.log("The response is: "+response);
          // this.dataSubject.next({...response, data:{...response.data, url: response.data.url }});
          this.dataSubject.next(response);
          this.isLoadingSubject.next(false);
          return{dataState: DataState.LOADED, appData:this.dataSubject.value};
        }),
        startWith({dataState: DataState.LOADING, appData:this.dataSubject.value}),
        catchError((error: string)=>{
          this.isLoadingSubject.next(false)
          return of({dataState:DataState.LOADED, appData:this.dataSubject.value,error})
        })
      )
  }


}
