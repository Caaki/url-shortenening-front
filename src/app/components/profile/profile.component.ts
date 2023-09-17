import {Component, OnInit} from '@angular/core';
import {BehaviorSubject, catchError, map, Observable, of, startWith} from "rxjs";
import {CustomHttpResponse, Profile} from "../../interface/appstates";
import {DataState} from "../../enum/datastate.enum";
import {UserService} from "../../service/user.service";
import {NgForm} from "@angular/forms";
import {State} from "../../interface/general-state";
import { EventType } from 'src/app/enum/event-type.enum';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit{


  profileState$ :Observable<State<CustomHttpResponse<Profile>>>;
  private dataSubject = new BehaviorSubject<CustomHttpResponse<Profile>>(null);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  private showLogsSubject = new BehaviorSubject<boolean>(true);
  showLogs$ = this.showLogsSubject.asObservable();

  isLoading$ = this.isLoadingSubject.asObservable();

  readonly DataState = DataState;
  readonly EventType = EventType;

  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
    this.profileState$ = this.userService.profile$()
      .pipe(map(response => {
          console.log(response);
            this.dataSubject.next(response);
            return {dataState: DataState.LOADED,appData:response };
        }),
        startWith({dataState: DataState.LOADING}),
        catchError((error: string) => {
          return of({dataState: DataState.ERROR, appData:this.dataSubject.value, error})
        })
      )
  }


  updateProfile(profileForm: NgForm):void{
    this.isLoadingSubject.next(true)
    this.profileState$ = this.userService.update$(profileForm.value)
      .pipe(
        map(response =>{
          console.log(response);
          this.dataSubject.next({...response, data:response.data});
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

  updateUserPassword(updatePasswordForm: NgForm):void{
    this.isLoadingSubject.next(true);
    if (updatePasswordForm.value.newPassword === updatePasswordForm.value.confirmPassword){
      this.profileState$= this.userService.updatePassword$(updatePasswordForm.value)
        .pipe(
          map(response =>{
            this.dataSubject.next({...response, data:response.data})
            updatePasswordForm.reset();
            this.isLoadingSubject.next(false);
            return{dataState:DataState.LOADED,appData: this.dataSubject.value};
          }),
          startWith({dataState:DataState.LOADING,appData: this.dataSubject.value}),
          catchError((error: string)=>{
            this.isLoadingSubject.next(false);
            updatePasswordForm.reset();
            return of({dataState:DataState.LOADED, appData:this.dataSubject.value,error})
          })
        )
    }else{
      updatePasswordForm.reset();
      this.isLoadingSubject.next(false);
    }
  }

  updateUserSettings(settingsForm: NgForm):void{
    this.isLoadingSubject.next(true)
    this.profileState$ = this.userService.updateUserSettings$(settingsForm.value)
      .pipe(
        map(response =>{
          console.log(response);
          this.dataSubject.next({...response, data:response.data});
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

  toggleMfa():void{
    this.isLoadingSubject.next(true)
    this.profileState$ = this.userService.toggleMfa$()
      .pipe(
        map(response =>{
          console.log(response);
          this.dataSubject.next({...response, data:response.data});
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

  updatePicture(image: File):void{

    if(image){
      this.isLoadingSubject.next(true)
      this.profileState$ = this.userService.updateImage$(this.getFormData(image))
        .pipe(
          map(response =>{
            console.log(response);
            this.dataSubject.next(
              {...response, data:{...response.data, user: {...response.data.user, imageUrl: `${response.data.user.imageUrl}?time=${new Date().getTime()}`}}});
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

  toggleLogs(): void{
    this.showLogsSubject.next(!this.showLogsSubject.value)
  }

  private getFormData(image: File){
    const formData = new FormData();
    formData.append("image", image);
    return formData;
  }
}
