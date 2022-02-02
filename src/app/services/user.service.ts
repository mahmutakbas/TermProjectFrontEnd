import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ListResponseModel } from '../models/listResponseModel';
import { User } from '../models/user';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  apiUrl: string = 'http://localhost:47221/api';
  constructor(private httpClient: HttpClient) {}
  getUsers(): Observable<ListResponseModel<User>> {
    let newPath=this.apiUrl+"/users/getlistusers";
    return this.httpClient.get<ListResponseModel<User>>(newPath); 
  }
  getUsersByFriend(userId:number): Observable<ListResponseModel<User>> {
    let newPath=this.apiUrl+"/userfriends/getuserfriends?userId="+userId;
    return this.httpClient.get<ListResponseModel<User>>(newPath); 
  }
}
