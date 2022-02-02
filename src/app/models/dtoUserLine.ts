import { PointDetay, PointM } from './pointm';

export interface DtoUserLine {
    id:number;
  name: string;
  surname: string;
  email: string;
  firstPoint: PointM;
  lastPoint: PointM;
  yol:PointDetay;
  routeStartDate: Date;
}
