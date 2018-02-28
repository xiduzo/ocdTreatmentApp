import { Component } from '@angular/core';
import { App } from 'ionic-angular';
import { ToastController } from 'ionic-angular';


import { AuthService } from '../../lib/services';
import { Restangular } from 'ngx-restangular';
import { OnboardingPage } from '../onboarding/onboarding';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  private username:string;
  private password:string;

  constructor(
    private appCtrl: App,
    private restangular: Restangular,
    private authService: AuthService,
    private toastCtrl: ToastController
  ) {
  }


  ngOnInit() {

  }

  login() {
    const data = {
      username: this.username,
      password: this.password
    };
    this.restangular.one('users/user').get(data).subscribe((response) => {
      if(response.plain().length === 1) {
        this.authService.getJwtToken(data)
        .then((resp) => {
          console.log('set new token', resp.token);
          this.authService.setLocalToken(resp.token);
          this.appCtrl.getRootNav().push(OnboardingPage);
        })
        .catch((err) => {
          this.toastCtrl.create({
            message: 'Wrong combination of username and password',
            position: 'middle',
            duration: 3000
          }).present();
        });
      } else {
        console.log("user doesnt exist");
      }
    });
  }

}
