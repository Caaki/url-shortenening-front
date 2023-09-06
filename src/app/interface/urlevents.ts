import {EventType} from "../enum/event-type.enum";

export interface UrlEvents{

  id:number;
  type:EventType;
  description:string;
  url:string;
  ip_address?: string;
  device?:string;
  browser?:string;
  created_at:Date;

}
