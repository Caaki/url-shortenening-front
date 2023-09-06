import {DataState} from "../enum/datastate.enum";
import {User} from "./user";
import {UserEvents} from "./userevents";
import {UrlEvents} from "./urlevents";
import {Role} from "./role";

export interface LoginState{
    dataState: DataState;
    loginSuccess?: boolean;
    error?: string;
    message?: string;
    isUsingMfa?:boolean;
    phone?: string;
}



export interface CustomHttpResponse<T>{
  timestamp: Date;
  statusCode: number;
  status:string;
  message?: string;
  reason?:string;
  developerMessage?: string;
  data?: T;
}

export interface Profile{
  user?: User;
  userEvents?: UserEvents[];
  urlEvents?: UrlEvents[];
  roles?:Role[];
  access_token:string;
  refresh_token:string;
}


