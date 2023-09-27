import {EventType} from "../enum/event-type.enum";

export interface UrlEvents{

  id:number;
  alisa:string;
  realUrl:string;
  shortUrl:string;
  userId:number;
  urlId:number;
  device?:string;
  browser?:string;
  ipAddress?: string;
  createdAt:Date;

}
