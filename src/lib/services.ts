import { Injectable } from '@angular/core';
import { App } from 'ionic-angular';

import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';

@Injectable()

export class AuthService {

  private baseUrl:string = 'http://localhost:8000/';
  private token:string;

  constructor(
    private appCtrl: App,
    private http: HttpClient,
    protected storage: Storage
  ) { }

  getLocalToken():string {
    return this.token;
  }

  setLocalToken(token:string) {
    console.log(token);
    this.storage.set('jwtToken', token);
    this.token = token;
  }

  refreshJwtToken(tokenData) {
    return this.http.post(
      this.baseUrl + 'jwt-token-refresh/',
      tokenData
    )
    .toPromise();
  }

  verifyJwtToken(tokenData) {
    return this.http.post(
      this.baseUrl + 'jwt-token-verify/',
      tokenData
    )
    .toPromise();
  }

  getJwtToken(userData) {
    return this.http.post(
      this.baseUrl + 'jwt-token-auth/',
      userData
    )
    .toPromise();
  }


}
