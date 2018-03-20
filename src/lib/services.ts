import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';

@Injectable()
export class AuthService {

  private baseUrl:string = 'http://localhost:8000/';
  private token:string;

  constructor(
    protected http: HttpClient,
    protected storage: Storage
  ) { }

  getLocalToken():string {
    return this.token;
  }

  setLocalToken(token:string) {
    this.storage.set('jwtToken', token);
    this.token = token;
  }

  refreshJwtToken(tokenData) {
    return this.http.post(
      this.baseUrl + 'jwt-token-refresh/',
      {token: tokenData.token}
    )
    .toPromise();
  }

  verifyJwtToken(tokenData) {
    return this.http.post(
      this.baseUrl + 'jwt-token-verify/',
      {token: tokenData.token}
    )
    .toPromise();
  }

  getJwtToken(userData) {
    return this.http.post(
      this.baseUrl + 'jwt-token-auth/',
      {username: userData.username, password: userData.password}
    )
    .toPromise();
  }

}

@Injectable()
export class UserService {

  private user:any;

  constructor(
    protected storage: Storage
  ) { }

  setUser(user:string) {
    this.storage.set('user', user);
    this.user = user;
  }

  getUser() {
    return this.user;
  }

}
