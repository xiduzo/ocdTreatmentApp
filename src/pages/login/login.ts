import { Component } from '@angular/core';
import { App } from 'ionic-angular';
//import { ToastController } from 'ionic-angular';


import { AuthService, UserService } from '@/lib/services';
import { Restangular } from 'ngx-restangular';
import { OnboardingPage } from '@/pages/onboarding/onboarding';
import { SignUpPage } from '@/pages/signup/signup'

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  private username:string;
  private password:string;
  private err:any;

  constructor(
    private appCtrl: App,
    private restangular: Restangular,
    private authService: AuthService,
    //private toastCtrl: ToastController,
    private userService: UserService
  ) {
  }

  login() {
    this.err = { text: 'logging in'};
    const data = {
      username: this.username,
      password: this.password
    };
    this.restangular.one('users/validate').get(data).subscribe((response) => {
      this.err = { text: 'validated'};
      if(response.data.plain().length === 1) {
        this.err = { text: 'user found' };
        this.userService.setUser(response.data.plain()[0].profile);
        this.authService.getJwtToken(data)
        .then((resp:any) => {
          this.err = resp;
          this.authService.setLocalToken(resp.token);
          this.appCtrl.getRootNav().push(OnboardingPage);
        })
        .catch((err) => {
          this.err = err;
          // this.toastCtrl.create({
          //   message: 'Wrong combination of username and password',
          //   position: 'middle',
          //   duration: 3000
          // }).present();
        });
      } else {
        this.err = { text: 'user doesnt exist' };
      }
    }, (err) => {
      this.err = err;
    });
  }

  signUp() {
    this.appCtrl.getRootNav().push(SignUpPage);
  }

}
