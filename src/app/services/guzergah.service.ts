import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ListResponseModel } from '../models/listResponseModel';
import { Guzergah } from '../models/guzergah';
import { GuzergahDetay } from '../models/guzergahDetay';
import { OneResponseModel } from '../models/oneResponeModel';
import { DtoPolygonUser } from '../models/dtoPolygonUser';
import { DtoUserLine } from '../models/dtoUserLine';

@Injectable({
  providedIn: 'root',
})
export class GuzergahService {
  apiUrl: string = 'http://localhost:47221/api/';
  constructor(private httpClient: HttpClient) {}
  getUserGuzergah(userId: number): Observable<ListResponseModel<Guzergah>> {
    let newPath = this.apiUrl + 'routeofusers/getroutelist?userid=' + userId;
    return this.httpClient.get<ListResponseModel<Guzergah>>(newPath);
  }
  getGuzergahDetay(
    routeId: number
  ): Observable<OneResponseModel<GuzergahDetay>> {
    let newPath =
      this.apiUrl + 'routeofuserdetail/getroutedetailline?routeid=' + routeId;
    return this.httpClient.get<OneResponseModel<GuzergahDetay>>(newPath);
  }

  getdrawSearch(
    datas: object,
    process: ProcessEnum
  ): Observable<ListResponseModel<DtoPolygonUser>> {
    if (process === ProcessEnum.ST_DWithin) {
      return this.httpClient.post<ListResponseModel<DtoPolygonUser>>(
        this.apiUrl + 'routeofusers/getsearchdwithin',
        datas
      );
    } else if (process === ProcessEnum.ST_Contains) {
      return this.httpClient.post<ListResponseModel<DtoPolygonUser>>(
        this.apiUrl + 'routeofusers/getsearchcontains',
        datas
      );
    } else if (process === ProcessEnum.ST_Intersects) {
      return this.httpClient.post<ListResponseModel<DtoPolygonUser>>(
        this.apiUrl + 'routeofusers/getsearchintersect',
        datas
      );
    } else {
      return this.httpClient.post<ListResponseModel<DtoPolygonUser>>(
        this.apiUrl + 'routeofusers/getsearchdistance',
        datas
      );
    }
  }//
  getUsersLine(datas:object):Observable<ListResponseModel<DtoUserLine>>{
    return this.httpClient.post<ListResponseModel<DtoUserLine>>( this.apiUrl + 'routeofusers/getsearchline',datas);
  }
  getUsersLines(userId:number):Observable<ListResponseModel<DtoUserLine>>{
    return this.httpClient.get<ListResponseModel<DtoUserLine>>( this.apiUrl + 'routeofuserdetail/getroutedetaillines?userId='+userId);
  }
}
enum ProcessEnum {
  ST_DWithin = 1,
  ST_Contains = 2,
  ST_Intersects = 3,
  ST_Distance = 4,
}
