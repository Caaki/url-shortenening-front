export interface Url{
  id?: number;
  realUrl: string;
  shortUrl:string;
  createdAt?: Date;
  enabled: boolean;
  alias: string;
}
