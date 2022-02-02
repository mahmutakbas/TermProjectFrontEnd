import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginModel } from '../models/loginModel';
import { OneResponseModel } from '../models/oneResponeModel';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiUrl: string = 'http://localhost:47221/api/users/login';
  constructor(private httpClient: HttpClient) {}
  login(loginModel: LoginModel) {
    return this.httpClient.post<OneResponseModel<User>>(this.apiUrl, loginModel);
  }
  isAuthenticated() {
    if (localStorage.getItem('token')) {
      return true;
    } else {
      return false;
    }
  }
}
