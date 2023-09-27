import {EventType} from "../enum/event-type.enum";

export interface UserEvents{
    id:number;
    type:EventType;
    description:string;
    ipAddress?: string;
    device?:string;
    browser?:string;
    created_at:Date;
}
